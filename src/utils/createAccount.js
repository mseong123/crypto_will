import { Transaction } from "@mysten/sui/transactions";

export function createAccount(packageID,signAndExecute, refetch) {
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
