"use client";
import { useEffect, useState } from "react";

export default function RegisterSW() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!('serviceWorker' in navigator)) return;

    // Check if we're in production or Vercel
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    
    // Only register in production environments
    if (!isProduction && !isVercel) {
      console.log('Service Worker: Skipped in development');
      return;
    }

    const registerSW = async () => {
      try {
        // Check if sw.js exists before registering
        const response = await fetch('/sw.js', { method: 'HEAD' });
        if (!response.ok) {
          console.log('Service Worker: Not available');
          return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('Service Worker: Registered successfully');
        setSwRegistration(registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      } catch (error) {
        console.log('Service Worker: Registration skipped', error);
      }
    };

    // Register after page load
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }

    // Listen for controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker: Controller changed');
    });

    return () => {
      window.removeEventListener('load', registerSW);
    };
  }, []);

  const handleUpdate = () => {
    if (swRegistration?.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">New version available!</span>
        <button
          onClick={handleUpdate}
          className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          Update
        </button>
      </div>
    </div>
  );
}