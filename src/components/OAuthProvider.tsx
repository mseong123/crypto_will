import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSpecificData {
  maxEpoch: number;
  privateKey: string;
  randomness: string;
  nonce: string;
}

interface OAuthContextType {
  jwt: string;
  userSpecificData: UserSpecificData;
  setJwt: (jwt: string) => void;
  setUserSpecificData: (data: UserSpecificData) => void;
}

const OAuthContext = createContext<OAuthContextType | undefined>(undefined);

export const OAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = useState<string | undefined>(undefined);
  const [userSpecificData, setUserSpecificData] = useState<UserSpecificData | undefined>(undefined);

  useEffect(() => {
    const storedJwt = sessionStorage.getItem('jwt');
    const storedUserSpecificData = sessionStorage.getItem('userSpecificData');
    if (storedJwt) setJwt(storedJwt);
    if (storedUserSpecificData) setUserSpecificData(JSON.parse(storedUserSpecificData));
  }, []);

  useEffect(() => {
    if (jwt) sessionStorage.setItem('jwt', jwt);
    if (userSpecificData) sessionStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
  }, [jwt, userSpecificData]);

  return (
    <OAuthContext.Provider value={{ jwt: jwt!, userSpecificData: userSpecificData!, setJwt, setUserSpecificData }}>
      {children}
    </OAuthContext.Provider>
  );
};

export const useOAuth = (): OAuthContextType => {
  const context = useContext(OAuthContext);
  if (context === undefined) {
    throw new Error('useOAuth must be used within an OAuthProvider');
  }
  return context;
};

