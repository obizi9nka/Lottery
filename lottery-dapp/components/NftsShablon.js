const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Image from 'next/image';




export default function NftsShablon({ data }) {

    let image = `/images/${data.edition}.png`

    return (
        <div className='nftsShablon'>
            <div className='bordernft'>
                <Image src={image} width={90} height={90} />
                <p>#{data.edition}</p>
            </div>
        </div>
    )
}