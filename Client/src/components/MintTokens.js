import React, { useState } from 'react';
import { mintTokens } from '../api/rifa';
import { ethers } from 'ethers';

const MintTokens = () => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMint = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');
  
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Obter o endereço e a ABI do contrato RealDigital a partir da nova rota
      const realDigitalResponse = await fetch('/real-digital-info');
      
      const { address: realDigitalAddress, abi: realDigitalAbi } = await realDigitalResponse.json();

      const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, signer);
  
      const amountToMint = ethers.parseUnits(amount, 18);
      const tx = await RealDigitalContract.mint(to, amountToMint);
      await tx.wait();
  
      setMessage('Tokens mintados com sucesso!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  

  return (
    <div>
      <h2>Mintar Novos Tokens</h2>
      <input
        type="text"
        placeholder="Endereço"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade de Tokens"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleMint}>Mintar Tokens</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MintTokens;
