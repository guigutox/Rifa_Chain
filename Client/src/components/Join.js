import React, { useState } from 'react';
import { ethers } from 'ethers';
import rifaJson from './contracts/Rifa.json';
import '../App.css';

const EnterRaffle = () => {
  const [rifaAddress, setrifaAddress] = useState('');
  const [quantidadeRifas, setQuantidadeRifas] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEnterRaffle = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask não está instalada');
      }

      // Solicitar a conexão da MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!rifaAddress) {
        throw new Error('🛑 O Endereço da rifa é obrigatório 🛑');
      }

      if (!quantidadeRifas) {
        throw new Error('🛑 A quantidade de rifas é obrigatória 🛑');
      }

      const rifaContract = new ethers.Contract(rifaAddress, rifaJson.abi, signer);


      const tx = await rifaContract.entrar(Number(quantidadeRifas));
      await tx.wait();

      console.log(tx);


      const backendResponse = await fetch('/atualizaDB', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rifaAddress,
          quantidadeRifas: Number(quantidadeRifas),  
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(backendData.error || 'Erro ao atualizar a rifa');
      }

      setMessage('✔️ Você entrou na rifa com sucesso! ✔️');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Entrar na Rifa</h2>
      <label>Endereço da rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaAddress}
        onChange={(e) => setrifaAddress(e.target.value)}
      />
      <label>Quantidade de Rifas</label>
      <input
        type="number"
        placeholder="20"
        value={quantidadeRifas}
        onChange={(e) => setQuantidadeRifas(e.target.value)}
      />
      <button onClick={handleEnterRaffle}>Entrar na Rifa</button>
      {message && <p className="messageSucess">{message}</p>}
      {error && <p className="messageError">{error}</p>}
    </div>
  );
};

export default EnterRaffle;
