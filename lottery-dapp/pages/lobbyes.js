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

    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

    const balanceInTokenForAccount = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            try {
                const balance = await contract.getBalance(AAddress, address)
                console.log('balance contract lobby :', parseInt(balance))
            } catch (err) {
                console.log("Error: ", err)
            }
        }
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

    const addTokensToBalance = async () => {
        if (typeof window.ethereum !== 'undefined') {
            await approve()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
            const tx = await contract.addTokensToBalance(AAddress, deposit)
            await tx.wait()
        }
    }

    const createNewLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.createNewLobby(AAddress, deposit, countOfPlayers)
        await tx.wait()
        console.log(`creator: ${await signer.getAddress()}, deposit: ${deposit}, countOfPlayers: ${countOfPlayers}`)
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
                <title>!Mudebz Lobby</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className="navbar mt-4 mb-4">
                <div className='container'>
                    <div>
                        <button onClick={createNewLobby} className="button is-link">createNewLobby</button>
                        <input
                            onChange={e => setdeposit(e.target.value)}
                        />
                        <input
                            onChange={e => setcountOfPlayers(e.target.value)}
                        />
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className='container'>
                    <div>
                        <button onClick={EnterLobby} className="button is-link">EnterLobby</button>
                        <input
                            onChange={e => setLobbyCreator(e.target.value)}
                        />
                        <input
                            onChange={e => setLobbyId(e.target.value)}
                        />
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={balanceInTokenForAccount} className="button is-link">chek balance</button>
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={addTokensToBalance} className="button is-link" >Add</button>
                        <input
                            onChange={e => setdeposit(e.target.value)}
                        />
                    </div>
                </div>
            </nav>




        </div>
    )
}
