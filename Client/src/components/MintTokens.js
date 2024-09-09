import React, { useState } from 'react';
import { ethers } from 'ethers';
import '../App.css';
import realDigitalJson from './contracts/RealDigital.json';
import { CONTRACT_ADDRESSES } from './config';


const MintTokens = () => {
  const [to, setTo] = useState(''); 
  const [amount, setAmount] = useState(''); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMint = async () => {
    try {
      if (!window.ethereum) throw new Error('🦊 MetaMask não está instalada 🦊'); 
      if (!to) throw new Error('🛑 Endereço do destinatário não informado 🛑'); 
      if (!amount) throw new Error('🛑 Quantidade de tokens não informada 🛑'); 
  
      await window.ethereum.request({ method: 'eth_requestAccounts' }); 
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const RealDigitalContract = new ethers.Contract(CONTRACT_ADDRESSES.REAL_DIGITAL, realDigitalJson.abi, signer);
  
      const amountToMint = ethers.parseUnits(amount, 18); 
      const tx = await RealDigitalContract.mint(to, amountToMint); 
      await tx.wait();
  
      setMessage('✔️ Tokens mintados com sucesso! ✔️'); 
      setError(''); 
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
        onChange={(e) => setTo(e.target.value)} // Atualiza o endereço do destinatário
      />
      <label>Quantidade</label>
      <input
        type="number"
        placeholder="100"
        value={amount}
        onChange={(e) => setAmount(e.target.value)} 
      />
      <button onClick={handleMint}>Mintar Tokens</button> 
      {message && <p className = "messageSucess">{message}</p>}
      {error && <p className = "messageError">{error}</p>}

    </div>
  );
};

export default MintTokens;
