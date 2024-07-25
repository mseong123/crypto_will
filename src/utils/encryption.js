import nacl from 'tweetnacl';
import {decodeBase64, encodeBase64 } from 'tweetnacl-util'

import { decodeSuiPrivateKey, encodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import CryptoJS from 'crypto-js';

function uint8ArrayToBase64(uint8Array) {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
  }


export function encrypt(secretKey) {
const privateKeyBase64 = "ANXOKEh9oTOsPdXqf0HnyCDFTAVPeIcs1nkyEzzfZGLP";
// const privateKey = decodeBase64(privateKeyBase64)
// console.log(privateKey)
// const keyPair = nacl.sign.keyPair.fromSecretKey(privateKey);
// const publicKey = keyPair.publicKey
// console.log(publicKey)

// let binaryString = atob(privateKeyBase64);
  

//   let byteArray = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
//   if (byteArray[0] === 0) {
//     byteArray = byteArray.slice(1); // Remove the leading zero byte
//   }
//   let encoded = encodeSuiPrivateKey(byteArray)
//   let {schema, secretKey} = decodeSuiPrivateKey(encoded)
//   console.log(decodeSuiPrivateKey(encoded))
//   const keypair = Ed25519Keypair.fromSecretKey(secretKey)
//   let publickey = new Ed25519PublicKey(keypair.getPublicKey().toRawBytes())
  
//   const newArray = new Uint8Array(secretKey.length + 1);
//   newArray[0] = 0;
//   newArray.set(secretKey, 1);

//   const newArray1 = new Uint8Array(publickey.data.length + 1);
//   newArray1[0] = 0;
//   newArray1.set(publickey.data, 1);
//   console.log("ms", uint8ArrayToBase64(newArray1))
//   console.log(uint8ArrayToBase64(newArray))


// Derive AES key from a password (simplified example)
const password = 'ANXOKEh9oTOsPdXqf0HnyCDFTAVPeIcs1nkyEzzfZGLP';
const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(password).toString());
const fixedIV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

// Encrypt
const plaintext = 'Hello, World!';
// const fixedIV = new Uint8Array(16);
// console.log(fixedIV)
const encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv:fixedIV}).toString()
console.log("ms", encrypted)
// Decrypt
const bytes = CryptoJS.AES.decrypt(encrypted, key, {iv:fixedIV});
const decrypted = bytes.toString(CryptoJS.enc.Utf8);

console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
}

export function decrypt(secretKey) {
    
}