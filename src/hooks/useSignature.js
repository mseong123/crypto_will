import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig"
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

export function useSignature() {
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await suiClient.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            // Raw effects are required so the effects can be reported back to the wallet
            showRawEffects: true,
            showEffects: true,
          },
        }),
    });

    return signAndExecute

}

// export function useZkSignature() {
// 	const url = getFullnodeUrl("testnet")
// 	const suiClient = new SuiClient({url: url})
// 	suiClient.signAndExecuteTransaction({
// 		transaction: tx,
// 		signer: keypair
// 	})
// }
export function useZkSignature() {
    const url = getFullnodeUrl("testnet");
    const suiClient = new SuiClient({ url: url });

    const { mutate: signAndExecute } = async ({ transaction, signer }) => 
         suiClient.signAndExecuteTransaction({
            transaction: transaction,
            signer: signer,
		});

	return signAndExecute

}
