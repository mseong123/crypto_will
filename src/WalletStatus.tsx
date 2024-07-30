import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';
import { AuthState, useAuth } from "./components/AuthContext";
import { useEffect, useState } from "react";
import { useZk } from "./components/ZkProvider";
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CopyTextButton from './components/CopyTextButton';

export function WalletStatus() {
	const { authState, jwt, userSpecificData, zkLoginSignature, zkLoginAddress, ephemeralSecretKey, walletAccount, logout, setJwt, setUserSpecificData, setZkLoginSignature, setZkLoginAddress, setEphemeralSecretKey, setAuthState, } = useAuth();
	// const [zkLoginSignature, setZkLoginSignature] = useState<string | undefined>(undefined);
	// const [zkLoginAddress, setZkLoginAddress] = useState<string | undefined>(undefined);
	// const [ephemeralSecretKey, setEphemeralSecretKey] = useState<string | undefined>(undefined);
	const account = useCurrentAccount();

	useEffect(() => {
		console.log("auth", authState)
	}, [authState])


  return (
    <>
      {account || authState === AuthState.ZK?
        <Alert variant="dark" style={{overflowWrap: "break-word", borderColor: "#d1d1d1", backgroundColor:"#ffffff", color:"#606060"}}>
          <Container>
            <Row>
              <Col style={{paddingRight: "0px", padding: "10px"}}>Address:</Col>
              <Col style={{padding: "10px", paddingLeft: "0px"}}>{account ? account.address : zkLoginAddress}</Col>
              <Col style={{width: "28px", padding: "0px"}}><CopyTextButton/></Col>
            </Row>
          </Container>
        </Alert>:<Alert variant="dark" style={{backgroundColor:"#FFFFFF", borderColor:"#FFFFFF", height: "86vh"}}>
          <Container>
            <Image className="center" src="ghost-boo.png" rounded style={{width: "130px"}}/>
            <h6>Wallet not connected. Please connect your wallet to enjoy these goodies:</h6>
              <Row>
                <Col>
                  <Card style={{height: "190px", width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="idea.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Upload Records</Card.Title>
                        <h6>Will, bank account, insurance policy, asset titles or even a video recording to your love ones.</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{height: "190px", width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="distribution.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Store records on chain</Card.Title>
                        <h6>Securely store in an immutable blockchain and encrypted distributed file system (IPFS)</h6>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card style={{height: "190px", width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="approve.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Transfer records to trustee for safekeeping</Card.Title>
                        <h6>Securely transfer encrypted records to nominated trustee for safekeeping</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ height: "190px", width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="donation.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Condolences donation</Card.Title>
                        <h6>Anyone can securely donate SUI cryptocurrency to a nominated trustee in the event of a person's passing</h6>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
          </Container>
        </Alert>
      }
    </>
  );
}
