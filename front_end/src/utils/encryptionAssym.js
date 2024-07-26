import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';
import { decodeSuiPrivateKey, encodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import baseX from 'base-x';

// function stringToUint8Array(str) {
//     return new TextEncoder().encode(str);
//   }

  async function generateSeedFromString(seedinput) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', seedinput);
    return new Uint8Array(hashBuffer);
  }

export async function encryptAssym() {
// Your existing private key in base64 format
const privateKeyBase64 = "suiprivkey1qr9aejnvmuhgzw996a3eujun6xta7qapdmf5uw9deayujqmtpdtr69a889z"
let seed = encodeUTF8(privateKeyBase64)
if (seed.length>32) {
    seed = seed.slice(0,32);
}
else if (seed.length < 32) {
    const paddedSeed = new Uint8Array(32);
    seed = paddedSeed.set(seed)
}



generateSeedFromString(seed).then(seed => {
    // Ensure seed is 32 bytes long for Ed25519
    if (seed.length !== 32) {
      throw new Error('Seed must be 32 bytes long.');
    }
  
    // Generate key pair from seed
    const keyPair = nacl.sign.keyPair.fromSeed(seed);
  
    // Extract public and private keys
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
  
    // Output keys as Base64 strings
    console.log('Public Key:', naclUtil.encodeBase64(publicKey));
    console.log('Private Key:', naclUtil.encodeBase64(privateKey));
  }).catch(err => console.error(err));

}