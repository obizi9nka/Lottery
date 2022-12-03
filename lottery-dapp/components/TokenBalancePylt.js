const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "/blockchain/Lottery.json"
import A from "/blockchain/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useSigner,
    useConnect,
    useNetwork, useProvider
} from 'wagmi';

export default function TokensBalancePylt({ LOTTERY_ADDRESS, NFT_ADDRESS, user, rokens, chainId, settxData, deleteTokenFromFronend, setTokenSelected, TokenSelected, settokenTransfered }) {


    const [deposit, setDeposit] = useState("")
    const [parsedDeposit, setparsedDeposit] = useState("")
    const [needApprove, setneedAprove] = useState(false)

    const [isvalid, setvalid] = useState(false)

    const [placeholder, setplaceholder] = useState("Choose token")

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data


    useEffect(() => {
        if (TokenSelected != null) {
            rokens.forEach((element) => {
                if (element.address == TokenSelected.address)
                    setplaceholder(element.symbol)
            })
        }
        else
            setplaceholder("Choose token")
    }, [TokenSelected, user])




    const approve = async () => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            console.log(parsedDeposit)
            const contract = new ethers.Contract(TokenSelected.address, A.abi, signer)
            const tx = await contract.approve(LOTTERY_ADDRESS, BigInt(parsedDeposit * 10 ** 18))
            await tx.wait()
            settxData({
                isPending: false,
                result: true
            })
        } catch (err) {
            settxData({
                isPending: false,
                result: false
            })
            console.log(err)
        }

        setneedAprove(false)
    }

    const addTokensToBalance = async () => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tokenContract = new ethers.Contract(TokenSelected.address, A.abi, provider)
            const decimals = await tokenContract.decimals()
            const tx = await contract.addTokensToBalance(TokenSelected.address, BigInt(deposit * 10 ** decimals))
            await tx.wait()
            setTokenSelected(null)
            setDeposit(0)
            document.getElementById("deposit/withdraw").value = "";
            settxData({
                isPending: false,
                result: true
            })
        } catch (err) {
            console.log(err)
            settxData({
                isPending: false,
                result: false
            })
        }

    }

    useEffect(() => {
        let _deposit = ""
        try {
            for (let i = 0; i < deposit.length; i++) {
                if (deposit[i] != ",")
                    _deposit += deposit[i]
                else
                    _deposit += "."
            }

        } catch (err) {
            console.log(err)
        }

        console.log(_deposit)
        if (_deposit / 1 > 0) {
            setvalid(true)
        }
        else {
            setvalid(false)
        }
        setparsedDeposit(_deposit)
        checkApprove(_deposit)
    }, [deposit])

    const checkApprove = async (_deposit) => {
        if (TokenSelected != null)
            try {
                const tokenContract = new ethers.Contract(TokenSelected.address, A.abi, provider)
                console.log(BigInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)), BigInt(_deposit * 10 ** TokenSelected.decimals))
                if (BigInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)) < BigInt(_deposit * 10 ** TokenSelected.decimals)) {
                    setneedAprove(true)
                } else {
                    setneedAprove(false)
                }
            } catch (err) {
                console.log(err)
            }

    }

    const withdrow = async () => {
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tokenContract = new ethers.Contract(TokenSelected.address, A.abi, provider)
            let decimals = 18
            try {
                decimals = await tokenContract.decimals()
            } catch (err) {
                console.log("Net f desimals", err)
            }
            // console.log(BigInt(deposit * 10 ** decimals))
            const tx = await contract.Withdrow(TokenSelected.address, BigInt(deposit * 10 ** decimals))
            await tx.wait()
            setTokenSelected(null)
            setDeposit(0)
            document.getElementById("deposit/withdraw").value = "";
            settxData({
                isPending: false,
                result: true
            })
        } catch (err) {
            console.log(err)
            settxData({
                isPending: false,
                result: false
            })
        }
    }

    return (
        <div className="depositAndWitdrow" style={{ marginBottom: rokens.length == 0 ? "10px" : null }}>
            {!needApprove && <button onClick={addTokensToBalance} disabled={!isvalid} className="mybutton dinamic">Deposit</button>}
            {needApprove && <button onClick={approve} disabled={!isvalid} className="mybutton dinamic">Enable</button>}

            <div className='depositvalue'>
                <input className="input dinamic" id="deposit/withdraw" style={{ minWidth: "110px", color: deposit == "" ? "white" : isvalid ? "white" : "red" }} disabled={TokenSelected == null} placeholder={placeholder} onChange={e => { setDeposit(e.target.value) }} />
                {/* {(!isvalid && tryed) && <div className="invalidvalue">Invalid value</div>} */}
            </div>

            <button onClick={withdrow} disabled={!isvalid} className="mybutton dinamic withdrow">Withdraw</button>
        </div>
    )

}