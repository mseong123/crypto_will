// WalletContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletProvider as BaseWalletProvider, useCurrentAccount } from '@mysten/wallet-standard';
import type { WalletProviderProps } from '@mysten/wallet-standard';

interface WalletContextProps {
    currentAccount: ReturnType<typeof useCurrentAccount>;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, ...props }) => {
    const currentAccount = useCurrentAccount();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        setConnected(!!currentAccount);
    }, [currentAccount]);

    const connectWallet = () => {
        // Logic to connect the wallet
        // Ensure only one wallet can be connected
    };

    const disconnectWallet = () => {
        // Logic to disconnect the wallet
        setConnected(false);
    };

    return (
        <WalletContext.Provider value={{ currentAccount, connectWallet, disconnectWallet }}>
            <BaseWalletProvider {...props}>{children}</BaseWalletProvider>
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

