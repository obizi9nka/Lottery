import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { PrismaClient } from '@prisma/client';
import LobbyShablon from '../components/LobbyShablon'

const prisma = new PrismaClient();

export async function getServerSideProps() {
    const lobbyes = await prisma.lobby.findMany();
    return {
        props: {
            allLobbyes: lobbyes
        }
    }
}

export default function Home({ allLobbyes }) {

    const [deposit, setdeposit] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [LobbyCreator, setLobbyCreator] = useState('')
    const [LobbyId, setLobbyId] = useState(0)
    const [token, settoken] = useState('')
    const [lobbyes, setlobbyes] = useState(allLobbyes)

    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

    useEffect(() => {
        updateState()
    }, [lobbyes])

    const updateState = async () => {

    }

    const createNewLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.createNewLobby(AAddress, deposit, countOfPlayers)
        await tx.wait()
        console.log(`creator: ${await signer.getAddress()}, deposit: ${deposit}, countOfPlayers: ${countOfPlayers}, token: ${AAddress}`)
        document.getElementById("deposit").value = "";
        document.getElementById("countofplayers").value = "";
    }

    const EnterLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.EnterLobby(LobbyCreator, LobbyId)
        await tx.wait()
        console.log(await contract.lobby(LobbyCreator, LobbyId))
    }

    return (
        <div>
            <Head>
                <title>!Mudebz Lobbys</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='createNewLobby'>Create New Lobby</h1>
            <div className='newLobby'>
                <div className='container lobbymenu between'>
                    <select onChange={e => settoken(e.target.value)}>
                        <option>A</option>
                        <option>B</option>
                    </select>
                    <input className='deposit' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value)} />
                    <input className='countofplayers' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} />
                    <button onClick={createNewLobby} className="button">Creat Lobby</button>
                </div>
            </div>
            <h1 className='createNewLobby'>Enter Lobby</h1>
            {allLobbyes && allLobbyes.map(({ creator, nowInLobby, countOfPlayers, deposit }) =>
                <LobbyShablon creator={creator} nowInLobby={nowInLobby} countOfPlayers={countOfPlayers} deposit={deposit} />
            )}

        </div>
    )
}

