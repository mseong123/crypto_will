import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react'
import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { getZkLoginSignature } from '@mysten/zklogin';

export type PartialZkLoginSignature = Omit<
	Parameters<typeof getZkLoginSignature>['0']['inputs'],
	'addressSeed'
>;

export function CondolenceDonation({ }) {
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	async function sendSui(zkLoginAddress, ephemeralSecretKey, amount) {
		console.log("running")
		const rpcUrl = getFullnodeUrl("devnet");
		const suiClient = new SuiClient({ url: rpcUrl });
		const proofObject = JSON.parse(proof)
		const partialZkLoginSignature = proofObject as PartialZkLoginSignature;
		const txb = new Transaction();
		const ephemeralKeyPair = await createKeypairFromBech32(ephemeralSecretKey)

		try {
			const amt = BigInt(amount);
			const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * amt])
			txb.setSender(zkLoginAddress);
			txb.transferObjects(
				[coin],
				// "0x6af474423e9ecd218e026616247ae4f5147957967ff0dbe612b2719209d99f86"
				"0x665f5ee73869cf9bd800b69a069bb9f2610f71ee02e29162de55b03aa042131b"
			);

			const usd_string = sessionStorage.getItem("userSpecificData")
			let usd = null;
			if (usd_string) {
				usd = JSON.parse(usd_string);
			}
			const maxEpoch = usd.maxEpoch
			const addressSeed = seed;

			// const partialZkLoginSignature = parseZkLoginSignature()
			// console.log("partial", partialZkLoginSignature)
			// console.log("seed", addressSeed)
			// console.log("epoch", maxEpoch)
			const { bytes, signature: userSignature } = await txb.sign({ client: suiClient, signer: ephemeralKeyPair });
			// console.log("sign", userSignature)
			const newzkLoginSignature = getZkLoginSignature({
				inputs: {
					...partialZkLoginSignature,
					addressSeed,
				},
				maxEpoch,
				userSignature,
			})
			// console.log("new", newzkLoginSignature)
			suiClient.executeTransactionBlock({
				transactionBlock: bytes,
				signature: newzkLoginSignature,
			});
			// suiClient.signAndExecuteTransaction({ signer: ephemeralKeyPair, transaction: txb });
			// console.log('success')
			setResult('Success');
		} catch (err) {
			console.error("error sending money", err);
			setResult('Failed');
		}
	}

	return (

		<>
			<GoogleAuth />
			<Card className="mb-2">
				<Card.Body>
					<Card className="mb-2">
						<Card.Header> Donation </Card.Header>
						<Card.Body>
							<Card.Text><span style={{ fontWeight: 500 }}>Address: </span>{zkLoginAddress}</Card.Text>
							<Form onSubmit={async (e) => {
								e.preventDefault();
								const amount = document.getElementById("donation").value
								sendSui(zkLoginAddress, ephemeralSecretKey, amount);

							}}
							>
								<Form.Group className="mx-2" controlId={"donation"}>
									<Form.Label>Enter SUI to transfer</Form.Label>
									<Form.Control
										type="number"
										size="sm"
										className='mb-2'
										step="0.00000000000000000001"
									/>
								</Form.Group>
								<Button type="submit">
									Send
								</Button>
							</Form>
						</Card.Body>

						{result && (
							<div style={{
								position: 'absolute',
								top: '-30px',
								left: '50%',
								transform: 'translateX(-50%)',
								backgroundColor: '#eeeeee',
								color: 'black',
								padding: '5px 10px',
								borderRadius: '5px',
								width: '200px',
								zIndex: 1,
							}}>
								{result}
							</div>
						)}
					</Card>
				</Card.Body>
			</Card>
		</>
	)

}
