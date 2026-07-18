"use client";

import { useEffect, useState } from "react";

/** Persists state to localStorage after the initial client mount. */
export function usePersistedState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount — storage is only
    // readable client-side, so this can't be done during initial render.
    try {
      const raw = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage unavailable (private browsing etc.) — fail silently
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}
