import { createSignal, createEffect } from "solid-js";

// Generic hook for creating a Solid Signal that persists to localStorage
export function createLocalStore<T>(key: string, initialValue: T) {
  // Try to get the initial value from localStorage, otherwise use the provided initialValue
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = createSignal<T>(initial);

  // Use createEffect to synchronize the signal's value with localStorage
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(value()));
  });

  return value; // Returning the signal's getter
}
