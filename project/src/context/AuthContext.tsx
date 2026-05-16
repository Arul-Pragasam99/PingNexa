"use client";
// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { upsertUser, getUser } from "@/lib/firestore";
import type { UserProfile } from "@/types";

interface AuthContextValue {
  user:          User | null;
  profile:       UserProfile | null;
  loading:       boolean;
  signInGoogle:  () => Promise<void>;
  signOutUser:   () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:           null,
  profile:        null,
  loading:        true,
  signInGoogle:   async () => {},
  signOutUser:    async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (u: User) => {
    await upsertUser({
      uid:         u.uid,
      displayName: u.displayName,
      email:       u.email,
      photoURL:    u.photoURL,
    });
    const p = await getUser(u.uid);
    setProfile(p);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    await loadProfile(result.user);
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInGoogle, signOutUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
