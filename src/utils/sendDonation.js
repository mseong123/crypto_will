import { Transaction } from "@mysten/sui/transactions";


export const MIST_PER_SUI=1000000000;

export function sendDonation(response,data,amount,packageID, signAndExecute, setLoading, id_sendDonation) {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [MIST_PER_SUI * amount]);
    tx.transferObjects(
      [coin],
      data.data.content.fields.trusteeAddress
    );
    tx.moveCall({
      arguments: [tx.object(data.data.objectId), tx.pure.string(String(amount))],
      target: `${packageID}::crypto_will::receiveDonation`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          document.getElementById(id_sendDonation).value = ""
          response.refetch();
        },
      },
    );
  }
