import { Transaction } from "@mysten/sui/transactions";

export function sendRequestForRecord(response,encryptionPhrase,account, packageID, signAndExecute, id, index, setLoading) {
    const tx = new Transaction();
    
    tx.moveCall({
      arguments: [tx.object(response.data.data[index].data.objectId), tx.pure.string(encryptionPhrase), tx.pure.address(account)],
      target: `${packageID}::crypto_will::sendPublicKeyCap`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          document.getElementById(id).value = ""
          response.refetch();
        },
      },
    );
  }