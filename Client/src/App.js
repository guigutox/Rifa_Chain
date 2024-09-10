import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import './App.css';
import Home from './components/home';


function App() {
  
    const [walletAddress, setWalletAddress] = useState("");

    document.title = "Rifa";
    return (
        <div>      
            <MetaMaskConnect setWalletAddress={setWalletAddress} />
            <Home/>
        </div>
        
    );
}

export default App;
