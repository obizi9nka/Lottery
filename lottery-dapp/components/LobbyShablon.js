const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "/blockchain/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';


import Image from 'next/image';


export default function LobbyShablon({ lobby, index, settxData }) {


    const EnterLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const newPlayer = await signer.getAddress()
        const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, signer)
        const tx = await contract.EnterLobby(lobby.creator, lobby.id)
        await tx.wait()

        const creator = lobby.creator
        const id = lobby.id
        const body = { creator, id, newPlayer }

        try {
            fetch("/api/enterLobby", {
                method: "POST",
                body: JSON.stringify(body)
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='LobbyShablonActive'>
            <div className="tokeninlobbyshablon gridcenter">
                {<Image className="tokenpng" alt='?' src={`/tokens/${lobby.IERC20}.png`} width={45} height={45} />}
            </div>
            <div className='countofplayers gridcenter'>
                {lobby.nowInLobby}/{lobby.countOfPlayers}
                <Image src="/countOfPlayers.png" width={27} height={27} />
            </div>
            <div className='depositlobby gridcenter'>{lobby.deposit}</div>
            <button className='enter mybutton gridcenter' onClick={EnterLobby}> Enter </button>
        </div>
    )

}
