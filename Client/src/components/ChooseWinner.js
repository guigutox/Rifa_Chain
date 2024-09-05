import React, { useState } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';

const Message = styled.p`
  color: green;
  font-size: 1.2em;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1.2em;
  font-weight: bold;
  background-color: #fdd;
  padding: 10px;
  border-radius: 5px;
`;

const SorteioRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSorteio = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask não está instalada');
      if (!rifaId) throw new Error('🛑O ID da rifa é obrigatório🛑');

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const response = await fetch(`/rifa/${rifaId}`);
      const { address: rifaAddress, abi: rifaAbi } = await response.json();

      const rifaContract = new ethers.Contract(rifaAddress, rifaAbi, signer);

      const tx = await rifaContract.sorteio();
      await tx.wait();

      setMessage('Sorteio realizado com sucesso!');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Realizar Sorteio</h2>
      <label>ID da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <button onClick={handleSorteio}>Realizar Sorteio</button>
      {message && <Message>{message}</Message>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

export default SorteioRaffle;
