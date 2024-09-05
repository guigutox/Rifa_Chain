import React, { useState } from 'react';
import ApproveRaffle from './ApproveRaffle';
import ChooseWinner from './ChooseWinner';
import EnterRaffle from './entrar';
import GetBalance from './GetBalance';
import MetaMaskConnect from './MetaMaskConnect';
import MintTokens from './MintTokens';
import RaffleEntries from './RaffleEntries';
import RemainingSlots from './RemainingSlots';
import RifaList from './RifaList';


const Home = () => {
    const [activeComponent, setActiveComponent] = useState('enterRaffle');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'enterRaffle':
                return <EnterRaffle />;
            case 'raffleEntries':
                return <RaffleEntries />;
            case 'remainingSlots':
                return <RemainingSlots />;
            case 'chooseWinner':
                return <ChooseWinner />;
            case 'getBalance':
                return <GetBalance />;
            case 'mintTokens':
                return <MintTokens />;
            case 'approveRaffle':
                return <ApproveRaffle />;
            case 'rifaList':
                return <RifaList />;
            default:
                return <EnterRaffle />;
        }
    };

    return (
        <div className="container">
            <nav className="navbar">
                <ul>
                    <li onClick={() => setActiveComponent('rifaList')}>
                        Listar Rifas
                    </li>
                    <li onClick={() => setActiveComponent('enterRaffle')}>
                        Entrar na Rifa
                    </li>
                    <li onClick={() => setActiveComponent('raffleEntries')}>
                        Verificar Entradas
                    </li>
                    <li onClick={() => setActiveComponent('remainingSlots')}>
                        Verificar Vagas Restantes
                    </li>
                    <li onClick={() => setActiveComponent('chooseWinner')}>
                        Realizar Sorteio
                    </li>
                    <li onClick={() => setActiveComponent('getBalance')}>
                        Obter Saldo de Tokens
                    </li>
                    <li onClick={() => setActiveComponent('mintTokens')}>
                        Mintar Novos Tokens
                    </li>
                    <li onClick={() => setActiveComponent('approveRaffle')}>
                        Aprovar Rifa
                    </li>

                </ul>
            </nav>

            <div className="content">
                {renderComponent()}
            </div>
        </div>
    );
};

export default Home;
