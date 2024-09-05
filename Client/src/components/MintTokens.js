import React, { useState } from 'react';
import { mintTokens } from '../api/rifa';

const MintTokens = () => {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMint = async () => {
    try {
      const response = await mintTokens(to, amount);
      setMessage('Tokens mintados com sucesso!');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
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
