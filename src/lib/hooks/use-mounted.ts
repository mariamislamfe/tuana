"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True only after the component has hydrated on the client. Use this instead
 * of `useEffect(() => setMounted(true), [])` to read client-only state
 * (localStorage-backed zustand stores, etc.) without a hydration mismatch —
 * `useSyncExternalStore` is the React-sanctioned way to do this and doesn't
 * trip the set-state-in-effect / purity lint rules an effect-based flag does.
 */
export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
