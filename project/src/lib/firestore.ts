// lib/firestore.ts
// ─────────────────────────────────────────────────────────────────────────────
// All Firestore read/write operations live here.
// Components import from this file — never call Firestore directly in UI.
// ─────────────────────────────────────────────────────────────────────────────
import {
  doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit,
  serverTimestamp, Timestamp, increment,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, Monitor, PingLog, PingInterval, MonitorStatus } from "@/types";

// ── Helper: Timestamp → Date ──────────────────────────────────────────────────
const toDate = (v: unknown): Date | null =>
  v instanceof Timestamp ? v.toDate() : null;

// ── USERS ─────────────────────────────────────────────────────────────────────

/** Upsert user after sign-in */
export async function upsertUser(user: {
  uid: string; displayName: string | null; email: string | null; photoURL: string | null;
}): Promise<void> {
  const ref  = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const base = {
    uid:         user.uid,
    name:        user.displayName ?? "Anonymous",
    email:       user.email ?? "",
    photoURL:    user.photoURL ?? "",
    provider:    "google",
    lastLoginAt: serverTimestamp(),
  };
  if (snap.exists()) {
    await setDoc(ref, base, { merge: true });
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp(), totalPings: 0, totalMonitors: 0 });
  }
}

/** Get user profile */
export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid:           d.uid,
    name:          d.name,
    email:         d.email,
    photoURL:      d.photoURL,
    provider:      d.provider,
    createdAt:     toDate(d.createdAt),
    lastLoginAt:   toDate(d.lastLoginAt),
    totalPings:    d.totalPings ?? 0,
    totalMonitors: d.totalMonitors ?? 0,
  };
}

// ── MONITORS ──────────────────────────────────────────────────────────────────

/** Create a new monitor */
export async function createMonitor(
  userId: string,
  data: {
    name: string; url: string; intervalMinutes: PingInterval;
    alertOnDown: boolean; alertEmail: string; notesOrTag: string;
  }
): Promise<string> {
  const col = collection(db, "monitors");
  const ref = await addDoc(col, {
    userId,
    name:            data.name,
    url:             data.url,
    intervalMinutes: data.intervalMinutes,
    status:          "unknown" as MonitorStatus,
    isPaused:        false,
    createdAt:       serverTimestamp(),
    updatedAt:       serverTimestamp(),
    lastCheckedAt:   null,
    lastLatencyMs:   null,
    uptime7d:        100,
    uptime30d:       100,
    totalPings:      0,
    successPings:    0,
    failedPings:     0,
    alertOnDown:     data.alertOnDown,
    alertEmail:      data.alertEmail,
    notesOrTag:      data.notesOrTag,
  });
  // Increment user monitor count
  await updateDoc(doc(db, "users", userId), { totalMonitors: increment(1) });
  return ref.id;
}

/** Get all monitors for a user */
export async function getMonitors(userId: string): Promise<Monitor[]> {
  const q    = query(collection(db, "monitors"), where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:              d.id,
      userId:          data.userId,
      name:            data.name,
      url:             data.url,
      intervalMinutes: data.intervalMinutes,
      status:          data.status,
      isPaused:        data.isPaused,
      createdAt:       toDate(data.createdAt),
      updatedAt:       toDate(data.updatedAt),
      lastCheckedAt:   toDate(data.lastCheckedAt),
      lastLatencyMs:   data.lastLatencyMs ?? null,
      uptime7d:        data.uptime7d ?? 100,
      uptime30d:       data.uptime30d ?? 100,
      totalPings:      data.totalPings ?? 0,
      successPings:    data.successPings ?? 0,
      failedPings:     data.failedPings ?? 0,
      alertOnDown:     data.alertOnDown ?? false,
      alertEmail:      data.alertEmail ?? "",
      notesOrTag:      data.notesOrTag ?? "",
    };
  });
}

/** Update monitor after a ping */
export async function updateMonitorAfterPing(
  monitorId: string,
  userId: string,
  result: { success: boolean; latencyMs: number | null; statusCode: number | null }
): Promise<void> {
  const ref    = doc(db, "monitors", monitorId);
  const snap   = await getDoc(ref);
  if (!snap.exists()) return;
  const data   = snap.data();
  const total  = (data.totalPings ?? 0) + 1;
  const succ   = (data.successPings ?? 0) + (result.success ? 1 : 0);
  const failed = (data.failedPings ?? 0) + (result.success ? 0 : 1);
  const uptime = Math.round((succ / total) * 100);

  await updateDoc(ref, {
    status:        result.success ? "up" : "down",
    lastCheckedAt: serverTimestamp(),
    lastLatencyMs: result.latencyMs,
    updatedAt:     serverTimestamp(),
    totalPings:    total,
    successPings:  succ,
    failedPings:   failed,
    uptime7d:      uptime,
    uptime30d:     uptime,
  });
  // Increment global user ping count
  await updateDoc(doc(db, "users", userId), { totalPings: increment(1) });
}

/** Toggle pause/resume monitor */
export async function toggleMonitorPause(monitorId: string, isPaused: boolean): Promise<void> {
  await updateDoc(doc(db, "monitors", monitorId), {
    isPaused,
    status:    isPaused ? "paused" : "unknown",
    updatedAt: serverTimestamp(),
  });
}

/** Update monitor settings */
export async function updateMonitor(monitorId: string, data: Partial<Monitor>): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, ...rest } = data as Monitor;
  await updateDoc(doc(db, "monitors", monitorId), { ...rest, updatedAt: serverTimestamp() });
}

/** Delete a monitor and all its logs */
export async function deleteMonitor(monitorId: string, userId: string): Promise<void> {
  await deleteDoc(doc(db, "monitors", monitorId));
  await updateDoc(doc(db, "users", userId), { totalMonitors: increment(-1) });
  // Note: deleting sub-collection logs is optional — Firestore doesn't cascade.
  // For production, use a Cloud Function or batch delete.
}

// ── PING LOGS ─────────────────────────────────────────────────────────────────

/** Save a ping log entry */
export async function savePingLog(log: {
  monitorId: string; userId: string; url: string;
  result: "success" | "error" | "timeout";
  statusCode: number | null; latencyMs: number | null; errorMessage: string | null;
}): Promise<void> {
  await addDoc(collection(db, "pingLogs"), { ...log, timestamp: serverTimestamp() });
}

/** Get recent ping logs for a monitor */
export async function getPingLogs(monitorId: string, count = 50): Promise<PingLog[]> {
  const q    = query(
    collection(db, "pingLogs"),
    where("monitorId", "==", monitorId),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:           d.id,
      monitorId:    data.monitorId,
      userId:       data.userId,
      url:          data.url,
      result:       data.result,
      statusCode:   data.statusCode ?? null,
      latencyMs:    data.latencyMs ?? null,
      errorMessage: data.errorMessage ?? null,
      timestamp:    toDate(data.timestamp),
    };
  });
}

/** Get all ping logs for a user (dashboard overview) */
export async function getUserPingLogs(userId: string, count = 100): Promise<PingLog[]> {
  const q    = query(
    collection(db, "pingLogs"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id:           d.id,
      monitorId:    data.monitorId,
      userId:       data.userId,
      url:          data.url,
      result:       data.result,
      statusCode:   data.statusCode ?? null,
      latencyMs:    data.latencyMs ?? null,
      errorMessage: data.errorMessage ?? null,
      timestamp:    toDate(data.timestamp),
    };
  });
}
