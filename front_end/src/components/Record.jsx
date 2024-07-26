import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { decryptAES } from "../utils/encryptionAES"
import { IPFS_Gateway } from "../constants"
import { downloadIPFS } from "../utils/downloadIPFS"
import { deleteRecord } from "../utils/deleteRecord"
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";

export function Record({fields,index}) {
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false);
    const decrypted = decryptAES(fields.encryptedCID[index]);
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    return (
        <Card>
            <Card.Body>
                <Card.Text>
                    {fields.description[index]}
                </Card.Text>
                <Card.Text>
                    <Card.Link href={IPFS_Gateway+decryptAES(fields.encryptedCID[index])}>Preview</Card.Link>
                    <Card.Link onClick={()=>{downloadIPFS(decrypt)}}>Download</Card.Link>
                </Card.Text>
                <Button variant="primary" type="button" onClick={()=>{
                    deleteRecord(index, packageId, signAndExecute, setLoading)
                }}>Delete</Button>
                {error? <Alert variant="warning">{error}</Alert>:null}
                {loading? <Alert className="mt-3" variant="info">Deleting...</Alert>:null}
            </Card.Body>
        </Card>
    )

}