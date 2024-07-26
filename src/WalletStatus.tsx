import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <>
      {account?
        <Alert variant="success">
            <Alert.Heading>Wallet connected.</Alert.Heading>
            Address: {account.address}
        </Alert>:<Alert variant="warning">
          Wallet not connected. Please Connect your Wallet
        </Alert>
      }
    </>
  );
}
