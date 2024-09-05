import React, { useState } from 'react';
import { ethers } from 'ethers';

const ApproveRaffle = () => {
  const [amount, setAmount] = useState('');
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');

      // Solicitar a conexão da MetaMask
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Obter os dados da rifa a partir do backend
      const rifaResponse = await fetch(`/rifa/${rifaId}`);
      const { address: rifaAddress } = await rifaResponse.json();

      // Obter o endereço e a ABI do contrato RealDigital a partir da nova rota
      const realDigitalResponse = await fetch('/real-digital-info');
      const { address: realDigitalAddress, abi: realDigitalAbi } = await realDigitalResponse.json();

      // Instanciar o contrato RealDigital e aprovar a transação
      const RealDigitalContract = new ethers.Contract(realDigitalAddress, realDigitalAbi, signer);
      const amountToApprove = ethers.parseUnits(amount, 18); // Supondo que o token usa 18 decimais

      const tx = await RealDigitalContract.approve(rifaAddress, amountToApprove);
      await tx.wait();

      setMessage('Aprovação realizada com sucesso!');
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
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ApproveRaffle;
