import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import bigStar from 'C:/Lottery/lottery-dapp/images/star-big.png'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"

export default function WalletConnect() {

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')


    const connectWalletHandler = async () => {
        setError('')
        setSuccessMsg('')
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                window.ethereum.on('accountsChanged', async () => { })
                localStorage.setItem("WalletConnect", "true");
            } catch (err) {
                console.log(err)
                setError(err.message)
            }
        } else {
            /* MetaMask is not installed */
            console.log("Please install MetaMask")
        }
    }


    return (
        <div className='walletconnect'>
            <button onClick={connectWalletHandler} className="button">Connect Wallet</button>
        </div>
    )
}