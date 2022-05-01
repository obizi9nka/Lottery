import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
const { ethers } = require("ethers");
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'

export default function Home() {


    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [lcContract, setLcContract] = useState()
    const [freeTokens, setFreeTokens] = useState(0)
    const [deposit, setdeposit] = useState(0)
    const [lotteryPlayers, setPlayers] = useState([])

    /*useEffect(() => {
      updateState()
    }, [lcContract])
  
    const updateState = () => {
      //if (lcContract) getPot()
      //if (lcContract) getPlayers()
      //if (lcContract) getLotteryId()
    }*/

    const approve = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const tx = await contract.approve(LotteryAddress, deposit)
            await tx.wait()
        }
    }

    const Enter = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
            const tx = await contract.Enter()
            await tx.wait()
            contract.once("enter", async () => {
                console.log("Welcome!", await singer.getAddress())
            })
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

    const allowToNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            const tx = await contract.allowToNFT(1)
            console.log(tx)
        }
    }


    const getTokens = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const tx = await contract.getTokens(freeTokens)
            await tx.wait()
        }
    }

    const balanceOf = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, provider)
            const address = await signer.getAddress()
            try {
                const balance = await contract.balanceOf(address)
                console.log('data :', parseInt(balance))
            } catch (err) {
                console.log("Error: ", err)
            }
        }
    }

    const balanceInTokenForAccount = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            try {
                const balance = await contract.getBalance(AAddress, address)
                console.log('balance contract :', parseInt(balance))
            } catch (err) {
                console.log("Error: ", err)
            }
        }
    }

    const getLotteryShablonByIndex = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            console.log(await contract.getLotteryShablonByIndex(await contract.getLotteryCount() - 1))
        }
    }

    const Play = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
            const tx = await contract.Play()
            await tx.wait()
            contract.on("play", async () => {
                console.log("Winer:", contract.getLotteryShablonByIndex(contract.getLotteryCount() - 1).winer)
            })
        }
    }

    const setAdrressNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
            const tx = await contract.setAdrressNFT(MudeBzNFT)
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

    const MintMarten = async () => {
        if (typeof window.ethereum !== 'undefined') {
            await approve()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, singer)
            const tx = await contract.MintMarten(TokenId)
            await tx.wait()
        }
    }

    const balanceNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, singer)
            const tx = await contract.balanceOf(singer.getAddress())
            console.log("balance: ", parseInt(tx))
        }
    }


    return (
        <div>
            <Head>
                <title>!Mudebz Lottery</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className="navbar mt-4 mb-4">
                <div className='container'>
                    <div>
                        <button onClick={getTokens} className="button is-link"> Free tokens</button>
                        <input
                            onChange={e => setFreeTokens(e.target.value)}
                        />
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={balanceOf} className="button is-link">balanceOf</button>
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={Enter} className="button is-link" >Enter</button>
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
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={balanceInTokenForAccount} className="button is-link">Check balance</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={getLotteryShablonByIndex} className="button is-link">Players</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={Play} className="button is-link">Play</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={allowToNFT} className="button is-link">allowToNFT</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={setAdrressNFT} className="button is-link">setAdrressNFT</button>
                    </div>
                </div>
            </nav>

            <div>
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

                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={MintMarten} className="button is-link">MintMarten</button>
                            <input
                                onChange={e => setTokenId(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>

                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={balanceNFT} className="button is-link">balanceOf</button>
                        </div>
                    </div>
                </nav>




            </div>

        </div>
    )
}