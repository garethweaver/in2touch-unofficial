"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "@/app/_firebase/config";

// How long Firebase may report "not connected" before we treat the app as
// offline. Covers the initial connection on page load and short blips.
export const OFFLINE_GRACE_MS = 3000;

const ConnectionContext = createContext<boolean>(true);

/** true while the app can reach the database (defaults to true outside the provider) */
export const useOnline = () => useContext(ConnectionContext);

function useConnectionStatus() {
  const [browserOnline, setBrowserOnline] = useState(true);
  // optimistic until Firebase has been disconnected for longer than the grace period
  const [dbConnected, setDbConnected] = useState(true);

  useEffect(() => {
    const updateBrowser = () => setBrowserOnline(navigator.onLine);
    updateBrowser();
    window.addEventListener("online", updateBrowser);
    window.addEventListener("offline", updateBrowser);

    let timer: ReturnType<typeof setTimeout> | undefined;
    // navigator.onLine can't tell "wifi with no internet" apart from online,
    // so also watch Firebase's own connection state
    const unsubscribe = onValue(ref(database, ".info/connected"), (snap) => {
      clearTimeout(timer);
      if (snap.val() === true) {
        setDbConnected(true);
      } else {
        timer = setTimeout(() => setDbConnected(false), OFFLINE_GRACE_MS);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
      window.removeEventListener("online", updateBrowser);
      window.removeEventListener("offline", updateBrowser);
    };
  }, []);

  return browserOnline && dbConnected;
}

export function ConnectionProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const online = useConnectionStatus();
  return (
    <ConnectionContext.Provider value={online}>
      {children}
    </ConnectionContext.Provider>
  );
}
