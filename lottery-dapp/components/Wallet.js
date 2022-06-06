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
        } catch {
            console.log("Connect Wallet")
            setuser("")
        }
    }

    useEffect(() => {
        window.ethereum.on("accountsChanged", () => {
            setUser()
            checkWallet()
        });
    }, [])

    useEffect(() => {
        checkNftButton()
        getAllNews()
    }, [isWalletConnect, user])

    async function setNewUSer() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const body = { address }

        const prom = new Promise(async (res, rej) => {
            try {
                res(await fetch('/api/user', {
                    method: "POST",
                    body: JSON.stringify(body)
                }))
            } catch (e) {
            }
        })
        prom.then(async (data) => {
            console.log(await data.json())
            window.location.reload()
        })
    }

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        const contractM = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
        contract.on("play", async (winer) => {
            console.log("emit play", winer)
            checkNftButton()
        })
        contractM.on("NewNFT", async (user, id) => {
            console.log("new nft", user, id)
            checkNftButton()
        })
    }, [])

    const checkNftButton = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
                const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
                const USER = await signer.getAddress()
                const wins = await lottery._allowToNFT(USER)
                let flag = false
                for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                    if (!await nft.istokenMints(wins.lotteryes[i])) {
                        flag = true
                        break
                    }
                }
                setNftButton(flag)
            }
        } catch (err) {
            setNftButton(false)
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
                    if (!temp.news)
                        return
                    const t = temp.news.split("&")
                    t.pop()
                    t.map(element => {
                        let data = element.split("_")
                        let winOrLose = "Lose"
                        if (data[5] == "1") {
                            winOrLose = "Win"
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
            constructorNews.reverse()
            setnews(constructorNews)
        } catch (err) {
            setnews()
            console.log(err)
        }
    }

    const deleteNews = async () => {
        console.log(user)
        try {
            await fetch("/api/deleteAllNews", {
                method: "POST",
                body: user
            }).then(setnews([]))
        } catch (err) {
            console.log(err)
        }

    }

    if (isWalletConnect)
        return (
            <div className='wallet'>
                <div className='otstup'>
                    <div className="dropdown" onClick={getAllNews}>
                        <Image src="/news.png" width={25} height={25} />
                        <div className='wraper'>
                            <div className='fff'>
                                <div className="dropdown-content">
                                    <div className={news && news.length > 0 ? 'hearder' : 'hearder alone'}>
                                        <div className='CENTER'>
                                            <Image className="" onClick={deleteNews} src="/delete.png" width={25} height={25} />
                                        </div>
                                        <div className='CENTER'>
                                            {"Creator"}
                                        </div>
                                        <div className='CENTER'>
                                            {"Deposit"}
                                        </div>
                                        <div className='CENTER'>
                                            {"Players"}
                                        </div >
                                        <div className='CENTER'>
                                            {"Exodus"}
                                        </div>
                                    </div>
                                    {news && news.map((element, index) =>
                                        <div className={element.isWin == "Win" ? "win" : null}>
                                            <div className={index === news.length - 1 ? "onenews KOSTLb" : 'onenews'}>
                                                <div className="CENTER" >
                                                    <Image className='token' src={`/tokens/${element.token}.png`} width={25} height={25} />
                                                </div>
                                                <div className='CENTER'>
                                                    {"0x..." + element.creator.substr(38, 4)}
                                                </div>
                                                <div className='CENTER nowrap'>
                                                    {element.deposit}
                                                </div>
                                                <div className='CENTER'>
                                                    {element.countOfPlayers}
                                                </div>
                                                <div className='CENTER'>
                                                    {element.isWin}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div >
                </div>
                <div className='otstup widthmint'>{NftButton && <MintNftButton />}</div>
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
            <div className='wallet'>
                <button onClick={connectWalletHandler} className=" mybutton ">Connect Wallet</button>
            </div>
        )
    }
}
