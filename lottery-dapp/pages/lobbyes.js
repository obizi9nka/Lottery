import Head from 'next/head'
import Image from 'next/image'
import GreeterContract from '../blockchain/Greeter.js'
import styles from '../styles/Home.module.css'
const { ethers } = require("ethers");
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"

export default function Home() {

    const [deposit, setdeposit] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [LobbyCreator, setLobbyCreator] = useState('')
    const [LobbyId, setLobbyId] = useState(0)
    const [token, settoken] = useState('')
    const [lotteryContract, setlotteryContract] = useState('')

    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

    useEffect(() => {
        updateState()
    }, [lotteryContract])

    const updateState = () => {
        if (lotteryContract) getPlayers()
        if (lotteryContract) getLotteryId()
    }

    const approve = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const tx = await contract.approve(LotteryAddress, deposit)
            await tx.wait()
        }
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

    const state = async () => {
        const provider = new ethers.providers.getDefaultProvider()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        setlotteryContract(contract)


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
                    <input className='deposit' id='deposit' onChange={e => setdeposit(e.target.value)} />
                    <input className='countofplayers' id='countofplayers' onChange={e => setcountOfPlayers(e.target.value)} />
                    <button onClick={createNewLobby} className="button">Creat Lobby</button>
                </div>
            </div>
            <h1 className='createNewLobby'>Enter Lobby</h1>
        </div>
    )
}
