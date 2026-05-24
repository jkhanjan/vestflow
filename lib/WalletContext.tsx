"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  isConnected
} from "@stellar/freighter-api";
import { connectWallet } from "./stellar";


interface WalletCtx {
  publicKey: string | null;
  setPublicKey: (k: string | null) => void;
}

const WalletContext = createContext<WalletCtx>({
  publicKey: null,
  setPublicKey: () => {},
});

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    async function restoreWallet() {
      try {
        const connected = await isConnected();

        if (connected) {
          const key = await connectWallet();
          setPublicKey(key);
        }
      } catch (err) {
        console.error(err);
      }
    }

    restoreWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ publicKey, setPublicKey }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
