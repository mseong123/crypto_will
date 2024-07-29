import axios from 'axios';
import FormData from 'form-data';
import { IPFS_API } from "../constants"
import { IPFS_Gateway } from "../constants"

export function downloadIPFS(decrypted, setError, filename) {
    
    const ipfsUrl = IPFS_Gateway + decrypted;
            fetch(ipfsUrl)
                .then(response => {
                    if (!response.ok) {
                        setError('Network response was not ok');
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
                    a.download = filename; // Specify the file name here

                    // Append the link to the body
                    document.body.appendChild(a);

                    // Programmatically click the link to trigger the download
                    a.click();

                    // Clean up
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(error => {
                    
                    setError('Error downloading file:'+ error);
                });
}