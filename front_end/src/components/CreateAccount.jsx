
import { useNetworkVariable } from "../networkConfig";
import { useCurrentAccount } from "@mysten/dapp-kit";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { useSignature } from '../hooks/useSignature';
import {createAccount} from '../utils/createAccount'


export function CreateAccount({refetch}) {
  const packageID = useNetworkVariable("packageId");
  const account = useCurrentAccount();
  const signAndExecute = useSignature()

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>No Account exist</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Account Creation</Card.Subtitle>
        <Card.Text>
           Your account is used to store and manage your personal records on SUI's blockchain.
        </Card.Text>
        <Card.Link style={{cursor:"pointer"}} onClick={()=>createAccount(packageID,signAndExecute, refetch)}>Create Account</Card.Link>
      </Card.Body>
    </Card>
  );
}
