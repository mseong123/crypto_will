import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { decryptAES } from "../utils/encryptionAES"
import { IPFS_Gateway } from "../constants"
import { downloadIPFS } from "../utils/downloadIPFS"
import { deleteRecord } from "../utils/deleteRecord"
import { useState, useEffect } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";

export function Record({encryptionPhrase,response, fields,index}) {
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false);
    let decrypted;
    if (!error) {
        decrypted = decryptAES(encryptionPhrase,fields.encryptedCID[index], setError);
    }
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    useEffect(() => {
        setError(null)
        // Perform any side effects here
      }, [encryptionPhrase]);

    return (
        <Card className="mb-2">
            <Card.Body>
                <Card.Text className="d-inline-block me-3">
                    Description: <span style={{fontWeight:500}}>{fields.description[index]}</span>
                </Card.Text>
                <Card.Text className="d-inline-block">
                    Filename: <span style={{fontWeight:500}}>{fields.filename[index]}</span>
                </Card.Text>
                {error? <Alert className="mt-3" variant="warning">{error}</Alert>:(
                    <>
                        <Card.Text>
                            <Card.Link target={"_blank"} href={IPFS_Gateway+decrypted}>Preview</Card.Link>
                            <Card.Link style={{cursor:"pointer"}} onClick={()=>{downloadIPFS(decrypted, setError, fields.filename[index])}}>Download</Card.Link>
                            <Button variant="primary" className="d-inline-block ms-3" type="button" onClick={()=>{
                                deleteRecord(index, packageId, response, signAndExecute, setLoading)
                            }}>
                                Delete File
                            </Button>
                        </Card.Text>
                        
                    </>
                )}
                {loading? <Alert className="mt-3" variant="info">Deleting...</Alert>:null}
            </Card.Body>
        </Card>
    )

}