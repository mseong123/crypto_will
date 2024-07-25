import nacl from 'tweetnacl';
import {decodeBase64, encodeBase64 } from 'tweetnacl-util'

import { decodeSuiPrivateKey, encodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

function uint8ArrayToBase64(uint8Array) {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
  }


export function encrypt() {
const privateKeyBase64 = "ANXOKEh9oTOsPdXqf0HnyCDFTAVPeIcs1nkyEzzfZGLP";
// const privateKey = decodeBase64(privateKeyBase64)
// console.log(privateKey)
// const keyPair = nacl.sign.keyPair.fromSecretKey(privateKey);
// const publicKey = keyPair.publicKey
// console.log(publicKey)

let binaryString = atob(privateKeyBase64);
  
  // Convert binary string to Uint8Array
  let byteArray = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
  if (byteArray[0] === 0) {
    byteArray = byteArray.slice(1); // Remove the leading zero byte
  }
  let encoded = encodeSuiPrivateKey(byteArray)
  let {schema, secretKey} = decodeSuiPrivateKey(encoded)
  console.log(decodeSuiPrivateKey(encoded))
  const keypair = Ed25519Keypair.fromSecretKey(secretKey)
  const newArray = new Uint8Array(secretKey.length + 1);
  newArray[0] = 0;
  newArray.set(secretKey, 1);
  
  console.log(uint8ArrayToBase64(newArray))
}