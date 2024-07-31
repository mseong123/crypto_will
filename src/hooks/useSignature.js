import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig"
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEnokiFlow } from "@mysten/enoki/react";

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

