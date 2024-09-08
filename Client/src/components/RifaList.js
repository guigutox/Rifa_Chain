import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RifaList = () => {
  const [rifas, setRifas] = useState([]);
  const [error, setError] = useState(''); // Adiciona estado para o erro

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rifas'); // Endpoint do backend
        if (!response.data || response.data.length === 0) throw new Error('❌ Nenhuma rifa disponível no momento. ❌ '); 
        setRifas(response.data);
        setError(''); // Reseta o erro ao obter os dados com sucesso
      } catch (error) {
        setError((error.message || ''));
        setRifas([]); // Reseta a lista de rifas em caso de erro
      }
    };

    fetchRifas();
  }, []);

  return (
    <div>
      <h2>Lista de Rifas</h2>
      {error && <p className = "messageError">{error}</p>} 
      {rifas.length === 0 && !error ? (
        <p>Nenhuma rifa disponível</p>
      ) : (
        <div className='RifaConteiner'>
          {rifas.map((rifa) => (
            <ul key={rifa._id} className='ListaRifa'>
              <li>Endereço: {rifa.address}</li>
              <li>Id da rifa: {rifa._id}</li>
              <li>Valor da Entrada: {rifa.valorEntrada}</li>
              <li>Entradas Restantes: {rifa.entradasRestantes}</li>
              <li>Sorteio Realizado: {rifa.sorteioRealizado ? 'Sim' : 'Não'}</li>
              <li>Tokens Acumulados: {rifa.tokensAcumulados}</li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default RifaList;
