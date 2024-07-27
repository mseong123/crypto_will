import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useObjectQuery } from "../hooks/useObjectQuery"
import { CreateAccount } from "./CreateAccount"
import { useNetworkVariable } from "../networkConfig"
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SendRequestForRecord } from "./SendRequestForRecord"

export function TrusteeAction() {
    return (
        <>
            <h4 className="mb-3">Trustee Action</h4>
            <SendRequestForRecord/>
        </>
    )
}