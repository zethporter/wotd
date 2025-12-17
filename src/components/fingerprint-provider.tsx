import { createContext, useContext, useEffect, useState } from "react";
import fp from "@fingerprintjs/fingerprintjs";

type FingerprintProviderProps = {
  children: React.ReactNode;
  defaultFingerprint: string | null;
  storageKey?: string;
};

type FingerprintProviderState = {
  fingerprint: string | null;
};

const initialState: FingerprintProviderState = {
  fingerprint: null,
};

const FingerprintProviderContext =
  createContext<FingerprintProviderState>(initialState);

export function FingerprintProvider({
  children,
  defaultFingerprint = null,
  storageKey = "calculated-fingerprint",
  ...props
}: FingerprintProviderProps) {
  // 1. Initialize state with the defaultTheme (safe for SSR).
  //    The actual theme from localStorage will be loaded in useEffect.
  const [fingerprint, setFingerprint] = useState<string | null>(
    defaultFingerprint,
  );

  // 2. useEffect to load theme from localStorage on client-side mount
  useEffect(() => {
    // This code only runs in the browser
    const storedFingerprint = localStorage.getItem(storageKey) as string;
    if (storedFingerprint) {
      setFingerprint(storedFingerprint);
    } else {
      fp.load()
        .then((fp) => fp.get())
        .then((res) => {
          setFingerprint(res.visitorId);
          localStorage.setItem(storageKey, res.visitorId);
        })
        .catch(() => setFingerprint(defaultFingerprint));
    }
  }, [defaultFingerprint, storageKey]); // Depend on defaultTheme and storageKey

  return (
    <FingerprintProviderContext.Provider {...props} value={{ fingerprint }}>
      {children}
    </FingerprintProviderContext.Provider>
  );
}

export const useFingerprint = () => {
  const context = useContext(FingerprintProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a FingerprintProvider");

  return context;
};
