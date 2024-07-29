import React, { createContext, useContext, useState, useEffect } from 'react';

interface ZkContextType {
  zkLoginSignature: string;
  zkLoginAddress: string;
  ephemeralSecretKey: string;
  setZkLoginSignature: (signature: string) => void;
  setZkLoginAddress: (address: string) => void;
  setEphemeralSecretKey: (key: string) => void;
}

const ZkContext = createContext<ZkContextType | undefined>(undefined);

export const ZkProvider = ({ children }: { children: React.ReactNode }) => {
  const [zkLoginSignature, setZkLoginSignature] = useState<string | undefined>(undefined);
  const [zkLoginAddress, setZkLoginAddress] = useState<string | undefined>(undefined);
  const [ephemeralSecretKey, setEphemeralSecretKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedZkLoginSignature = sessionStorage.getItem('zkLoginSignature');
    const storedZkLoginAddress = sessionStorage.getItem('zkLoginAddress');
    const storedEphemeralSecretKey = sessionStorage.getItem('ephemeralSecretKey');
    if (storedZkLoginSignature) setZkLoginSignature(storedZkLoginSignature);
    if (storedZkLoginAddress) setZkLoginAddress(storedZkLoginAddress);
    if (storedEphemeralSecretKey) setEphemeralSecretKey(storedEphemeralSecretKey);
  }, []);

  useEffect(() => {
    if (zkLoginSignature) sessionStorage.setItem('zkLoginSignature', zkLoginSignature);
    if (zkLoginAddress) sessionStorage.setItem('zkLoginAddress', zkLoginAddress);
    if (ephemeralSecretKey) sessionStorage.setItem('ephemeralSecretKey', ephemeralSecretKey);
  }, [zkLoginSignature, zkLoginAddress, ephemeralSecretKey]);

  return (
    <ZkContext.Provider value={{ zkLoginSignature: zkLoginSignature!, zkLoginAddress: zkLoginAddress!, ephemeralSecretKey: ephemeralSecretKey!, setZkLoginSignature, setZkLoginAddress, setEphemeralSecretKey }}>
      {children}
    </ZkContext.Provider>
  );
};

export const useZk = (): ZkContextType => {
  const context = useContext(ZkContext);
  if (context === undefined) {
    throw new Error('useZk must be used within a ZkProvider');
  }
  return context;
};
