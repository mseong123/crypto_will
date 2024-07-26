import { Transaction } from "@mysten/sui/transactions";

export function deleteRecord(index, packageID, response, signAndExecute, setLoading) {
    const tx = new Transaction();
    console.log(response.data.data[0].data.objectId)
    console.log(index)
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