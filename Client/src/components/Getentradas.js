import React, { useState } from 'react';
import rifaJson from './contracts/Rifa.json';
import { ethers } from 'ethers';
import '../App.css';

const GetEntradas = () => {
  const [rifaAddress, setRifaAddress] = useState('');
  const [participantes, setParticipantes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetEntradas = async () => {
    try {
      setError('');
      setParticipantes([]);
      setLoading(true);

      if (!rifaAddress) {
        setError('🛑 Endereço da rifa não informado 🛑');
        setLoading(false);
        return;
      }

      if (!window.ethereum) {
        throw new Error('🦊 MetaMask não está instalada 🦊');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const rifaContract = new ethers.Contract(rifaAddress, rifaJson.abi, signer);

      const entradas = await rifaContract.getEntradas();
      
      setParticipantes(entradas);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('❌ Erro ao buscar os participantes ❌');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buscar Participantes da Rifa</h2>
      <label>Endereço da Rifa</label>
      <input
        type="text"
        placeholder="0x1234567890123456789012345678901234567890"
        value={rifaAddress}
        onChange={(e) => setRifaAddress(e.target.value)}
      />
      <button onClick={handleGetEntradas} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar Participantes'}
      </button>
      {error && <p className="messageError">{error}</p>}
      {participantes.length > 0 && (
        <div>
          <h3>Lista de Participantes:</h3>
          <ul>
            {participantes.map((participante, index) => (
              <li className="listaparticipantes" key={index}>{participante}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetEntradas;
