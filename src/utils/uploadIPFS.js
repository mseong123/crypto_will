import axios from 'axios';
import FormData from 'form-data';
import { IPFS_API } from "../constants"

export async function pinFileToIPFS (event) {
    const formData = new FormData();
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
        console.error('No file selected');
        return;
    }
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
    } catch (error) {
      console.log(error);
    }
}
