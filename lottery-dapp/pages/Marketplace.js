import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import MudeBzNFT from "C:/Lottery/lottery/artifacts/contracts/MudeBzNFT.sol/MudebzNFT.json"
import metadata from "C:/Lottery/nfts/hashlips_art_engine/build/json/_metadata.json"
import NftsShablon from '../components/NftsShablon';

export default function Home() {

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

    const nfts = async () => {
        metadata.forEach(element => {
            console.log(element.image)
        });
    }

    //nfts()

    return (
        <div className='some-padding'>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='titel'>!Mudebz NFTS</h1>
            <div>
                {metadata.map((element) => < NftsShablon data={element} />)}
                {metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}{metadata.map((element) => < NftsShablon data={element} />)}
            </div>



        </div>
    )
}

/*
<div className='container marketplace'>
                <div className='filter'>

                </div>

                <div className='nfts'>

                </div>
            </div>
*/