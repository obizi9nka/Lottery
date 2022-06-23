const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import Image from "next/image";
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';

export default function TokensBalanceShablon({ user, token, chainId, setisReliably }) {


    const [balance, setbalance] = useState(0)
    const [deposit, setDeposit] = useState("null")
    const [needApprove, setneedAprove] = useState(false)

    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [DELETED, setDELETED] = useState(false)

    const [isfaund, setisfaund] = useState(true)


    const checkBalance = async () => {
        try {
            // console.log(token, chainId, user)
            let decimals, _token
            const tokenDecimalsCheck = token.split(".")
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, provider)

            if (tokenDecimalsCheck == token) {
                const decemals = new ethers.Contract(token, A.abi, provider)
                decimals = await decemals.decimals()
                _token = token

            } else {
                decimals = tokenDecimalsCheck[1]
                _token = tokenDecimalsCheck[0]
                setisReliably(false)
            }


            const temp = BigInt(await contract.getBalance(_token, user))

            // try {


            setDecimals(decimals)
            // } catch (err) {
            //     setisReliably(true)
            //     //localStorage.setItem("isReliably", "true")
            // }
            let _balance = (parseInt(temp) / 10 ** (decimals)).toString() + (tokenDecimalsCheck == token ? '' : "*")
            setbigBalance(_balance)

            // if (_balance >= 1) {
            //     setbigBalance(_balance)
            // }
            // else {
            //     setbigBalance((parseInt(temp) / 10 ** (decimals)).toString() + (tokenDecimalsCheck == token ? '' : "*"))
            // }

            let str = _balance.toString()
            if (str.length > 8)
                _balance = str.substring(0, 8)
            setbalance(_balance.toString())
        } catch (err) {
            console.log("checkBalance", err)
        }
    }

    const approve = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(token, A.abi, singer)
            const tx = await contract.approve(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), BigInt(11579208923731619542357098500868790785326998466564056403945758400791312963993))
            await tx.wait()
            setneedAprove(false)
        }
    }

    const addTokensToBalance = async () => {
        settryed(true)
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, singer)
            const tokenContract = new ethers.Contract(token, A.abi, provider)
            const decimals = await tokenContract.decimals()

            //console.log("allow", parseInt(await tokenContract.allowance(singer.getAddress(), chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB))))
            //console.log(parseInt(await tokenContract.allowance(singer.getAddress(), chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB))), BigInt(deposit * 10 ** decimals))

            const tx = await contract.addTokensToBalance(token, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setDeposit(0)
            document.getElementById(token).value = "";
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
            const tokenContract = new ethers.Contract(token, A.abi, provider)
            if (BigInt(await tokenContract.allowance(singer.getAddress(), LotteryAddressETH)) < BigInt(deposit * 10 ** Decimals)) {
                setneedAprove(true)
            } else {
                setneedAprove(false)
            }
        } catch (err) {
            console.log(err)
        }

    }

    const deleteToken = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const net = await provider.getNetwork()
        const body = { address: user, deleteTokenAddress: token, chainId: net.chainId }
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
            const contract = new ethers.Contract(LotteryAddressETH, Lottery.abi, singer)
            const tokenContract = new ethers.Contract(token, A.abi, provider)
            let decimals = 18
            try {
                decimals = await tokenContract.decimals()
            } catch (err) {
                console.log("Net f desimals", err)
            }
            //console.log(BigInt(deposit * 10 ** decimals))
            const tx = await contract.Withdrow(token, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setDeposit(0)
            document.getElementById(token).value = "";
        } catch (err) {
            console.log(err)
        }
    }

    if (!DELETED) {
        return (
            <div className='shablonbalance'>
                {isfaund && <Image className="tokenpng" src={`/tokens/${token}.png`} width={32} height={32} />}
                {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={32} height={32} />}


                <div class="balanceForToken">
                    <div class="balance"> {balance}</div>
                    <div class="balancealert">
                        {bigBalance}
                    </div>
                </div>
                <div className='depositvalue'>
                    <input className="input_min input" id={token} placeholder="Value" onChange={e => setDeposit(e.target.value)} />
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