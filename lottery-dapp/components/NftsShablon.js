const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Image from 'next/image';
const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"




export default function NftsShablon({ data, isowner }) {

    let image = `/images/${data.edition}.png`

    if (isowner)
        return (
            <div className='nftsShablon'>
                <div className='bordernft'>
                    <Image src={image} width={90} height={90} />
                </div>
            </div>
        )
    else
        return (
            <div className='nftsShablon'>
                <div className='bordernft'>
                    <Image src={image} width={90} height={90} />
                    <h1 style={{ color: "white" }}>#{data.edition}</h1>
                </div>
            </div>
        )
}