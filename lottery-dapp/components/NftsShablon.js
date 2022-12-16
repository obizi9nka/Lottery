const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB, ETHid, BNBid, LocalhostId, PRODACTION } from './Constants.js';
import MudebzNFT from "/blockchain/MudebzNFT.json"

import PropagateLoader from "react-spinners/PropagateLoader";
import IssueMaker from './IssueMaker.js';

import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    useNetwork,
    useProvider,
    useSigner,
    usePrepareContractWritde
} from 'wagmi';


export default function NftsShablon({ LOTTERY_ADDRESS, NFT_ADDRESS, setneedWallet, Data, chainId, tymblerNaNetwork, LotteryId, settxData, setNFTS }) {

    // console.log(Data)

    const [ISowner, setisowner] = useState()
    const [cost, setcost] = useState()
    const [istokenOnSell, setIsTokenOnSell] = useState()
    const [clicked, setclicked] = useState()

    const [enteredMessage, setenteredMessage] = useState("")
    const [isMessage, setIsMessage] = useState(false)
    const [MessageFromData, setMessageFromData] = useState()

    const [isAutoEnterPined, setisAutoEnterPined] = useState()

    const { data } = useSigner()
    const { address, isConnected } = useAccount()


    const [wannaSell, setWannaSell] = useState(false)
    const [wannaMessage, setWannaMessage] = useState(false)
    const [Mode, setMode] = useState(false)


    let [loading, setLoading] = useState(false);


    useEffect(() => {
        setcost(Data.price)
        setIsTokenOnSell(Data.price != null)
        setisowner(Data.isowner)
        setclicked(false)
        setisAutoEnterPined(Data.autoEnterBD)
        setMessageFromData(Data.message)
    }, [chainId, Data])

    const putOnSell = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })

            const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, data)
            const tx = await contract.putOnSell(Data.edition, BigInt(cost * 10 ** 18))
            await tx.wait()

            setIsTokenOnSell(true)
            setclicked(false)
            settxData({
                isPending: true,
                result: true
            })

            const body = { tokenId: Data.edition, chainId, price: parseFloat(cost) }
            await fetch('/api/update1000', {
                method: "POST",
                body: JSON.stringify(body)
            })

            setIsTokenOnSell(true)
            Data.price = cost

        } catch (err) {
            console.log(err)
            settxData({
                isPending: true,
                result: false
            })
        }
    }

    const removeFromSell = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, data)
            const tx = await contract.removeFromSell(Data.edition)
            await tx.wait()
            setIsTokenOnSell(false)
            settxData({
                isPending: true,
                result: true
            })
            const body = { tokenId: Data.edition, chainId, price: 0 }
            await fetch('/api/update1000', {
                method: "POST",
                body: JSON.stringify(body)
            })
            setcost()
            setIsTokenOnSell(false)
            Data.price = null
        } catch (err) {
            console.log(err)
            settxData({
                isPending: true,
                result: false
            })
        }
    }

    const buy = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, data)
            const owner = await contract.ownerOf(Data.edition)
            // const _cost = await contract.getCost(owner, Data.edition)
            const tx = await contract.trigerSell(owner, Data.edition, { value: BigInt(Data.price * 10 ** 18) })
            await tx.wait()
            setIsTokenOnSell(false)
            setcost()
            setisowner(true)
            settxData({
                isPending: true,
                result: true
            })
            const body = { tokenId: Data.edition, chainId, price: 0 }
            await fetch('/api/update1000', {
                method: "POST",
                body: JSON.stringify(body)
            })

            setIsTokenOnSell(false)
            Data.price = null
        } catch (err) {
            console.log(err)
            let issue = IssueMaker({ data: err.code, from: "buy" })
            if (!isConnected)
                issue = "Connect Wallet"
            settxData({
                isPending: false,
                result: false,
                issue
            })
            if (!isConnected) {
                setneedWallet(true)
            }
        }
    }

    const setMessage = async () => {
        setIsMessage(false)
        const body = { address, message: enteredMessage, chainId, tokenId: Data.edition }
        await fetch('/api/setMessage', {
            method: "POST",
            body: JSON.stringify(body)
        })
        Data.message = enteredMessage
        setMode(!Mode)
    }

    const addToAutoEnter = async () => {
        setisAutoEnterPined(true)
        const body = { address, chainId, tokenId: Data.edition }
        await fetch('/api/addToAutoEnter', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(() => {
            Data.autoEnterBD = true
        })
    }

    const deleteFromAutoEnter = async () => {
        setisAutoEnterPined(false)
        const body = { address, chainId, tokenId: Data.edition }
        await fetch('/api/deleteFromAutoEnter', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(() => {
            Data.autoEnterBD = false
        })
    }

    let image = `/${tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${Data.edition}.png`


    return (
        <div className='nftsShablon'>
            <div className='pad'>
                <div className={Data.edition == LotteryId ? 'bordernft ID' : "bordernft"}>
                    <div className='imageNftShablon'>
                        <Image src={image} onClick={() => { setMode(!Mode); setWannaSell(false); setWannaMessage(false) }} style={{ "border-radius": 10 }} width={200} height={200} />
                    </div>

                    {loading ? <div className="loading">
                        <PropagateLoader color='purple' size={17} />
                    </div> :
                        (ISowner || Data.isowner) ?
                            <div className='i' >
                                {istokenOnSell ?
                                    <button onClick={removeFromSell} className='mybutton '>Remove from sale</button>
                                    :
                                    Mode ?
                                        <div>
                                            <div style={{ color: "white" }}>{MessageFromData}</div>
                                        </div>
                                        :
                                        wannaSell ?
                                            <div className='pylt'>
                                                <input className='input' onChange={e => setcost(e.target.value)} style={{ width: "80px" }} placeholder={`${tymblerNaNetwork ? "ETH" : "BNB"}`} />
                                                <button onClick={putOnSell} className='mybutton '>Put On Sell</button>
                                            </div>
                                            :
                                            wannaMessage ?
                                                <div className=''>
                                                    <textarea type="text" className='inputmessage' maxLength={115} onChange={e => setenteredMessage(e.target.value)} />
                                                    <button onClick={setMessage} className='mybutton ok'></button>
                                                </div>
                                                :
                                                <div className='pylt'>
                                                    {<button onClick={() => setWannaSell(true)} className='mybutton '>Put On Sell</button>}
                                                    {< button onClick={() => setWannaMessage(true)} className='mybutton '>Message</button>}
                                                </div>}
                            </div>
                            :
                            <div className='i'>
                                {istokenOnSell ? <div>
                                    <button onClick={() => buy()} className='mybutton'>Buy {Data.price} ETH</button>
                                </div> : Data.ismints ? <div style={{ color: "white" }}>{MessageFromData}</div>
                                    : Data.isAutoEnter ? < div className='' style={{ color: "white" }}>ENTERED</div>
                                        : LotteryId < Data.edition && chainId > 0 ? < div >
                                            {!isAutoEnterPined && < button className='mybutton' onClick={addToAutoEnter}>Add to autoenter</button>}
                                            {isAutoEnterPined && < button className='mybutton' style={{ backgroundColor: 'purple' }} onClick={deleteFromAutoEnter}>Delete from autoenter</button>}
                                        </div>
                                            : LotteryId == Data.edition ? <div style={{ fontSize: "23px", fontWeight: "600" }}>{Data.date}</div>
                                                : <div style={{ color: "whitesmoke" }}>{Data.date}</div>
                                }
                            </div>
                    }

                    <div className={Data.ismints ? "dot absolute" : "dot absolute "} style={{ backgroundColor: Data.ismints ? "#00ff08" : "rgb(255, 0, 0)" }}>
                        <div className='nftinfo'>
                            <div className='nftinfo2'>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Token number: {Data.edition}
                                </div>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Data: {Data.date}
                                </div>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Bank: {Data.players != null ? `${Data.players * 5}` : 'TBА'}
                                </div>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Players: {Data.players != null ? `${Data.players}` : 'TBА'}
                                </div>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Price: {istokenOnSell ? `${cost} ETH` : 'Not on sale'}
                                </div>
                                <div style={{ fontWeight: "500", color: "black" }}>
                                    Transfers count: {Data.TransferCount}
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </div >
    )

}
