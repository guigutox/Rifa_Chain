// src/App.js

import React, { useState } from 'react';
import MetaMaskConnect from './components/MetaMaskConnect';
import { enterRaffle } from './api/rifa';
import './App.css';

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
            <div>
                <input
                    type="text"
                    placeholder="ID da Rifa"
                    value={rifaId}
                    onChange={(e) => setRifaId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Quantidade de Rifas"
                    value={quantidadeRifas}
                    onChange={(e) => setQuantidadeRifas(e.target.value)}
                />
                <button onClick={handleEnterRaffle}>Entrar na Rifa</button>
            </div>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default App;
