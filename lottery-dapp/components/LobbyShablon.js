const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Image from 'next/image';



export default function LobbyShablon(lobby) {

    const [isfaund, setisfaund] = useState(true)


    const EnterLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const newPlayer = await signer.getAddress()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
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

    if (lobby.allOrActive) {
        return (
            <div className={lobby.index ? 'LobbyShablonKOSTLb ' : 'LobbyShablonKOSTLb'}>
                <div className="tokeninlobbyshablon gridcenter">
                    {isfaund && <Image className="tokenpng" alt='?' src={`/tokens/${lobby.IERC20}.png`} width={45} height={45} />}
                    {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={45} height={45} />}
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
    else {
        return (
            <div className={lobby.index ? 'LobbyShablonKOSTLb ' : 'LobbyShablon'}>
                <div className="tokeninlobbyshablon gridcenter">
                    {isfaund && <Image className="tokenpng" alt='?' src={`/tokens/${lobby.IERC20}.png`} width={45} height={45} />}
                    {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={45} height={45} />}
                </div>
                <div className='countofplayers gridcenter'>
                    {lobby.nowInLobby}/{lobby.countOfPlayers}
                    <Image src="/countOfPlayers.png" width={27} height={27} />
                </div>
                <div className='depositlobby gridcenter'>{lobby.deposit}</div>
            </div>
        )

    }
}
