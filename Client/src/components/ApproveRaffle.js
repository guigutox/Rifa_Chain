import React, { useState } from 'react';
import { approveTokens } from '../api/rifa';

const ApproveRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleApprove = async () => {
    try {
      const response = await approveTokens(rifaId, amount);
      setMessage('Aprovação realizada com sucesso!');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Aprovar Tokens para a Rifa</h2>
      <input
        type="text"
        placeholder="ID da Rifa"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade de Tokens"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleApprove}>Aprovar Tokens</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ApproveRaffle;
