import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import { useObjectQuery } from "../hooks/useObjectQuery";
import { useState } from 'react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const MIST_PER_SUI = 1000000000;

export function SuiBalance({setSuiBalance}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const account = useCurrentAccount();
    const packageId = useNetworkVariable('packageId');
    const response = useObjectQuery(
        'getBalance',
        {
          owner:account.address,
          filter:{
                coinType:"0x2::sui::SUI"
            },
          
          options: { showType: true, showContent: true },
        },
        {
        }
      );
	console.log("response",response)
	if (response.isPending) return <Alert style={{backgroundColor: "white"}} variant='dark'>Loading...</Alert>;

	if (response.error) return <Alert style={{backgroundColor: "white"}} variant='dark'>Error: {response.error.message}</Alert>
      console.log("balance", response)

    setSuiBalance(response.data.totalBalance / MIST_PER_SUI)
    return (
        <Card className="my-2 mx-2">
            <Card.Body>
                <Card.Img src="sui-coin.png" className="d-inline-block mx-2" rounded style={{width: "35px"}}/>
                <Card.Text className="d-inline-block" >Coin Balance: {response.data.totalBalance / MIST_PER_SUI} SUI</Card.Text>
            </Card.Body>
        </Card>
    )
}