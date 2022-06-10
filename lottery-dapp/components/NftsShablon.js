const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Image from 'next/image';
const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"




export default function NftsShablon({ data, isowner, istokensMints }) {

    const [ISowner, setisowner] = useState(isowner)
    const [cost, setcost] = useState(0)
    const [istokenOnSell, setIsTokenOnSell] = useState(false)
    const [clicked, setclicked] = useState(false)

    useEffect(() => {
        if (istokensMints) {
            checkcost()
        }
    }, [])


    const checkcost = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
            const owner = await contract.ownerOf(data.edition)
            const _cost = parseInt(BigInt(await contract.getCost(owner, data.edition))) / 10 ** 18
            if (_cost > 0) {
                setcost(_cost)
                setIsTokenOnSell(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const putOnSell = async () => {
        if (clicked) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const singer = provider.getSigner()
                const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
                const tx = await contract.putOnSell(data.edition, BigInt(cost * 10 ** 18))
                await tx.wait()
                setIsTokenOnSell(true)
                setcost()
                setclicked(false)
            } catch (err) {
                console.log(err)
            }
        } else
            setclicked(true)

    }

    const removeFromSell = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.removeFromSell(data.edition)
            await tx.wait()
            setIsTokenOnSell(false)
        } catch (err) {
            console.log(err)
        }
    }
    const buy = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const owner = await contract.ownerOf(data.edition)
            const _cost = await contract.getCost(owner, data.edition)
            const tx = await contract.trigerSell(owner, data.edition, { value: BigInt(_cost) })
            await tx.wait()
            setIsTokenOnSell(false)
            setisowner(true)
        } catch (err) {
            console.log(err)
        }
    }


    let image = `/images/${data.edition}.png`

    if (ISowner || isowner)
        return (
            <div className='nftsShablon'>
                <div className='pad'>
                    <div className='bordernft'>
                        <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
                        <div className='i'>
                            <h1 style={{ color: "white" }}>#{data.edition} </h1>
                            {istokenOnSell && <h1 style={{ color: "white" }}>{cost}</h1>}
                            {clicked && <input className='input i' onChange={e => setcost(e.target.value)} style={{ width: "70px" }} placeholder='cost' />}
                            {!istokenOnSell && <button onClick={putOnSell} className='mybutton i'>Sell</button>}
                            {istokenOnSell && <button onClick={removeFromSell} className='mybutton i'>Cancel</button>}
                        </div>
                        <div className={istokensMints ? "greendot absolute" : "reddot absolute"} />
                    </div>
                </div>
            </div>
        )
    else
        return (
            <div className='nftsShablon'>
                <div className='pad'>
                    <div className='bordernft'>
                        <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
                        <div className='i'>
                            <h1 style={{ color: "white" }}>#{data.edition} </h1>
                            {istokenOnSell && <h1 style={{ color: "white" }}> {cost}</h1>}
                            {istokenOnSell && <button onClick={buy} className='mybutton i'>Buy</button>}
                        </div>
                        <div className={istokensMints ? "greendot absolute" : "reddot absolute"} />
                    </div>
                </div>
            </div>
        )
}