import CryptoJS from 'crypto-js';

export function encryptAES(encryptionPhrase, IpfsHash) {

const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(encryptionPhrase).toString());
const fixedIV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");

// Encrypt
const encrypted = CryptoJS.AES.encrypt(IpfsHash, key, {iv:fixedIV}).toString()
return encrypted

}

export function decryptAES(encryptionPhrase, encryptedCID) {
  console.log(encryptionPhrase)
  console.log(encryptedCID)
  const key = CryptoJS.enc.Hex.parse(CryptoJS.SHA256(encryptionPhrase).toString());
  const fixedIV = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  // Decrypt
  const bytes = CryptoJS.AES.decrypt(encryptedCID, key, {iv:fixedIV});
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}