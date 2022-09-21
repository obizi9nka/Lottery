const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
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

export default function Prom({ address, PromSet, PromInput, setPromInput, setPromSet, chainId, tymblerNaNetwork, settxData }) {

    const [prom, setprom] = useState("")

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data

    const [shouldrevard, setshouldrevard] = useState(0)
    const [Position, setPosition] = useState({})

    const setProm = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, signer)
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


            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, signer)
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

    const chechRevard = async () => {
        try {
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, chainId != 31337 ? provider : providerLocal)
            const temp = parseInt(await contract.getshouldRevard(address))
            const r = parseInt(await contract.getcountOfLotteryEnter(address))
            console.log(temp, r)
            const t = {
                count: temp,
                isEnteredOnce: r
            }
            setshouldrevard(t)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        chechRevard()
        setPosition({})
    }, [address, chainId])

    const checkPosition = async () => {
        const body = { chainId }
        await fetch('/api/getAllusers', {
            method: "POST",
            body: JSON.stringify(body)
        }).then(async (data) => {
            const temp = await data.json()
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, chainId != 31337 ? provider : providerLocal)
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



    return (
        <div className="PROM">
            <div className={PromInput == null || PromSet == null ? 'PromButtons' : "NoButtons"}>
                <div>
                    {PromSet == null &&
                        <button onClick={() => { if (prom.length > 0) setProm() }} className="setProm mybutton hei" >Set your code</button>}
                    {PromSet != null &&
                        <div className='Promocode' style={{ color: "purple", height: ((PromInput != null && PromSet != null) ? "80px" : null) }}>{PromSet}</div>}
                </div>

                {(PromInput == null || PromSet == null) &&
                    <input className="input hei" id="Prom" placeholder="Enter promo code" onChange={e => setprom(e.target.value)} />
                }
                <div>
                    {PromInput == null &&
                        <button onClick={() => { if (prom.length > 0) inputProm() }} className="inputProm mybutton hei" >Enter the code</button>}
                    {PromInput != null &&
                        <div className='Promocode' style={{ color: "aqua", height: (PromInput != null && PromSet != null ? "80px" : null), borderTop: (PromInput != null && PromSet != null ? "3px solid rgb(41 39 39)" : null) }}>{PromInput}</div>}
                </div>
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
                {/* <Image src={'/tokens/0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9.png'} width={30} height={30} /> */}

            </div>


        </div>
    )

}

{/* 
            {setpromInputed && !setpromSeted &&
                <div className="promseted">
                    <div>
                        {"Your Enter: "}<strong className="colorPURPLE">{PromInput}</strong>
                    </div>
                    <div>
                        Your will earn: <strong className="colorPURPLE">{shouldrevard} MUD</strong>
                    </div>

                </div>}
            {!setpromInputed &&
                <button onClick={inputProm} className="inputProm mybutton hei" >Input</button>}


            {setpromSeted && setpromInputed &&
                <div className='bothpromset'>
                    <div className='proms'>
                        <div>
                            You Enter: <strong className="colorPURPLE">{PromInput}</strong>
                        </div>
                        <div>
                            Your Code: <strong className="colorPURPLE">{(PromSet == null)}</strong>
                        </div>



                    </div>
                    <div className='earnProm'>
                        Your will earn: <strong className="colorPURPLE">{shouldrevard} MUD</strong>
                    </div>
                </div>

            }

            {(!setpromInputed || !setpromSeted) &&
                <input className="input hei" id="Prom" placeholder="Promocode" onChange={e => setprom(e.target.value)} />
            }


            {setpromSeted && !setpromInputed &&
                <div className="promseted">
                    <div>
                        {"Your Code: "}<strong className="colorPURPLE">{(PromSet == null)}</strong>
                    </div>
                    <div>
                        Your will earn: <strong className="colorPURPLE">{shouldrevard} MUD</strong>
                    </div>

                </div>}
            {!setpromSeted &&
                <button onClick={setProm} className="setProm mybutton hei" >Set</button>} */}