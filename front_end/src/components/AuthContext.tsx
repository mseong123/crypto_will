import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';

export enum AuthState {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
  OAUTH = 'OAUTH',
  ZK = 'ZK',
  WALLET = 'WALLET',
}

interface AuthContextType {
  authState: AuthState;
  jwt?: string;
  userSpecificData?: Record<string, any>;
  zkLoginSignature?: string;
  zkLoginAddress?: string;
  ephemeralSecretKey?: string;
  walletAccount?: string;
  logout: () => void;
  setJwt: (jwt: string) => void;
  setUserSpecificData: (data: Record<string, any>) => void;
  setZkLoginSignature: (signature: string) => void;
  setZkLoginAddress: (address: string) => void;
  setEphemeralSecretKey: (key: string) => void;
  setWalletAccount: (account: string) => void;
  setAuthState: (state: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.NOT_AUTHENTICATED);
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [userSpecificData, setUserSpecificData] = useState<Record<string, any> | undefined>(undefined);
  const [zkLoginSignature, setZkLoginSignature] = useState<string | undefined>(undefined);
  const [zkLoginAddress, setZkLoginAddress] = useState<string | undefined>(undefined);
  const [ephemeralSecretKey, setEphemeralSecretKey] = useState<string | undefined>(undefined);
  const [walletAccount, setWalletAccount] = useState<string | undefined>(undefined);

  useEffect(() => {
    const storedAuthState = sessionStorage.getItem('authState') as AuthState | null;
	console.log(storedAuthState)
    const storedJwt = sessionStorage.getItem('jwt');
    const storedUserSpecificData = sessionStorage.getItem('userSpecificData');
    const storedZkLoginSignature = sessionStorage.getItem('zkLoginSignature');
    const storedZkLoginAddress = sessionStorage.getItem('zkLoginAddress');
    const storedEphemeralSecretKey = sessionStorage.getItem('ephemeralSecretKey');
    const storedWalletAccount = sessionStorage.getItem('walletAccount');

    if (storedAuthState) {
      setAuthState(storedAuthState);
      if (storedAuthState === AuthState.OAUTH) {
        setJwt(storedJwt ?? undefined);
        setUserSpecificData(storedUserSpecificData ? JSON.parse(storedUserSpecificData) : undefined);
      } else if (storedAuthState === AuthState.ZK) {
        setZkLoginSignature(storedZkLoginSignature ?? undefined);
        setZkLoginAddress(storedZkLoginAddress ?? undefined);
        setEphemeralSecretKey(storedEphemeralSecretKey ?? undefined);
      } 
    }
  }, []);

  const logout = () => {
    sessionStorage.clear();
    setAuthState(AuthState.NOT_AUTHENTICATED);
    setJwt(undefined);
    setUserSpecificData(undefined);
    setZkLoginSignature(undefined);
    setZkLoginAddress(undefined);
    setEphemeralSecretKey(undefined);
  };

  useEffect(() => {
    sessionStorage.setItem('authState', authState);
    // if (authState === AuthState.OAUTH) {
    //   sessionStorage.setItem('jwt', jwt ?? '');
    //   sessionStorage.setItem('userSpecificData', JSON.stringify(userSpecificData ?? {}));
    // } else if (authState === AuthState.ZK) {
    //   sessionStorage.setItem('zkLoginSignature', zkLoginSignature ?? '');
    //   sessionStorage.setItem('zkLoginAddress', zkLoginAddress ?? '');
    //   sessionStorage.setItem('ephemeralSecretKey', ephemeralSecretKey ?? '');
    // } 
  }, [authState, jwt, userSpecificData, zkLoginSignature, zkLoginAddress, ephemeralSecretKey, walletAccount]);

  return (
    <AuthContext.Provider value={{
      authState,
      jwt,
      userSpecificData,
      zkLoginSignature,
      zkLoginAddress,
      ephemeralSecretKey,
      walletAccount,
      logout,
      setJwt,
      setUserSpecificData,
      setZkLoginSignature,
      setZkLoginAddress,
      setEphemeralSecretKey,
      setAuthState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

