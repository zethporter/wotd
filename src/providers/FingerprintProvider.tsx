// src/contexts/FingerprintContext.tsx
import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  type Accessor,
  type JSX,
} from "solid-js";

// Define the shape of our context value
interface FingerprintContextValue {
  fingerprint: Accessor<string | null>;
  isLoading: Accessor<boolean>;
}

// Create the context
const FingerprintContext = createContext<FingerprintContextValue | undefined>(
  undefined,
);

// Custom hook to use the fingerprint context
export function useFingerprint() {
  const context = useContext(FingerprintContext);
  if (context === undefined) {
    throw new Error("useFingerprint must be used within a FingerprintProvider");
  }
  return context;
}

// Fingerprint Provider component
interface FingerprintProviderProps {
  children: JSX.Element;
}

export function FingerprintProvider(props: FingerprintProviderProps) {
  const [fingerprint, setFingerprint] = createSignal<string | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  // This effect will run once on the client-side
  // and load the FingerprintJS library dynamically.
  createEffect(() => {
    // Check if we are in a browser environment
    if (typeof window !== "undefined") {
      import("@fingerprintjs/fingerprintjs")
        .then((FingerprintJS) => FingerprintJS.load())
        .then((fp) => fp.get())
        .then((result) => {
          console.log("got fingerprint", { fingerprint: result.visitorId });
          setFingerprint(result.visitorId);
        })
        .catch((error) => {
          console.error(
            "Failed to load FingerprintJS or get fingerprint:",
            error,
          );
          setFingerprint(null); // Or handle error appropriately
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // In SSR, we can't generate a fingerprint.
      // Set isLoading to false immediately.
      setIsLoading(false);
    }
  });

  const value: FingerprintContextValue = {
    fingerprint,
    isLoading,
  };

  return (
    <FingerprintContext.Provider value={value}>
      {props.children}
    </FingerprintContext.Provider>
  );
}
