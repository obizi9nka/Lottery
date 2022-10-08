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


    const [balance, setbalance] = useState(0)
    const [deposit, setDeposit] = useState("null")
    const [needApprove, setneedAprove] = useState(false)

    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [placeholder, setplaceholder] = useState("Choose token")

    const [needCheck, setneedCheck] = useState(true)

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data


    useEffect(() => {
        if (TokenSelected != null) {
            rokens.forEach((element) => {
                if (element.address == TokenSelected)
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
            const contract = new ethers.Contract(TokenSelected, A.abi, signer)
            const tx = await contract.approve(LOTTERY_ADDRESS, BigInt(deposit * 10 ** 18))
            await tx.wait()
            settxData({
                isPending: true,
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
        settryed(true)
        try {
            settxData({
                isPending: true,
                result: null
            })
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tokenContract = new ethers.Contract(TokenSelected, A.abi, chainId != 31337 ? provider : providerLocal)
            const decimals = await tokenContract.decimals()
            const tx = await contract.addTokensToBalance(TokenSelected, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setTokenSelected(null)
            setDeposit(0)
            document.getElementById(TokenSelected).value = "";
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
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const tokenContract = new ethers.Contract(TokenSelected, A.abi, chainId != 31337 ? provider : providerLocal)
            console.log(BigInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)), BigInt(deposit * 10 ** Decimals))
            if (BigInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)) < BigInt(deposit * 10 ** Decimals)) {
                setneedAprove(true)
            } else {
                setneedAprove(false)
            }
        } catch (err) {
            console.log(err)
        }

    }


    const withdrow = async () => {
        settryed(true)
        try {
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tokenContract = new ethers.Contract(TokenSelected, A.abi, provider)
            let decimals = 18
            try {
                decimals = await tokenContract.decimals()
            } catch (err) {
                console.log("Net f desimals", err)
            }
            // console.log(BigInt(deposit * 10 ** decimals))
            const tx = await contract.Withdrow(TokenSelected, BigInt(deposit * 10 ** decimals))
            settryed(false)
            await tx.wait()
            setTokenSelected(null)
            setDeposit(0)
            document.getElementById(TokenSelected).value = "";
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
        <div className="depositAndWitdrow">
            {!needApprove && <button onClick={addTokensToBalance} className="mybutton dinamic">Deposit</button>}
            {needApprove && <button onClick={approve} className="mybutton dinamic">Enable</button>}

            <div className='depositvalue'>
                <input className="input dinamic" style={{ minWidth: "110px" }} disabled={TokenSelected == null} id={TokenSelected} placeholder={placeholder} onChange={e => setDeposit(e.target.value)} />
                {(!isvalid && tryed) && <div className="invalidvalue ">Invalid value</div>}
            </div>

            <button onClick={withdrow} className="mybutton dinamic">Withdrow</button>
        </div>
    )

}