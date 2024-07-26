import { useCurrentAccount } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useState } from "react"
import { Account } from "./components/Account";
import { NavBar } from "./components/NavBar";
import Container from 'react-bootstrap/Container';


function App() {
  const currentAccount = useCurrentAccount();
  const [page, setPage] = useState("Account")
  const [theme, setTheme] = useState("light")

  return (
    <Container data-bs-theme={theme} className={"p-0"}>
        <NavBar/>
        <WalletStatus />
        {currentAccount ? <Account/>:null}
    </Container>
    
  );
}

export default App;