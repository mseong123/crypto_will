import { pinFileToIPFS } from "../utils/uploadIPFS"
import { updateAccount } from "../utils/updateAccount"
import { encryptAES } from "../utils/encryptionAES"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";

export function UploadInput({encryptionPhrase, response, category}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const signAndExecute = useSignature();
    const packageId = useNetworkVariable('packageId');

    return (
        <Form onSubmit={async (e)=>{
            e.preventDefault();
            setError(null);
            setLoading(true);
            const result = await pinFileToIPFS(setError,category + "_file")
            if (result) {
                const encryptedCID = encryptAES(encryptionPhrase, result.IpfsHash)
                const description = document.getElementById(category + "_description").value
                const formData = new FormData();
                const file = document.getElementById(category + "_file").files[0]; 
                updateAccount(category, description, encryptedCID, file.name, response, packageId, signAndExecute, setLoading, category + "_description", category + "_file")
            }
           }} 
        >
            <Form.Group className="mb-3" controlId={category + "_description"}>
                <Form.Label>Enter a short description for your file</Form.Label>
                <Form.Control
                    as="textarea"
                    size="sm"
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId={category + "_file"}>
                <Form.Control
                    type="file"
                    size="sm"
                    required={true}
                />
            </Form.Group>
            <Button type="submit">
                Upload
            </Button>
            {loading? <Alert className="mt-3" variant="info">Uploading...</Alert>:null}
            {error? <Alert className="mt-3" variant="warning">{error}</Alert>:null}
        </Form> 
    )
}



