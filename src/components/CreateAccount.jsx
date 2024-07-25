import { Transaction } from "@mysten/sui/transactions";
import { Button, Container, Box } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export function CreateAccount({refetch}) {
  const packageID = useNetworkVariable("packageId");
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
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
  const [errorCreate, setErrorCreate] = useState(false)

  return (
    <Container>
      <Button
        size="3"
        onClick={() => {
          create();
        }}
      >
        Create Account
      </Button>
      {errorCreate? <Box>Error happened during Account creation. Please try again</Box>:null}
    </Container>
  );

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [],
      target: `${packageID}::crypto_will::new`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log(result)
          refetch();
        },
      },
    );
  }
}
