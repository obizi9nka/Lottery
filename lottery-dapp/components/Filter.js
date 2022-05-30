const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'



export default function Filter(lobbyes, settings) {
    if (settings === '')
        return

    let filtered = lobbyes

    const token = settings.indexOf("0x")
    const deposit_up = settings.indexOf("deposit_up")
    const deposit_down = settings.indexOf("deposit_down")
    const countOfPlayers_up = settings.indexOf("countOfPlayers_up")
    const countOfPlayers_down = settings.indexOf("countOfPlayers_down")
    const nowInLobby_up = settings.indexOf("nowInLobby_up")
    const nowInLobby_down = settings.indexOf("nowInLobby_down")

    if (token !== -1) {
        console.log("token")
        let _token = settings.substr(token, 42)
        filtered = filtered.filter((element) => {
            return element.IERC20 === _token
        })
    }

    ///////////////////////////////////////////////////////////

    /*
    if (deposit_up !== -1 && countOfPlayers_up !== -1) {
        console.log("1")
        filtered.sort((a, b) => {
            return (a.deposit + a.countOfPlayers) - (b.deposit + b.countOfPlayers)
        })
        return filtered
    }

    else if (deposit_up !== -1 && countOfPlayers_down !== -1) {
        console.log("2")
        filtered.sort((a, b) => {
            return (a.deposit - b.deposit) - (a.countOfPlayers - b.countOfPlayers)
        })
        return filtered
    }

    else if (deposit_down !== -1 && countOfPlayers_up !== -1) {
        console.log("3")
        filtered.sort((a, b) => {
            return a.deposit - b.deposit
        })
        return filtered
    }

    else if (deposit_down !== -1 && countOfPlayers_down !== -1) {
        console.log("4")
        filtered.sort((a, b) => {
            return a.deposit - b.deposit
        })
        return filtered
    }

    */
    ///////////////////////////////////////////////////////////

    if (deposit_up !== -1) {
        console.log("deposit_up")
        filtered.sort((a, b) => {
            return a.deposit - b.deposit
        })
    }

    else if (deposit_down !== -1) {
        console.log("deposit_down")
        filtered.sort((a, b) => {
            return b.deposit - a.deposit
        })
    }

    ///////////////////////////////////////////////////////////

    else if (countOfPlayers_up !== -1) {
        console.log("countOfPlayers_up")
        filtered.sort((a, b) => {
            return a.countOfPlayers - b.countOfPlayers
        })
    }

    else if (countOfPlayers_down !== -1) {
        console.log("countOfPlayers_down")
        filtered.sort((a, b) => {
            return b.countOfPlayers - a.countOfPlayers
        })
    }

    ///////////////////////////////////////////////////////////

    else if (nowInLobby_up !== -1) {
        console.log("nowInLobby_up")
        filtered.sort((a, b) => {
            return a.nowInLobby - b.nowInLobby
        })
    }

    else if (nowInLobby_down !== -1) {
        console.log("nowInLobby_down")
        filtered.sort((a, b) => {
            return b.nowInLobby - a.nowInLobby
        })
    }




    return filtered
}