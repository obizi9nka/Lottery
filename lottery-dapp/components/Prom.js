const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';


export default function Prom({ PromSet, PromInput, setPromInput, setPromSet, chainId }) {

    const [prom, setprom] = useState("")


    const [setpromSeted, setsetpromSeted] = useState(false)
    const [setpromInputed, setsetpromInputed] = useState(false)


    const [shouldrevard, setshouldrevard] = useState(0)

    useEffect(() => {
        let i = false
        let s = false
        if (PromInput != null)
            i = true
        if (PromSet != null)
            s = true
        setsetpromInputed(i)
        setsetpromSeted(s)
    })

    const setProm = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddressETH, Lottery.abi, signer)
            const tx = await contract.setPromSet(prom);
            await tx.wait()
            const _user = await signer.getAddress()
            const body = { address: _user, PromSet: prom, chainId }
            await fetch("/api/promSet", {
                method: "POST",
                body: JSON.stringify(body)
            })
            setPromSet(prom)
            setsetpromSeted(true)
            document.getElementById("Prom").value = "";
            setProm("")
        } catch (err) {
            console.log(err)
        }

    }

    const inputProm = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddressETH, Lottery.abi, signer)
            const tx = await contract.setPromInput(prom);
            await tx.wait()
            const _user = await signer.getAddress()
            console.log(_user, prom)
            const body = { address: _user, PromInput: prom, chainId }
            await fetch("/api/promInput", {
                method: "POST",
                body: JSON.stringify(body)
            })
            setsetpromInputed(true)
            setPromInput(prom)
            document.getElementById("Prom").value = "";
            setProm("")
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const chechRevard = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const address = await signer.getAddress()
                const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
                const temp = parseInt(await contract.getshouldRevard(address))
                console.log(temp)
                setshouldrevard(temp)
            } catch (err) {

            }
        }
        chechRevard()
    }, [])


    return (
        <div className="PROM">

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
                            Your Code: <strong className="colorPURPLE">{PromSet}</strong>
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
                        {"Your Code: "}<strong className="colorPURPLE">{PromSet}</strong>
                    </div>
                    <div>
                        Your will earn: <strong className="colorPURPLE">{shouldrevard} MUD</strong>
                    </div>

                </div>}
            {!setpromSeted &&
                <button onClick={setProm} className="setProm mybutton hei" >Set</button>}

        </div>
    )

}
