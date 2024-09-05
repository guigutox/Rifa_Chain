import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RifaList = () => {
  const [rifas, setRifas] = useState([]);
  const [error, setError] = useState(''); // Adiciona estado para o erro

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rifas'); // Endpoint do backend
        if (!response.data || response.data.length === 0) throw new Error('Nenhuma rifa disponível no momento.');
        setRifas(response.data);
        setError(''); // Reseta o erro ao obter os dados com sucesso
      } catch (error) {
        setError('Erro ao buscar rifas: ' + (error.message || 'Tente novamente mais tarde.'));
        setRifas([]); // Reseta a lista de rifas em caso de erro
      }
    };

    fetchRifas();
  }, []);

  return (
    <div>
      <h1>Lista de Rifas</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe o erro */}
      {rifas.length === 0 && !error ? (
        <p>Nenhuma rifa disponível</p>
      ) : (
        <ul>
          {rifas.map((rifa) => (
            <li key={rifa._id}>
              <p>Endereço: {rifa.address}</p>
              <p>Id da rifa: {rifa._id}</p>
              <p>Valor da Entrada: {rifa.valorEntrada}</p>
              <p>Entradas Restantes: {rifa.entradasRestantes}</p>
              <p>Sorteio Realizado: {rifa.sorteioRealizado ? 'Sim' : 'Não'}</p>
              <p>Tokens Acumulados: {rifa.tokensAcumulados}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RifaList;
