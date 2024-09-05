import React, { useState } from 'react';
import { chooseWinner } from '../api/rifa';

const ChooseWinner = () => {
  const [rifaId, setRifaId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChooseWinner = async () => {
    try {
      const response = await chooseWinner(rifaId);
      setMessage('Sorteio realizado com sucesso!');
      setError('');
    } catch (err) {
      setError(err.message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Escolher Vencedor da Rifa</h2>
      <input
        type="text"
        placeholder="ID da Rifa"
        value={rifaId}
        onChange={(e) => setRifaId(e.target.value)}
      />
      <button onClick={handleChooseWinner}>Realizar Sorteio</button>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChooseWinner;
