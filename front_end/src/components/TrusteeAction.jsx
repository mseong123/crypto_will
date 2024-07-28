import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SendRequestForRecord } from "./SendRequestForRecord";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

export function TrusteeAction() {
    return (<>
        <Container style={{padding: "0px", height: "100%"}} className="record-container">
            <Row style={{paddingTop: "10px"}}>
                <Col style={{paddingRight: "0px"}}><Image src="ghost-balloon.png" rounded style={{width: "70px", float: "inline-end"}}/></Col>
                <Col><h4 className="mb-3" style={{float: "left", padding: "15px", paddingLeft: "0px", margin: "20px 0px"}}>Trustee Action</h4></Col>
            </Row>
            <SendRequestForRecord/>
        </Container></>
    )
}
         