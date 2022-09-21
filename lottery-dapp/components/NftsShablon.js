const { ethers } = require("ethers");
import { useState, useEffect, CSSProperties } from 'react'
import Image from 'next/image';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")

import PropagateLoader from "react-spinners/PropagateLoader";


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


export default function NftsShablon({ Data, chainId, tymblerNaNetwork, LotteryId, settxData }) {


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
        if (Data.ismints) {
            setLoading(true)
            checkcost()
        }
        setisowner(Data.isowner)
        setcost(0)
        setIsTokenOnSell(false)
        setclicked(false)
        setisAutoEnterPined(Data.autoEnterBD)
        setMessageFromData(Data.message)
    }, [chainId, Data])

    const checkcost = async () => {
        const tokenChecking = Data.edition
        try {
            let provider
            if (tymblerNaNetwork)
                provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            else
                provider = new ethers.providers.JsonRpcProvider
            const contract = new ethers.Contract(tymblerNaNetwork ? MudeBzNFTETH : MudeBzNFTLocalhost, MudebzNFT.abi, provider)
            const owner = await contract.ownerOf(Data.edition)
            const _cost = parseInt(BigInt(await contract.getCost(owner, Data.edition))) / 10 ** 18
            if (_cost > 0 && tokenChecking == Data.edition) {
                Data.isOnSell = _cost
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
        setLoading(false)
    }

    const putOnSell = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })


            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, data)
            const tx = await contract.putOnSell(Data.edition, BigInt(cost * 10 ** 18))
            await tx.wait()
            setIsTokenOnSell(true)
            setcost()
            setclicked(false)
            settxData({
                isPending: true,
                result: true
            })
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
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, data)
            const tx = await contract.removeFromSell(Data.edition)
            await tx.wait()
            setIsTokenOnSell(false)
            settxData({
                isPending: true,
                result: true
            })
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
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, data)
            const owner = await contract.ownerOf(Data.edition)
            const _cost = await contract.getCost(owner, Data.edition)
            const tx = await contract.trigerSell(owner, Data.edition, { value: BigInt(_cost) })
            await tx.wait()
            setIsTokenOnSell(false)
            setisowner(true)
            settxData({
                isPending: true,
                result: true
            })
        } catch (err) {
            console.log(err)
            settxData({
                isPending: true,
                result: false
            })
        }
    }

    const setMessage = async () => {
        settxData({
            isPending: true,
            result: null
        })
        setIsMessage(false)
        const body = { address, message: enteredMessage, chainId, tokenId: Data.edition }
        await fetch('/api/setMessage', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(() => {
            settxData({
                isPending: true,
                result: true
            })
        }).catch(() => {
            settxData({
                isPending: true,
                result: false
            })
        })
    }

    const addToAutoEnter = async () => {
        const body = { address, chainId, tokenId: Data.edition }
        await fetch('/api/addToAutoEnter', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(() => {
            Data.autoEnterBD = true
            setisAutoEnterPined(true)
        })
    }

    const deleteFromAutoEnter = async () => {
        const body = { address, chainId, tokenId: Data.edition }
        await fetch('/api/deleteFromAutoEnter', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(() => {
            Data.autoEnterBD = false
            setisAutoEnterPined(false)
        })
    }

    // console.log(LotteryId)

    let image = `/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${Data.edition % 300 + 1}.png`

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
                                                <input className='input' onChange={e => setcost(e.target.value)} style={{ width: "80px" }} placeholder={`${!tymblerNaNetwork ? "ETH" : "BNB"}`} />
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
                                    <button onClick={() => buy()} className='mybutton'>Buy</button>
                                </div> : Data.ismints ? <div style={{ color: "white" }}>{MessageFromData}</div>
                                    : Data.isAutoEnter ? < div className='' style={{ color: "white" }}>ENTERED</div>
                                        : LotteryId < Data.edition ? < div >
                                            {!isAutoEnterPined && < button className='mybutton' onClick={addToAutoEnter}>Add to autoenter</button>}
                                            {isAutoEnterPined && < button className='mybutton' style={{ backgroundColor: 'purple' }} onClick={deleteFromAutoEnter}>Delete from autoenter</button>}
                                        </div>
                                            : LotteryId == Data.edition ? <div >Only once.</div>
                                                : <div />
                                }
                            </div>
                    }

                    <div className={Data.ismints ? "greendot absolute" : "reddot absolute "} >
                        <div className='nftinfo'>
                            {Data.edition}
                        </div>
                    </div>




                </div>
            </div>
        </div >
    )

}

// {clicked && <input className='input ' onChange={e => setcost(e.target.value)} style={{ width: "70px" }} placeholder='cost' />}
//                                 {!istokenOnSell && !isMessage && <button onClick={putOnSell} className='mybutton '>Put On Sell</button>}
//
//                                 {!istokenOnSell && isMessage && <input className='inputMessage' onChange={e => setenteredMessage(e.target.value)} />}
//                                 {!istokenOnSell && isMessage && <button onClick={setMessage} className='mybutton'>go</button>}
//                                 {istokenOnSell && <button onClick={removeFromSell} className='mybutton '>Remove from sale</button>}


// if (ISowner || Data.isowner)
//         return (
//             <div className='nftsShablon'>
//                 <div className='pad'>
//                     <div className='bordernft'>
//                         <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
//                         <div className='i'>
//                             {istokenOnSell && <div className='inline'>
//                                 <div style={{ color: "white", fontSize: 30, alignSelf: "center" }}>{cost}</div>
//                                 <Image src="/tokens/ETH.png" style={{ "border-radius": 10 }} width={20} height={20} />
//                             </div>}
//                             {clicked && <input className='input ' onChange={e => setcost(e.target.value)} style={{ width: "70px" }} placeholder='cost' />}
//                             {!istokenOnSell && <button onClick={putOnSell} className='mybutton '>Sell</button>}
//                             {istokenOnSell && <button onClick={removeFromSell} className='mybutton '>Cancel</button>}
//                         </div>
//                         <div className={Data.ismints ? "greendot absolute" : "reddot absolute"} />
//                     </div>
//                 </div>
//             </div >
//         )
//     else
//         return (
//             <div className='nftsShablon'>
//                 <div className='pad'>
//                     <div className='bordernft'>
//                         <Image src={image} style={{ "border-radius": 10 }} width={200} height={200} />
//                         <div className='i'>
//                             {istokenOnSell && <h1 style={{ color: "white" }}> {cost}</h1>}
//                             {istokenOnSell && <Image src="/tokens/ETH.png" style={{ "border-radius": 10 }} width={20} height={20} />}
//                             {istokenOnSell && <button onClick={buy} className='mybutton i'>Buy</button>}
//                         </div>
//                         <div className={Data.ismints ? "greendot absolute" : "reddot absolute"} />
//                     </div>
//                 </div>
//             </div>
//         )