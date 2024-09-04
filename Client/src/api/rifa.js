import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Verifique se esta URL está correta
});

export const enterRaffle = async (rifaId, quantidadeRifas) => {
    const response = await api.post('/entrar', { rifaId, quantidadeRifas });
    return response.data;
};
