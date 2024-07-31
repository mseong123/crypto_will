import axios from 'axios';
import FormData from 'form-data';
import { IPFS_API } from "../constants"

export async function pinFileToIPFS (setError, id) {
    const formData = new FormData();
    const file = document.getElementById(id).files[0]; // Get the selected file

    formData.append('file', file)

    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);
    
    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${IPFS_API}`
        }
      });
      console.log(res.data);
      return res.data
      
    } catch (error) {
		console.error("Error IPFS file upload:", error)
      setError("Error happened during uploading of file to IPFS")
    }
}
