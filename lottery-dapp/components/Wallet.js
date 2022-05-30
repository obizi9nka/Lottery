import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import WalletAlert from './WalletAlert';

export default function Wallet() {

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [NftButton, setNftButton] = useState(false)
    const [isWalletConnect, setisWalletConnect] = useState(false)
    const [isWalletAlert, setisWalletAlert] = useState(false)
    const [user, setuser] = useState("")

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch (err) {
            console.log()
        }
    }
    setUser()

    useEffect(() => {
        checkWallet()
        checkNftButton()
        getAllNews()
    }, [isWalletConnect, user])


    async function setNewUSer() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const body = { address }
        try {
            await fetch('/api/user', {
                method: "POST",
                body: JSON.stringify(body)
            }).catch(() => {
                window.location.reload()
            })
        } catch (err) {
            console.log(err)
        }
    }

    const checkNftButton = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
                const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
                const USER = await signer.getAddress()
                const wins = await lottery._allowToNFT(USER)
                for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                    if (!await nft.istokenMints(wins.lotteryes[i])) {
                        setNftButton(true)
                        break
                    }
                }

            }
        } catch (err) {
            console.log(err)
        }
        //setNftButton(true)
    }

    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                localStorage.setItem("WalletConnect", "true")
                setNewUSer()
                setisWalletConnect(true)
            } catch (err) {
                console.log(err)
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask")
        }
    }
    const checkWallet = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            await signer.getAddress()
            if (localStorage.getItem('WalletConnect') === 'true') {
                setisWalletConnect(true)
            }
        } catch (err) {
            localStorage.removeItem('WalletConnect')
            setisWalletConnect(false)
        }
    }

    const [news, setnews] = useState([])

    const getAllNews = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const user = await signer.getAddress()
            const constructorNews = []
            await fetch('/api/getUserData', {
                method: "POST",
                body: user
            })
                .then(async (data) => {
                    const temp = await data.json()
                    const t = temp.news.split("&")
                    t.pop()
                    t.map(element => {
                        let data = element.split("_")
                        let winOrLose
                        if (data[5] == "1") {
                            winOrLose = "Win"
                        } else {
                            winOrLose = "Lose"
                        }

                        constructorNews.push(Object({
                            creator: data[0],
                            id: data[1],
                            token: data[2],
                            deposit: data[3],
                            countOfPlayers: data[4],
                            isWin: winOrLose
                        }
                        ))
                    });

                })
            setnews(constructorNews)
        } catch (err) {
            console.log(err)
        }
    }


    if (isWalletConnect)
        return (
            <div className='wallet center'>
                <div className='otstup widthmint'>{NftButton && <MintNftButton />}</div>
                <div className='otstup'>
                    <div className="dropdown">
                        <Image className="white" src="/news.png" width={25} height={25} />
                        <div className="dropdown-content">
                            {news && news.map((element) =>
                                <div>
                                    {"..."}
                                    {element.creator.substr(37, 5)}
                                    {" Deposit:"}
                                    {element.deposit}
                                    {" Players:"}
                                    {element.countOfPlayers}
                                    {" "}
                                    {element.isWin}
                                </div>
                            )}
                        </div>
                    </div >
                </div>
                <div className='otstup'><button onClick={() => {
                    if (!isWalletAlert)
                        document.body.style.overflow = ('overflow', 'hidden')
                    setisWalletAlert(!isWalletAlert)
                }} className="mybutton">Account</button></div>
                <WalletAlert active={isWalletAlert} setActive={setisWalletAlert} />
            </div >
        )
    else {
        return (
            <button onClick={connectWalletHandler} className="wallet mybutton center">Connect Wallet</button>
        )
    }
}
