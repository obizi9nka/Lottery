const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Image from 'next/image';



export default function LobbyShablon(lobby) {

    const EnterLobby = async () => {
        console.log(lobby.creator, lobby.id)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const newPlayer = await signer.getAddress()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.EnterLobby(lobby.creator, lobby.id)
        await tx.wait()

        const creator = lobby.creator
        const id = lobby.id
        const body = { creator, id, newPlayer }

        console.log(newPlayer)
        console.log(body)

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
        <div className='LobbyShablon'>
            <div className='con'>
                <div className="tokeninlobbyshablon"><Image src="/favicon.ico" width={50} height={50} /></div>
                <div className='countofplayers'>
                    {lobby.nowInLobby}/{lobby.countOfPlayers}
                    <Image src="/countOfPlayers.png" width={20} height={20} />
                </div>
            </div>
            <div className='con'>
                <div className='depositlobby'>{lobby.deposit}</div>
                <button className='enter' onClick={EnterLobby}> Enter </button>
            </div>
        </div>
    )
}

/*
<p> deposit: {lobby.deposit}
                nowInLobby: {lobby.nowInLobby}
                countOfPlayers: {lobby.countOfPlayers}
                token: {lobby.IERC20.substr(38, 4)}
                _______
                <button onClick={EnterLobby}> Enter </button>
            </p>
*/