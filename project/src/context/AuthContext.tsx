"use client";
// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const signInProgress = useRef(false); // Prevent multiple sign-in attempts

  const loadProfile = async (u: User) => {
    try {
      await upsertUser({
        uid:         u.uid,
        displayName: u.displayName,
        email:       u.email,
        photoURL:    u.photoURL,
      });
      const p = await getUser(u.uid);
      setProfile(p);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
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
    // Prevent multiple simultaneous sign-in attempts
    if (signInProgress.current) {
      console.log("Sign in already in progress, ignoring...");
      return;
    }

    try {
      signInProgress.current = true;
      
      // Sign out first to clear any pending state (prevents the error)
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      const result = await signInWithPopup(auth, provider);
      await loadProfile(result.user);
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle popup blocked error
      if (error.code === 'auth/popup-blocked') {
        alert("Popup was blocked by your browser. Please allow popups for this site and try again.");
      } 
      // Handle popup closed by user
      else if (error.code === 'auth/popup-closed-by-user') {
        console.log("Sign in cancelled by user");
      }
      // Handle other errors
      else {
        console.error("Unexpected sign in error:", error);
      }
      
      throw error;
    } finally {
      signInProgress.current = false;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
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