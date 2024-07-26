import { pinFileToIPFS } from "../utils/uploadIPFS"
import { updateAccount } from "../utils/updateAccount"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'

async function handleSubmit(e, setError, response, id_description, id_file) {
    e.preventDefault();
    let result = await pinFileToIPFS(setError,id_file)
    if (result)
        console.log("ms")
    
}

export function UploadInput({response, category}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    return (
        <Form onSubmit={(e)=>{
            setError(null);
            handleSubmit(e, setError, response, category + "_description",category + "_file");
            setLoading(true)}} 
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



function downloadFile() {
    const ipfsUrl = 'https://amber-real-catfish-990.mypinata.cloud/ipfs/QmPNwNG34VxbaTvoVzjM9biU9zsdFEd3RrEGf3doTvVpjT';

            fetch(ipfsUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob(); // Convert response to Blob
                })
                .then(blob => {
                    // Create a link element
                    const a = document.createElement('a');
                    a.style.display = 'none';

                    // Create a URL for the Blob object
                    const url = window.URL.createObjectURL(blob);
                    a.href = url;
                    
                    // Set the default file name
                    a.download = 'file.txt'; // Specify the file name here

                    // Append the link to the body
                    document.body.appendChild(a);

                    // Programmatically click the link to trigger the download
                    a.click();

                    // Clean up
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                });
}