import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { EnokiFlowProvider } from "@mysten/enoki/react";
import { UserProvider } from "./components/UserContext.tsx";
import { networkConfig } from "./networkConfig.ts";
import './style.css'

const queryClient = new QueryClient();

const ENOKI_API_KEY = import.meta.env.VITE_APP_ENOKI_API_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
				<WalletProvider autoConnect>
					<EnokiFlowProvider apiKey={ENOKI_API_KEY}>
						<UserProvider>
							<App />
						</UserProvider>
					</EnokiFlowProvider>
				</WalletProvider >
			</SuiClientProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
