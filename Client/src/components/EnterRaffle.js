import React, { useState } from 'react';
import { enterRaffle } from '../api/rifa';

const EnterRaffle = () => {
  const [rifaId, setRifaId] = useState('');
  const [quantidadeRifas, setQuantidadeRifas] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEnterRaffle = async () => {
    try {
      const response = await enterRaffle(rifaId, quantidadeRifas);
      setMessage('Você entrou na rifa com sucesso!');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Entrar na Rifa</h2>
      <input
        type="text"
        placeholder="ID da Rifa"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade de Rifas"
        value={quantidadeRifas}
        onChange={(e) => setQuantidadeRifas(e.target.value)}
      />
      <button onClick={handleEnterRaffle}>Entrar na Rifa</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EnterRaffle;
