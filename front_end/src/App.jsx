import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react"
import { Account } from "./components/Account";
import { NavBar } from "./components/NavBar";
import { GoogleAuth } from './components/GoogleAuth';
import Container from 'react-bootstrap/Container';


function App() {
  const currentAccount = useCurrentAccount();
  const [page, setPage] = useState("Account")
  const [theme, setTheme] = useState("light")
  const [encryptionPhrase,setEncryptionPhrase] = useState("");

  return (
    <Container data-bs-theme={theme}>
        <NavBar setPage={setPage}/>
		<GoogleAuth/>
        <WalletStatus/>
        {currentAccount? page === "Account"? <Account encryptionPhrase={encryptionPhrase} setEncryptionPhrase={setEncryptionPhrase}/>:null : null}
        
    </Container>
    
  );
}

export default App;
