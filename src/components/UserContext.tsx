import { useCurrentAccount } from "@mysten/dapp-kit";
import { useAuthCallback, useEnokiFlow, useZkLogin } from "@mysten/enoki/react";
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from "react";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

interface LoginContextType {
	isLoggedIn: LogStatus;
	userDetails: UserDetails;
	login: () => void;
	logOut: () => void;
}

const UserContext = createContext<LoginContextType | undefined>(undefined);

export enum LogStatus {
	zk,
	wallet,
	loggedOut
}

interface UserDetails {
	provider: string;
	salt: string;
	address: string;
}

interface UserProviderProps {
	children: ReactNode;
}

const UserDetailsInitialValues = {
	provider: "",
	salt: "",
	address: "",
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const flow = useEnokiFlow();
	const zkLogin = useZkLogin();
	const account = useCurrentAccount()
	useAuthCallback();

	const [isLoggedIn, setIsLoggedIn] = useState(LogStatus.loggedOut);
	const [userDetails, setUserDetails] = useState<UserDetails>(
		UserDetailsInitialValues
	);
	useEffect(() => {
		if (account) {
			setIsLoggedIn(LogStatus.wallet)
		} else {
			setIsLoggedIn(LogStatus.loggedOut)
		}
	}, [account]);

	const login = async () => {
		const protocol = window.location.protocol;
		const host = window.location.host;
		// Set the redirect URL to the location that should
		// handle authorization callbacks in your app
		const redirectUrl = import.meta.env.VITE_APP_REDIRECT_URI;

		flow.createAuthorizationURL({
				provider: 'google',
				network: 'testnet',
				clientId: GOOGLE_CLIENT_ID!,
				redirectUrl,
			})
			.then((url) => {
				window.location.href = url;
			})
			.catch((error) => {
				console.error("error zk", error);
			});
		// 	try {
		//    window.location.href = await flow.createAuthorizationURL({
		//      provider: "google",
		//      clientId: GOOGLE_CLIENT_ID,
		//      redirectUrl: window.location.origin,
		// 	network: "testnet"
		//    });
		// } catch (err) {
		// 		console.error("error logging in", err)
		// 	}
	};

	const logOut = async () => {
		flow.logout();
		clearStates();
	};

	const clearStates = () => {
		setIsLoggedIn(LogStatus.loggedOut);
		setUserDetails(UserDetailsInitialValues);
	};

	useEffect(() => {
		if (zkLogin.address && zkLogin.salt && zkLogin.provider) {
			setUserDetails({
				provider: zkLogin.provider,
				salt: zkLogin.salt,
				address: zkLogin.address,
			});
			setIsLoggedIn(LogStatus.zk);
		}
	}, [zkLogin.address]);

	const contextValue: LoginContextType = {
		isLoggedIn,
		userDetails,
		login,
		logOut,
	};

	return (
		<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLogin = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useLogin must be used within UserProvider");
	}
	return context;
};
