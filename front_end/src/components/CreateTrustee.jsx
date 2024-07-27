
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { createTrustee } from "../utils/createTrustee"
import { useCurrentAccount } from "@mysten/dapp-kit";

export function CreateTrustee({account, response}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    return (
        <Card>
            <Card.Header>Nominate Trustee</Card.Header>
            <Card.Body>
                <Form onSubmit={async (e)=>{
                    e.preventDefault();
                    setError(null);
                    setLoading(true);
                    const trusteeAddress = document.getElementById("trusteeAddress").value
                    const trusteeDescription = document.getElementById("trusteeDescription").value
                    const testatorAlias = document.getElementById("testatorAlias").value
                    createTrustee(response, trusteeAddress, trusteeDescription, testatorAlias, packageId, signAndExecute, setLoading, "trusteeAddress", "trusteeDescription", "testatorAlias")
                }} 
                >
                    <Form.Group className="d-inline-block mx-2" controlId={"trusteeAddress"}>
                        <Form.Label>Enter Trustee's blockchain address</Form.Label>
                        <Form.Control
                            type="text"
                            size="sm"
                        />
                    </Form.Group>
                    <Form.Group className="d-inline-block mx-2"controlId={"trusteeDescription"}>
                        <Form.Label>Enter a short description for your Trustee</Form.Label>
                        <Form.Control
                            type="text"
                            size="sm"
                        />
                    </Form.Group>
                    <Form.Group className="d-inline-block mx-2" controlId={"testatorAlias"}>
                        <Form.Label>Enter your own alias (to identify yourself to Trustee)</Form.Label>
                        <Form.Control
                            type="text"
                            size="sm"
                        />
                    </Form.Group>
                    <Button type="submit">
                        Upload
                    </Button>
                    {loading? <Alert className="mt-3" variant="info">Uploading...</Alert>:null}
                    {error? <Alert className="mt-3" variant="warning">{error}</Alert>:null}
                </Form> 
            </Card.Body>
        </Card>
    )
}