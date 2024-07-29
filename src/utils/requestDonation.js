import { Transaction } from "@mysten/sui/transactions";

export function requestDonation(response, donorAddress, donorAlias, donorDescription, packageID, signAndExecute, setLoading, id_donorAddress, id_donorAlias, id_donorDescription) {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.pure.address(donorAddress), tx.pure.string(donorAlias), tx.pure.string(donorDescription)],
      target: `${packageID}::crypto_will::sendDonationCap`,
    });
  
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          setLoading(false)
          
          document.getElementById(id_donorAddress).value = ""
          document.getElementById(id_donorAlias).value = ""
          document.getElementById(id_donorDescription).value = ""
          response.refetch()
        },
      },
    );
  }