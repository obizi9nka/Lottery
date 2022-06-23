import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import WalletAlert from './WalletAlert';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';

export default function Wallet({ f, chainId }) {


    const [NftButton, setNftButton] = useState(false)
    const [isWalletConnect, setisWalletConnect] = useState(false)
    const [isWalletAlert, setisWalletAlert] = useState(false)
    const [user, setuser] = useState("")

    // console.log(NftButton)

    useEffect(() => {
        if (chainId > 0) {
            checkNftButton()
            getAllNews()
            checkWallet()
        }
    }, [isWalletConnect, user, chainId])

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
    setUser()

    useEffect(() => {
        window.ethereum.on("accountsChanged", () => {
            setUser()
            setNewUSer()
        });
    }, [])




    // console.log(user, NftButton)



    async function setNewUSer() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const net = await provider.getNetwork()
            const body = { address, chainId: net.chainId }

            await fetch('/api/user', {
                method: "POST",
                body: JSON.stringify(body)
            }).then((data) => {
                if (data.status == 200) {
                    console.log(data.status)
                    window.location = "http://localhost:3000/About"
                }
            })
        } catch (err) {

        }

    }

    useEffect(() => {
        try {
            const provider = new ethers.providers.JsonRpcProvider
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const contractM = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            contract.once("play", async (winer) => {
                checkNftButton()
            })
            contractM.once("NewNFT", async (user, id) => {
                checkNftButton()
            })
        } catch (err) {
        }
    }, [])

    const checkNftButton = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const lottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const nft = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            const USER = await signer.getAddress()
            const wins = await lottery._allowToNFT(USER)
            let flag = false
            for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                if (!await nft.istokenMints(parseInt(wins.lotteryes[i], 10))) {
                    flag = true
                    break
                }
            }
            setNftButton(flag)
        } catch (err) {
            setNftButton(false)
            console.log(err)
        }
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
    const [now, setnow] = useState()

    const getAllNews = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const user = await signer.getAddress()
            const constructorNews = []
            const body = { user, chainId }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
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
            const _now = new Date();
            setnow(_now)
            constructorNews.reverse()
            setnews(constructorNews)
        } catch (err) {
            setnews()
            console.log(err)
        }
    }

    const deleteNews = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const u = await signer.getAddress()
        try {
            await fetch("/api/deleteAllNews", {
                method: "POST",
                body: u
            })
        } catch (err) {
            console.log(err)
        }
        setnews([])
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
                                    <div className={'reload'}>
                                        {now && now.toString().substring(16, 24)}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div >
                </div>
                <div className='otstup widthmint'>{NftButton && <MintNftButton chainId={chainId} />}</div>
                <div className='otstup'><button onClick={() => {
                    if (!isWalletAlert)
                        document.body.style.overflow = ('overflow', 'hidden')
                    setisWalletAlert(!isWalletAlert)
                }} className="mybutton size" >{"0x..." + f.substring(38, 42)}</button></div>
                <WalletAlert active={isWalletAlert} setActive={setisWalletAlert} chainId={chainId} />
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
