import { pinFileToIPFS } from "../utils/uploadIPFS"
import { updateAccount } from "../utils/updateAccount"
import { encryptAES } from "../utils/encryptionAES"
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react'
import { useNetworkVariable } from "../networkConfig"
import { useSignature } from "../hooks/useSignature";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";
import { SuiClient } from "@mysten/sui/client";
import { LogStatus, useLogin } from './UserContext';
import { useSuiClient } from "@mysten/dapp-kit";

function Input({ index }) {
	return (
		<Card className="my-3">
			<Form.Group controlId={"description-" + index} className="pt-2">
				<Form.Label style={{ verticalAlign: "text-bottom" }} className="d-inline-block me-2">Title:</Form.Label>
				<Form.Control className="d-inline-block w-50"
					as="textarea"
					size="sm"
					style={{ height: "1vh" }}
				/>
			</Form.Group>
			<Form.Select required className="my-2 center" style={{ width: "380px" }} id={"category-" + index}>
				<option value="">Select category</option>
				<option value="Will">Will</option>
				<option value="Asset">Asset</option>
				<option value="Video">Video</option>
				<option value="Personal">Personal</option>
			</Form.Select>
			<Form.Group className="my-2 center" style={{ width: "380px" }} controlId={"file-" + index}>
				<Form.Control
					type="file"
					size="sm"
					required={true}
				/>
			</Form.Group>
		</Card>
	)
}

export function UploadInput({ encryptionPhrase, response }) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const signAndExecute = useSignature();
	const packageId = useNetworkVariable('packageId');
	const [input, setInput] = useState([]);

	const url = import.meta.env.VITE_APP_SUI_FULLNODE_URL;
	const suiClient = useSuiClient()
	const { isLoggedIn, userDetails, login, logOut } = useLogin();
	const [txnDigest, setTxnDigest] = useState("");
	const enoki = useEnokiFlow()

	async function updateAccountZK(packageID, enoki) {
		const keypair = await enoki.getKeypair({ network: "testnet" })
		const tx = new Transaction();
		tx.setGasBudget(100000000)
		for (let i = 0; i < encryptedCID.length; i++) {
			const formData = new FormData();
			const file = document.getElementById("file-" + i).files[0];
			const description = document.getElementById("description-" + i).value;
			const category = document.getElementById("category-" + i).value;
			tx.moveCall({
				arguments: [tx.object(response.data.data[0].data.objectId), tx.pure.string(category), tx.pure.string(description), tx.pure.string(encryptedCID[i]), tx.pure.string(file.name), tx.pure.string(String(Date.now()))],
				target: `${packageID}::crypto_will::upload`
			});

			try {
				const txnRes = await suiClient.signAndExecuteTransaction({
					transaction: tx,
					signer: keypair,
				})

				if (txnRes && txnRes?.digest) {
					setTxnDigest(txnRes?.digest);
					alert(`Transfer Success. Digest: ${txnRes?.digest}`);
					response.refetch();
				}
			} catch (err) {
				console.log("Update Records", err);
				alert("Error Updating Records");
			}
		}


		return (
			<>
				<Form className="my-3" onSubmit={async (e) => {
					e.preventDefault();
					setError(null);
					setLoading(true);
					const encryptedCID = [];
					const hash = [];
					for (let i = 0; i < input.length; i++) {
						let result = await pinFileToIPFS(setError, "file-" + i)
						hash.push(result);
					}

					if (hash.length > 0) {
						for (let i = 0; i < hash.length; i++) {
							encryptedCID.push(encryptAES(encryptionPhrase, hash[i].IpfsHash))
						}
						isLoggedIn === LogStatus.wallet ? updateAccount(encryptedCID, response, packageId, signAndExecute, setLoading, setInput) : updateAccountZK(packageId, enoki)

					}
				}}
				>

					{loading ? <Alert className="mt-3" variant="dark">Uploading...</Alert> : null}
					{error ? <Alert className="mt-3" variant="dark">{error}</Alert> : null}
					{input}
					<Container>
						<Button type="button" className="my-2" onClick={() => setInput([...input, <Input key={input.length} index={input.length} />])}>
							<Image src="add.png" rounded style={{ width: "45px" }} />
						</Button>
						<Button type="button" className="my-2" onClick={() => setInput(input.slice(0, -1))}>
							<Image src="delete.png" rounded style={{ width: "45px" }} />
						</Button>
						<Button type="submit" className="my-2" disabled={input.length > 0 ? false : true} style={{ backgroundColor: "#eeeeee", borderColor: "#eeeeee" }}>
							<Image src="file1.png" rounded style={{ width: "45px" }} />
						</Button>
					</Container>

				</Form>
			</>
		)
	}

