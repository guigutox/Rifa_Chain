import React, { useState } from 'react';
import ApproveRaffle from './ApproveRaffle';
import ChooseWinner from './ChooseWinner';
import EnterRaffle from './Join';
import GetBalance from './GetBalance';
import MintTokens from './MintTokens';
import RifaList from './RifaList';
import CreateRaffle from './CreateRaffle'
import Particle from './Particle.js';



const Home = () => {
    const [activeComponent, setActiveComponent] = useState('enterRaffle');

    const renderComponent = () => {
        switch (activeComponent) {
            case 'enterRaffle':
                return <EnterRaffle />;
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
            case 'Criar rifa':
                return <CreateRaffle/>;    
            default:
                return <EnterRaffle />;
        }
    };

    return (
        <div className="home">
        <Particle/>
        <div className="container">
            <nav className="navbar">
                <ul>
                    <li onClick={() => setActiveComponent('rifaList')}>
                        Listar Rifas
                    </li>
                    <li onClick={() => setActiveComponent('Criar rifa')}>
                        Criar Rifa
                    </li>
                    <li onClick={() => setActiveComponent('approveRaffle')}>
                        Aprovar Rifa
                    </li>
                    <li onClick={() => setActiveComponent('enterRaffle')}>
                        Entrar na Rifa
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

                </ul>
            </nav>

            <div className="content">
                {renderComponent()}
            </div>
        </div>
        </div>
    );
};

export default Home;
