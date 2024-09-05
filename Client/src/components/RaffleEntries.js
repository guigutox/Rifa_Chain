import React, { useState } from 'react';
import { getRaffleEntries } from '../api/rifa';

const RaffleEntries = () => {
  const [rifaId, setRifaId] = useState('');
  const [entradas, setEntradas] = useState('');
  const [error, setError] = useState('');

  const handleGetEntries = async () => {
    try {
      if (!rifaId) throw new Error('🛑 ID da rifa é obrigatório. 🛑');
      const response = await getRaffleEntries(rifaId);
      if (!response.entradas) throw new Error('Entradas não encontradas para esta rifa.'); // Validação do retorno
      setEntradas(response.entradas);
      setError('');
    } catch (err) {
      setError(err.message || 'Erro ao buscar as entradas da rifa.');
      setEntradas('');
    }
  };

  return (
    <div>
      <h2>Verificar Entradas da Rifa</h2>
      <label>ID da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
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
