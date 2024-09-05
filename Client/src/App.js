// src/App.js

import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import { enterRaffle } from './api/rifa';
import './App.css';
import ApproveRaffle from './components/ApproveRaffle';
import EnterRaffle from './components/EnterRaffle';

function App() {
    const [rifaId, setRifaId] = useState("");
    const [quantidadeRifas, setQuantidadeRifas] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleEnterRaffle = async () => {
        try {
            const result = await enterRaffle(rifaId, quantidadeRifas);
            setMessage("Você entrou na rifa com sucesso!");
            setError("");
            console.log("Resultado da entrada na rifa:", result);
        } catch (error) {
            setError("Erro ao entrar na rifa: " + error.message);
            setMessage("");
            console.error("Erro ao entrar na rifa:", error);
        }
    };

    document.title = "Rifa";
    return (
        <div>      
            <MetaMaskConnect setWalletAddress={setWalletAddress} />
            <EnterRaffle/>
            <ApproveRaffle />
        </div>
        
    );
}

export default App;
