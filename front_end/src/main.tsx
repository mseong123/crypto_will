import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { AuthProvider } from "./components/AuthContext";
import { networkConfig } from "./networkConfig.ts";
import './style.css'
import { ZkProvider } from "./components/ZkProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
				<WalletProvider autoConnect>
						<AuthProvider>
							<App />
						</AuthProvider>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
