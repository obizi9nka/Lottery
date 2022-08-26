const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"




export default function NftsShablon({ data, chainId }) {


    const [ISowner, setisowner] = useState()
    const [cost, setcost] = useState()
    const [istokenOnSell, setIsTokenOnSell] = useState()
    const [clicked, setclicked] = useState()

    useEffect(() => {
        if (data.ismints) {
            checkcost()
        }
        setisowner(data.isowner)
        setcost(0)
        setIsTokenOnSell(false)
        setclicked(false)
    }, [chainId, data])


    const checkcost = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            const owner = await contract.ownerOf(data.edition)
            const _cost = parseInt(BigInt(await contract.getCost(owner, data.edition))) / 10 ** 18
            if (_cost > 0) {
                setcost(_cost)
                setIsTokenOnSell(true)
            } else {
                setcost(0)
                setIsTokenOnSell(false)
            }
        } catch (err) {
            console.log(err)
            setcost(0)
            setIsTokenOnSell(false)
        }
    }

    const putOnSell = async () => {
        if (clicked) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const singer = provider.getSigner()
                const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, singer)
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
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, singer)
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
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, singer)
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

    if (ISowner || data.isowner)
        return (
            <div className='nftsShablon'>
                <div className='pad'>
                    <div className='bordernft'>
                        <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
                        <div className='i'>
                            {istokenOnSell && <div className='inline'>
                                <div style={{ color: "white", fontSize: 30, alignSelf: "center" }}>{cost}</div>
                                <Image src="/tokens/ETH.png" style={{ "border-radius": 10 }} width={20} height={20} />
                            </div>}
                            {<div style={{ color: "white" }}>{data.edition}{data.ismints ? "+" : "-"}</div>}
                            {clicked && <input className='input ' onChange={e => setcost(e.target.value)} style={{ width: "70px" }} placeholder='cost' />}
                            {!istokenOnSell && <button onClick={putOnSell} className='mybutton '>Sell</button>}
                            {istokenOnSell && <button onClick={removeFromSell} className='mybutton '>Cancel</button>}
                        </div>
                        <div className={data.ismints ? "greendot absolute" : "reddot absolute"} />

                    </div>
                </div>
            </div >
        )
    else
        return (
            <div className='nftsShablon'>
                <div className='pad'>
                    <div className='bordernft'>
                        <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
                        {data.isAutoEnter && <div className="Yes" >
                            <Image src="/yes.png" width={20} height={20} />
                        </div>}
                        <div className='i'>
                            {<div style={{ color: "white" }}>{data.edition}{data.ismints ? "+" : "-"}</div>}
                            {istokenOnSell && <h1 style={{ color: "white" }}> {cost}</h1>}
                            {istokenOnSell && <Image src="/tokens/ETH.png" style={{ "border-radius": 10 }} width={20} height={20} />}
                            {istokenOnSell && <button onClick={buy} className='mybutton i'>Buy</button>}
                        </div>
                        <div className={data.ismints ? "greendot absolute" : "reddot absolute"} />

                    </div>
                </div>
            </div>
        )
}