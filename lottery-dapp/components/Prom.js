const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "/blockchain/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
import Image from 'next/image';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    useNetwork,
    defaultChains,
    useAccount,
    useContractWrite,
    useProvider,
    useSigner
} from 'wagmi';
import { resolve } from 'path';

export default function Prom({ LOTTERY_ADDRESS, NFT_ADDRESS, address, shouldrevard, PromSet, PromInput, setPromInput, setPromSet, chainId, tymblerNaNetwork, settxData }) {

    const [prom, setprom] = useState("")

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data

    const [Position, setPosition] = useState({})

    const setProm = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tx = await contract.setPromSet(prom.toString());
            console.log(tx)
            await tx.wait()
            console.log(tx)
            const body = { address: address, PromSet: prom, chainId }
            await fetch("/api/promSet", {
                method: "POST",
                body: JSON.stringify(body)
            })
            setPromSet(prom)
            document.getElementById("Prom").value = "";
            setProm("")
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

    const inputProm = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            console.log(prom, tymblerNaNetwork ? LotteryAddressETH : LotteryAddressBNB)
            const tx = await contract.setPromInput(prom);
            await tx.wait()
            const body = { address: address, PromInput: prom, chainId }
            await fetch("/api/promInput", {
                method: "POST",
                body: JSON.stringify(body)
            })
            setPromInput(prom)
            document.getElementById("Prom").value = "";
            setProm("")
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

    useEffect(() => {
        setPosition({})
    }, [address, chainId])

    const checkPosition = async () => {
        const body = { chainId }
        await fetch('/api/getAllusers', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(async (data) => {
            const temp = await data.json()
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)
            const yourRevard = await contract.getshouldRevard(address)
            const position = 1
            const gg = temp.map(async element => {
                return await new Promise(async (resolve) => {
                    const revard = await contract.getshouldRevard(element.address)
                    resolve(revard)
                    // if (revard > yourRevard) { }
                    // position++
                    // console.log(parseInt(revard), element.address, parseInt(yourRevard))
                });
            });

            await Promise.all(gg).then((data) => {
                let all = 0
                data.forEach((element) => {
                    all++
                    if (element > yourRevard)
                        position++
                })
                const tem = {
                    you: position,
                    all
                }
                setPosition(tem)
            })
        })
    }

    const [IsVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true)
        }, 0);

    }, [])



    return (
        <div className="PROM">
            <div style={{ display: "grid" }}>
                {IsVisible && <div className={(PromInput == null && shouldrevard.isEnteredOnce == 0) || PromSet == null ? 'PromButtons' : "NoButtons"} style={{ gridTemplateRows: "1fr 1fr 1fr" }}>
                    <div >
                        {PromSet == null &&
                            <button onClick={() => { if (prom.length > 0) setProm() }} className="setProm mybutton droch" >Set your code</button>}
                        {PromSet != null &&
                            <div className='Promocode' style={{ color: "purple", height: ((!(PromInput == null && shouldrevard.isEnteredOnce == 0) && PromSet != null) ? "80px" : null) }}>{PromSet}</div>}
                    </div>

                    {((PromInput == null && shouldrevard.isEnteredOnce == 0) || PromSet == null) &&
                        <input className="input droch" id="Prom" placeholder="Enter promo code" onChange={e => setprom(e.target.value)} />
                    }
                    <div>
                        {(PromInput == null && shouldrevard.isEnteredOnce == 0) ?
                            <button onClick={() => { if (prom.length > 0) inputProm() }} className="inputProm mybutton droch" >Enter the code</button> : <div ></div>}
                        {!(PromInput == null && shouldrevard.isEnteredOnce == 0) &&
                            <div className='Promocode' style={{ color: "aqua", height: (!(PromInput == null && shouldrevard.isEnteredOnce == 0) && PromSet != null ? "80px" : null), borderTop: (!(PromInput == null && shouldrevard.isEnteredOnce == 0) && PromSet != null ? "3px solid rgb(41 39 39)" : null) }}>{PromInput}</div>}
                    </div>
                </div>}
            </div>

            <div className="shouldRevard">
                <div className='recive'>
                    Your will recive:
                </div>
                <div className='chifra'>
                    <div className='rilchifra' style={{ color: "purple" }}>
                        {PromInput != null ? (shouldrevard.count - 100 > 0 ? shouldrevard.count - 100 : 0) : shouldrevard.count} <div style={{ color: "aqua" }}>{`${PromInput != null && shouldrevard.isEnteredOnce ? "(+100)" : ""}`}</div>
                    </div>

                </div>
                <div className='position' onClick={() => checkPosition()}>
                    Your Position:  {Position.you != null ? `${Position.you}/${Position.all}` : "???/???"}

                </div>
            </div>


        </div >
    )

}

