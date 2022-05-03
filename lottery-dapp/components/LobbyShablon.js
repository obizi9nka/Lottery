const { ethers } = require("ethers");
import { useState, useEffect } from 'react'

export default function LobbyShablon(lobby) {
    return (
        <div className='newLobby'>
            <p> Creator: {lobby.creator} deposit: {lobby.deposit} nowInLobby: {lobby.nowInLobby} countOfPlayers: {lobby.countOfPlayers}</p>
        </div>
    )
}