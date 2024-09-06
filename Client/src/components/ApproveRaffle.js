import React, { useState } from 'react';
import { ethers } from 'ethers';
import '../App.css';


const ApproveRaffle = () => {
  const [amount, setAmount] = useState('');
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');

      if (!rifaId) throw new Error('🛑 O ID da rifa é obrigatório 🛑');
      if (!amount) throw new Error('🛑 A quantidade é obrigatória 🛑');
      
      const response = await fetch(`/rifa/${rifaId}`);
      const data = await response.json();
  
      if (!data.address) {
        throw new Error('❌ Endereço da rifa não encontrado ❌');
      }


      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const rifaResponse = await fetch(`/rifa/${rifaId}`);
      const { address: rifaAddress } = await rifaResponse.json();

      const realDigitalResponse = await fetch('/real-digital-info');
      const { address: realDigitalAddress, abi: realDigitalAbi } = await realDigitalResponse.json();

      const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, signer);
      const amountToApprove = ethers.parseUnits(amount, 18);

      const tx = await RealDigitalContract.approve(rifaAddress, amountToApprove);
      await tx.wait();

      setMessage('✔️ Aprovação realizada com sucesso! ✔️');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Aprovar Rifa</h2>
      <label>ID da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <label>Quantidade</label>
      <input
        type="text"
        placeholder="100"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleApprove}>Aprovar</button>
      {message && <p class = "messageSucess">{message}</p>}
      {error && <p class = "messageError">{error}</p>}
    </div>
  );
};

export default ApproveRaffle;
