import React, { useState } from 'react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { LogStatus, useLogin } from './UserContext';
import { Transaction } from "@mysten/sui/transactions";
import { useEnokiFlow } from "@mysten/enoki/react";

function CopyTextButton() {
	const account = useCurrentAccount();
	const [copySuccess, setCopySuccess] = useState('');
	const { isLoggedIn, userDetails, login, logOut } = useLogin();

	const [txnDigest, setTxnDigest] = useState("");
	const enoki = useEnokiFlow()

	const copyToClipboard = async () => {
		try {
			const textToCopy = isLoggedIn === LogStatus.wallet?  account.address : userDetails.address;
			await navigator.clipboard.writeText(textToCopy);
			setCopySuccess('Address copied successfully! :)');
			setTimeout(() => setCopySuccess(''), 1000);
		} catch (err) {
			setCopySuccess('Failed to copy address. :(');
			setTimeout(() => setCopySuccess(''), 1000);
		}
	};

	return (
		<div style={{ position: 'relative' }}>
			{copySuccess && (
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
					{copySuccess}
				</div>
			)}
			<Button onClick={copyToClipboard}>
				<Image src="copy.png" rounded style={{ width: "20px" }} />
			</Button>
		</div>
	);
}

export default CopyTextButton;
