// src/App.js

import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import { enterRaffle } from './api/rifa';
import './App.css';
import ApproveRaffle from './components/ApproveRaffle';
import EnterRaffle from './components/entrar';
import MintTokens from './components/MintTokens';
import RifaList from './components/RifaList';
import Home from './components/home';

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
            <Home/>
            {/* <EnterRaffle/>
            <ApproveRaffle />
            <MintTokens/>
            <RifaList/> */}
        </div>
        
    );
}

export default App;
