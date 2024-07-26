import { Transaction } from "@mysten/sui/transactions";

export function deleteRecord(index, packageID, signAndExecute, setLoading) {
    const tx = new Transaction();
    
    tx.moveCall({
      arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.u64(index)],
      target: `${packageID}::crypto_will::delete`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          response.refetch();

        },
      },
    );
  }