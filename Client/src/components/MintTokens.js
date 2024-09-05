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
      <label>Endereço</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <label>Quantidade</label>
      <input
        type="number"
        placeholder="100"
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
