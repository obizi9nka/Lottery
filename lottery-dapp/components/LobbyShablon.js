const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'



export default function LobbyShablon(lobby) {

    const EnterLobby = async () => {
        console.log(lobby.creator, lobby.id)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.EnterLobby(lobby.creator, lobby.id)
        await tx.wait()

        const creator = lobby.creator
        const id = lobby.id
        const body = { creator, id }

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
        <div className='newLobby'>
            <p> Creator: {lobby.creator}
                deposit: {lobby.deposit}
                nowInLobby: {lobby.nowInLobby}
                countOfPlayers: {lobby.countOfPlayers}
                token: {lobby.IERC20}
                _______
                <button onClick={EnterLobby}> Enter </button>
            </p>
        </div>
    )
}