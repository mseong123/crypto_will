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

export function Record({encryptionPhrase,response, fields,index}) {
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false);
    const decrypted = decryptAES(encryptionPhrase,fields.encryptedCID[index]);
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    return (
        <Card className="mb-2">
            <Card.Body>
                <Card.Title>
                    Description: {fields.description[index]} Filename: {fields.filename[index]}
                </Card.Title>
                <Card.Text>
                    <Card.Link target={"_blank"} href={IPFS_Gateway+decrypted}>Preview</Card.Link>
                    <Card.Link style={{cursor:"pointer"}} onClick={()=>{downloadIPFS(decrypt, setError)}}>Download</Card.Link>
                </Card.Text>
                <Button variant="primary" type="button" onClick={()=>{
                    setError(null)
                    deleteRecord(index, packageId, signAndExecute, setLoading)
                }}>Delete</Button>
                {error? <Alert className="mt-3" variant="warning">{error}</Alert>:null}
                {loading? <Alert className="mt-3" variant="info">Deleting...</Alert>:null}
            </Card.Body>
        </Card>
    )

}