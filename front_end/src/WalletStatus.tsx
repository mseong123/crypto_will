import { useCurrentAccount } from "@mysten/dapp-kit";
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CopyTextButton from './components/CopyTextButton';

export function WalletStatus() {
  const account = useCurrentAccount();

  return (
    <>
      {account?
        <Alert variant="dark" style={{overflowWrap: "break-word", backgroundColor:"#ffffff", color:"#606060"}}>
          <Container>
            <Row>
              <Col style={{paddingRight: "0px", padding: "10px"}}>Address:</Col>
              <Col style={{padding: "10px", paddingLeft: "0px"}}>{account.address}</Col>
              <Col style={{width: "28px", padding: "0px"}}><CopyTextButton/></Col>
            </Row>
          </Container>
        </Alert>:<Alert variant="dark" style={{backgroundColor:"#FFFFFF", borderColor:"#FFFFFF", height: "86vh"}}>
          <Container className="vertical-center">
            <Image src="ghost-balloon.png" rounded style={{width: "80px"}}/>
            <h3>BOO!</h3>
            <h6>Wallet not connected. Please connect your wallet to enjoy these goodies:</h6>
              <Row>
                <Col>
                  <Card style={{ width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="idea.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Upload files</Card.Title>
                        <h6>Will, bank account, insurance policy, asset titles or even a video recording to your love ones.</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="distribution.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Store files on chain</Card.Title>
                        <h6>Securely store in an immutable blockchain and encrypted distributed file system (IPFS)</h6>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card style={{ width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="approve.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Verified by authorized party</Card.Title>
                        <h6>Securely verify user’s death by authorized party</h6>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: '18rem', marginTop: "20px"}}>
                    <Card.Img variant="top" src="distributed-ledger.png" style={{width: "40px", alignSelf: "center", marginTop: "10px"}}/>
                    <Card.Body>
                      <Card.Title>Distribution of assets</Card.Title>
                        <h6>Distribute assets instantly upon user’s death enforced by smart contract</h6>
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
