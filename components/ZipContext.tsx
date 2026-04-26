"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ZipContextType = {
  zip: string;
  setZip: (z: string) => void;
};

const ZipContext = createContext<ZipContextType | null>(null);

export function ZipProvider({ children }: { children: ReactNode }) {
  const [zip, setZipState] = useState(() =>
    typeof window !== "undefined" ? (sessionStorage.getItem("handi_zip") ?? "") : ""
  );

  const setZip = (z: string) => {
    setZipState(z);
    if (z) sessionStorage.setItem("handi_zip", z);
    else sessionStorage.removeItem("handi_zip");
  };

  return (
    <ZipContext.Provider value={{ zip, setZip }}>
      {children}
    </ZipContext.Provider>
  );
}

export function useZip() {
  const ctx = useContext(ZipContext);
  if (!ctx) throw new Error("useZip must be used within ZipProvider");
  return ctx;
}
