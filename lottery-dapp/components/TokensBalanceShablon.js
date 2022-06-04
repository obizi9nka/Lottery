const { ethers } = require("ethers");
import { useState, useEffect } from "react";
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import Image from "next/image";
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"

export default function TokensBalanceShablon(info) {

    const [balance, setbalance] = useState(0)
    const [deposit, setDeposit] = useState("null")
    const [needApprove, setneedAprove] = useState(false)

    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [isReliably, setisReliably] = useState(false)

    const [DELETED, setDELETED] = useState(false)

    const [isfaund, setisfaund] = useState(true)

    const checkBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            const decemals = new ethers.Contract(info.token, A.abi, provider)

            const temp = BigInt(await contract.getBalance(info.token, info.user))

            //console.log(info.token, temp)

            try {
                const decimals = await decemals.decimals()
                if (!isReliably)
                    localStorage.removeItem("isReliably")
                setDecimals(decimals)
            } catch (err) {
                console.log("Net f decimals", err)
                setisReliably(true)
                localStorage.setItem("isReliably", "true")
            }
            let _balance = parseInt(temp) / 10 ** (Decimals)

            //console.log("bal", _balance)

            if (_balance >= 1) {
                //console.log(">1", _balance)
                setbigBalance(_balance + ((isReliably === true) ? '*' : ""))
                //setbigBalance(temp.toString().substring(0, _balance.toString().length) + "." + temp.toString().substring(_balance.toString().length, temp.toString().length) + ((isReliably === true) ? '*' : ""))
            }
            else {
                //console.log("<1", _balance)
                setbigBalance((parseInt(temp) / 10 ** (Decimals)).toString() + ((isReliably === true) ? '*' : ""))
            }

            let str = _balance.toString()
            if (str.length > 9)
                _balance = str.substring(0, 9)
            setbalance(_balance.toString() + ((isReliably === true) ? '*' : ""))
        } catch (err) {
            console.log("checkBalance", err)
        }
    }

    const approve = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(info.token, A.abi, singer)
            const tx = await contract.approve(LotteryAddress, BigInt(11579208923731619542357098500868790785326998466564056403945758400791312963993))
            await tx.wait()
            setneedAprove(false)
        }
    }

    const addTokensToBalance = async () => {
        settryed(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
            const tokenContract = new ethers.Contract(info.token, A.abi, provider)
            const decimals = await tokenContract.decimals()

            console.log("allow", parseInt(await tokenContract.allowance(singer.getAddress(), LotteryAddress)))
            console.log(parseInt(await tokenContract.allowance(singer.getAddress(), LotteryAddress)), BigInt(deposit * 10 ** decimals))

            const tx = await contract.addTokensToBalance(info.token, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setDeposit(0)
            document.getElementById(info.token).value = "";
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        checkBalance()
    })

    useEffect(() => {
        if (deposit / 1 > 0) {
            setvalid(true)
        }
        else {
            setvalid(false)
        }
        checkApprove()
    }, [deposit])

    const checkApprove = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const tokenContract = new ethers.Contract(info.token, A.abi, provider)
            if (BigInt(await tokenContract.allowance(singer.getAddress(), LotteryAddress)) < BigInt(deposit * 10 ** Decimals)) {
                setneedAprove(true)
            } else {
                setneedAprove(false)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const deleteToken = async () => {
        const body = { address: info.user, deleteTokenAddress: info.token }
        try {
            await fetch('/api/deleteToken', {
                method: "POST",
                body: JSON.stringify(body)
            }).then(() => {
                setDELETED(true)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const withdrow = async () => {
        settryed(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
            const tokenContract = new ethers.Contract(info.token, A.abi, provider)
            let decimals = 18
            try {
                decimals = await tokenContract.decimals()
            } catch (err) {
                console.log("Net f desimals", err)
            }

            const tx = await contract.Withdrow(info.token, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setDeposit(0)
            document.getElementById(info.token).value = "";
        } catch (err) {
            console.log(err)
        }
    }

    //...{info.token.substr(41, 1)}
    if (!DELETED) {
        return (
            <div className='shablonbalance'>
                {isfaund && <Image className="tokenpng" src={`/tokens/${info.token}.png`} width={32} height={32} />}
                {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={32} height={32} />}


                <div class="balanceForToken">
                    <div class="balance"> {balance}</div>
                    <div class="balancealert">
                        {bigBalance}
                    </div>
                </div>
                <div className='depositvalue'>
                    <input className="input_min input" id={info.token} placeholder="Value" onChange={e => setDeposit(e.target.value)} />
                    {(!isvalid && tryed) && <div className="invalidvalue ">Invalid value</div>}
                </div>

                {!needApprove && <button onClick={addTokensToBalance} className="mybutton fixsizebutton">Deposit</button>}
                {needApprove && <button onClick={approve} className="mybutton fixsizebutton">Enable</button>}
                <button onClick={withdrow} className="mybutton fixsizebutton">Withdrow</button>
                <Image className="" onClick={deleteToken} src="/delete.png" width={25} height={25} />
            </div >
        )
    }

}