// src/App.js

import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import { enterRaffle } from './api/rifa';
import './App.css';
import ApproveRaffle from './components/ApproveRaffle';
import EnterRaffle from './components/entrar';
import MintTokens from './components/MintTokens';

function App() {
    const [rifaId, setRifaId] = useState("");
    const [quantidadeRifas, setQuantidadeRifas] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


   

    document.title = "Rifa";
    return (
        <div>      
            <MetaMaskConnect setWalletAddress={setWalletAddress} />
            <EnterRaffle/>
            <ApproveRaffle />
            <MintTokens/>
        </div>
        
    );
}

export default App;
