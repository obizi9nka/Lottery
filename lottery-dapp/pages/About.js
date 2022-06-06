import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { platform } from 'os';


export default function Home() {


    const BAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [TokenId, setTokenId] = useState()
    const [freeTokens, setFreeTokens] = useState(0)
    const [deposit, setdeposit] = useState(0)
    const [lotteryPlayers, setPlayers] = useState([])

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
            //const tx = await contract.allowToNFT(1)
            const tx = await contract._allowToNFT("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc")
            // const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, provider)
            // const tx = contract.istokenMints(1)
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
            const contract = new ethers.Contract(BAddress, A.abi, provider)
            const address = await signer.getAddress()
            try {
                const balance = await contract.balanceOf(address)
                console.log('data :', parseInt(balance * 10 ** 18), parseInt(balance))
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
                const balance = await contract.getBalance(BAddress, address)
                console.log('balance contract :', parseFloat(balance / 10 ** 18), parseInt(balance))
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
                console.log("Winer:", (await contract.getLotteryShablonByIndex(parseInt(await contract.getLotteryCount() - 1, 10))).winer)
            })
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
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.MintMarten(2, {
                value: 32
            })
            await tx.wait()
        }
    }

    const balanceNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.balanceOf(singer.getAddress())
            console.log("balance: ", parseInt(tx))
        }
    }

    const [to, setto] = useState("")

    const getTokensForAddress = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.getTokensForAddress(singer.getAddress())
            console.log(tx)
        }
    }

    const transfer = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.transferFrom(singer.getAddress(), to, 1)
            console.log("transfer: ", tx)
        }
    }

    const transferTokens = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const tx = await contract.transfer(to, BigInt(100 * 10 ** 18))
            console.log("transfer: ", tx)
        }
    }


    return (
        <div>
            <Head>
                <title>!Mudebz</title>
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
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={getTokensForAddress} className="button is-link">getTokensForAddress</button>
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={transfer} className="button is-link">transfer</button>
                            <input
                                onChange={e => setto(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={transferTokens} className="button is-link">transferTOKENS</button>
                            <input
                                onChange={e => setto(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>


            </div>

        </div>
    )
}