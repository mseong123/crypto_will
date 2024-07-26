import { pinFileToIPFS } from "../utils/uploadIPFS"

export function Upload() {
    return (
       <> 
            <input type="file" id="fileInput" onChange={(e)=>pinFileToIPFS(e)} />
            <a  href="https://amber-real-catfish-990.mypinata.cloud/ipfs/QmPNwNG34VxbaTvoVzjM9biU9zsdFEd3RrEGf3doTvVpjT" download="file.txt">Preview</a>
            
            <button onClick={()=>downloadFile()}>Download</button>
       </>
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