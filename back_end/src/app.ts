import express, { Request, Response } from "express";
import session from "express-session";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { config } from "dotenv";
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from "@mysten/zklogin";
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  decodeSuiPrivateKey,
  encodeSuiPrivateKey,
} from "@mysten/sui/cryptography";
import crypto from "crypto";
import { error } from "console";

// Load environment variables from .env
config();

export interface JwtPayload {
  iss?: string;
  sub?: string; // Subject ID
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
}

const FULLNODE_URL = "https://fullnode.devnet.sui.io"; // replace with the RPC URL you want to use
const suiClient = new SuiClient({ url: FULLNODE_URL });

async function getMaxEpoch(): Promise<number> {
  const { epoch } = await suiClient.getLatestSuiSystemState();
	console.log(epoch)
  return Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
}

interface UserSpecificData {
  maxEpoch: number;
  // ephemeralKeyPair: Ed25519Keypair;
  privateKey: string;
  randomness: string;
  nonce: string;
}

async function generateUserSpecificData(): Promise<UserSpecificData> {
  const maxEpoch = await getMaxEpoch();
  const ephemeralKeyPair = new Ed25519Keypair();
  const privateKey = ephemeralKeyPair.getSecretKey();
  const publicKey = ephemeralKeyPair.getPublicKey();
  const randomness = generateRandomness();
	console.log(randomness)
  const nonce = generateNonce(
    ephemeralKeyPair.getPublicKey(),
    maxEpoch,
    randomness,
  );
  return { maxEpoch, privateKey, randomness, nonce };
}

const app = express();

// Middleware or route where you need to access suiClient
app.get("/some-route", (req: Request, res: Response) => {
  // You can now use suiClient and other variables here
  res.send(`Sui Nonce: ${(req.session as any).userSpecificData?.nonce}`);
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as string;

// Session Management
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
  }),
  // express.json,
);

// Routes
app.get("/auth/google", async (req: Request, res: Response) => {
  const userSpecificData = await generateUserSpecificData();
  (req.session as any).userSpecificData = userSpecificData;

  const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=openid email profile&nonce=${userSpecificData.nonce}`;
  res.redirect(AUTH_URL);
});

app.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code: code as string,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const { id_token } = tokenResponse.data;

    if (id_token) {
      (req.session as any).id_token = id_token;
      res.redirect(`/auth`);
    } else {
      res.status(400).send("No ID token received");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during token exchange");
  }
});

async function createKeypairFromBech32(
  bech32SecretKey: string,
): Promise<Ed25519Keypair> {
  try {
    // Decode the Bech32 string
    // const decoded = bech32.decode(bech32SecretKey);
    const { schema, secretKey } = decodeSuiPrivateKey(bech32SecretKey);
    // Convert the decoded words back to a Uint8Array
    // const decodedUint8Array = new Uint8Array(bech32.fromWords(decoded.words));
    return Ed25519Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error("Error creating keypair from Bech32:", error);
    throw error;
  }
}

function generateUserSalt(sub: string) {
  const hash = crypto.createHash("sha256");
  hash.update(sub);
  const hashed = hash.digest();
  return hashed.subarray(0, 16);
}

function bigIntTo16ByteBigInt(value: bigint): BigInt {
  // Ensure the BigInt fits into 16 bytes (128 bits)
  const byteSize = 16;
  const maxBigInt = BigInt("0x" + "f".repeat(byteSize * 2)); // Max 16 bytes
  return value & maxBigInt; // Mask to ensure it's within 16 bytes
}

app.get("/auth", async (req: Request, res: Response) => {
  const encodedJWT = (req.session as any).id_token;
  const userSpecificData = (req.session as any)
    .userSpecificData as UserSpecificData;

  if (encodedJWT && userSpecificData) {
    try {
      const decodedJwt = jwtDecode(encodedJWT) as JwtPayload;
      if (!decodedJwt.sub) {
        throw new Error("Missing 'sub' in payload");
      }
      const userSaltString: string = decodedJwt.sub;

      const userSalt = generateUserSalt(userSaltString);
		console.log("salt", userSalt);
      const zkLoginUserAddress = jwtToAddress(encodedJWT, userSaltString);

      console.log("pk in session:", userSpecificData.privateKey);
      const ephemeralKeyPair = await createKeypairFromBech32(
        userSpecificData.privateKey,
      );
      console.log("after-------------------------------");
      console.log(ephemeralKeyPair.getSecretKey());
      console.log(ephemeralKeyPair.getPublicKey());

      const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
        ephemeralKeyPair.getPublicKey(),
      );
      const prover_url = "https://prover-dev.mystenlabs.com/v1";

      const encodedPK = Buffer.from(extendedEphemeralPublicKey).toString(
        "base64",
      );
      const encodedRandom = Buffer.from(userSpecificData.randomness).toString(
        "base64",
      );
      // const encodedSalt = Buffer.from(userSalt).toString("base64");
		console.log("randomness after", userSpecificData.randomness)

      const payload = {
        jwt: encodedJWT,
        extendedEphemeralPublicKey: extendedEphemeralPublicKey,
        maxEpoch: userSpecificData.maxEpoch,
        jwtRandomness: userSpecificData.randomness,
        salt: userSalt,
        keyClaimName: "sub",
      };

      const response = await axios.post(prover_url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);
      // res.json({ decodedJwt, zkLoginUserAddress, userSpecificData });
    } catch (error) {
      console.error(error);
      res.status(400).send("Invalid token");
    }
  } else {
    res.status(400).send("No token or user-specific data provided");
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Home Page");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// import express from "express"
