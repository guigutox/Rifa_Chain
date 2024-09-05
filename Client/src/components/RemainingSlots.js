import React, { useState } from 'react';
import { getRemainingSlots } from '../api/rifa';

const RemainingSlots = () => {
  const [address, setAddress] = useState('');
  const [vagasRestantes, setVagasRestantes] = useState('');
  const [error, setError] = useState('');

  const handleGetRemainingSlots = async () => {
    try {
      const response = await getRemainingSlots(address);
      setVagasRestantes(response.vagasRestantes);
      setError('');
    } catch (err) {
      setError(err.message);
      setVagasRestantes('');
    }
  };

  return (
    <div>
      <h2>Vagas Restantes da Rifa</h2>
      <input
        type="text"
        placeholder="Endereço da Rifa"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleGetRemainingSlots}>Verificar Vagas Restantes</button>
      {vagasRestantes && <p>Vagas Restantes: {vagasRestantes}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RemainingSlots;
