const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "/blockchain/Lottery.json"
import Image from "next/image";
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

export default function TokensBalanceShablon({ LOTTERY_ADDRESS, txData, user, element, rokens, chainId, setisReliably, deleteTokenFromFronend, setTokenSelected, TokenSelected, settxData, needCheck }) {


    const [balance, setbalance] = useState(-1)

    const [DELETED, setDELETED] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [isfaund, setisfaund] = useState(element.isImageAdded)


    const provider = useProvider()
    const { data } = useSigner()
    const signer = data


    useEffect(() => {
        if (element.balance == undefined || TokenSelected == element.address || txData.result) {
            checkBalance()
        }
        else {
            setbalance(element.balance)
        }
        setisfaund(element.isImageAdded)
    }, [chainId, user, element, TokenSelected, rokens, txData])


    const checkBalance = async () => {
        try {
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, chainId != 31337 ? provider : providerLocal)

            const temp = BigInt(await contract.getBalance(element.address, user))
            console.log(temp, element)
            let _balance = parseInt(BigInt(temp) / BigInt(10 ** parseInt(element.decimals)))

            element.balance = _balance.toString()
            setbalance(_balance)
        } catch (err) {
            console.log("checkBalance", err)
            setbalance(0)
            element.balance = "0"
        }
    }

    const deleteToken = async () => {
        const body = { address: user, deleteTokenAddress: element.address, chainId }
        try {
            await fetch('/api/deleteToken', {
                method: "POST",
                body: JSON.stringify(body)
            }).then(() => {
                console.log("DDDDDDDDDDDDDDDF")
                setDELETED(true)
                deleteTokenFromFronend(element.address)
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (!DELETED) {
        if (element.address != 0 && balance != -1)
            return (
                <div className="relative">
                    <div className={TokenSelected == element.address ? "shablonbalanceClicked" : 'shablonbalance'} onClick={(e) => { if (element.address != TokenSelected) { setTokenSelected(element.address) } else { setTokenSelected(null) } }} >
                        <div className="tokenImage">
                            {isfaund && <Image className="tokenpng" src={`/tokens/${element.address}.png`} width={32} height={32} />}
                            {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={32} height={32} />}

                        </div>


                        <div class="balanceForToken">
                            <div class="balance"> {balance} {!isfaund ? element.symbol : null}</div>
                        </div>

                    </div >
                    <div className="tokenImageDElete" id="delete" >
                        <Image className=" hover" src="/delete.png" onClick={() => { deleteToken() }} width={25} height={25} />
                    </div>
                </div>

            )
        else
            return (
                <div className="shablonbalance">

                </div>
            )
    }

}