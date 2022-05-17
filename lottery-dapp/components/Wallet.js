import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import WalletAlert from './WalletAlert';

export default function Wallet() {

    let USER = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [NftButton, setNftButton] = useState(false)
    const [isWalletConnect, setisWalletConnect] = useState(false)
    const [isWalletAlert, setisWalletAlert] = useState(false)

    useEffect(() => {
        checkWallet()
        checkNftButton()
    }, [isWalletConnect])




    const checkNftButton = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
                const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
                USER = await signer.getAddress()
                const wins = await lottery._allowToNFT(USER)
                for (let i = 0; i < wins.count; i++) {
                    if (!nft.istokenMints(wins.lotteryes[i])) {
                        setNftButton(true)
                        break
                    }
                }

            }
        } catch (err) {
            //console.log(err)
        }
        setNftButton(true)
    }

    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                window.ethereum.on('accountsChanged', async () => { })
                setisWalletConnect(true)
                localStorage.setItem("WalletConnect", "true")
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

    if (isWalletConnect)
        return (
            <div className='nav center'>
                {NftButton && <MintNftButton />}
                <button onClick={() => setisWalletAlert(!isWalletAlert)} className="wallet mybutton">Account</button>
                <WalletAlert active={isWalletAlert} setActive={setisWalletAlert} user={USER} />
            </div>
        )
    else {
        return (
            <button onClick={connectWalletHandler} className="wallet mybutton center">Connect Wallet</button>
        )
    }
}
