import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RifaList = () => {
    const [rifas, setRifas] = useState([]);

    useEffect(() => {
        const fetchRifas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/rifas'); // Endpoint do backend
                setRifas(response.data);
            } catch (error) {
                console.error('Erro ao buscar rifas:', error);
            }
        };

        fetchRifas();
    }, []);

    return (
        <div>
            <h1>Lista de Rifas</h1>
            {rifas.length === 0 ? (
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
