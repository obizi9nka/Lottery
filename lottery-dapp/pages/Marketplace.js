import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import MudeBzNFT from "C:/Lottery/lottery/artifacts/contracts/MudeBzNFT.sol/MudebzNFT.json"

export default function Home() {

    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [TokenId, setTokenId] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)

    const approve = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const contractM = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, singer)
            const tx = await contract.approve(MudeBzNFTAddress, contractM.nftPrice())
            await tx.wait()
        }
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

    const balanceOf = async () => {
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
                <title>!Mudebz Marketplace</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='container'>
                <div className='filter'>
                    f
                    <p>a</p>
                </div>

                <div className='nfts'>
                    f
                </div>
            </div>

        </div>
    )
}