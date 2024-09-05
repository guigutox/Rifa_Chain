import React, { useState } from 'react';
import { getRaffleEntries } from '../api/rifa';

const RaffleEntries = () => {
  const [rifaId, setRifaId] = useState('');
  const [entradas, setEntradas] = useState('');
  const [error, setError] = useState('');

  const handleGetEntries = async () => {
    try {
      const response = await getRaffleEntries(rifaId);
      setEntradas(response.entradas);
      setError('');
    } catch (err) {
      setError(err.message);
      setEntradas('');
    }
  };

  return (
    <div>
      <h2>Verificar Entradas da Rifa</h2>
      <input
        type="text"
        placeholder="ID da Rifa"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <button onClick={handleGetEntries}>Verificar Entradas</button>
      {entradas && <p>Entradas: {entradas}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RaffleEntries;
