const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import Image from "next/image";
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
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

export default function TokensBalanceShablon({ user, element, chainId, setisReliably, deleteTokenFromFronend, setTokenSelected, TokenSelected, settxData, settokenTransfered }) {


    const [balance, setbalance] = useState(0)

    const [DELETED, setDELETED] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [isfaund, setisfaund] = useState(true)

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data


    useEffect(() => {
        checkBalance()
    }, [chainId, user, element, TokenSelected])


    const checkBalance = async () => {
        if (element.balance == undefined) {
            try {
                let decimals, _token
                const tokenDecimalsCheck = element.address.split(".")
                const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : (chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB), Lottery.abi, chainId != 31337 ? provider : providerLocal)

                if (tokenDecimalsCheck == element.address) {
                    const decemals = new ethers.Contract(element.address, A.abi, chainId != 31337 ? provider : providerLocal)
                    decimals = await decemals.decimals()
                    _token = element.address

                } else {
                    decimals = tokenDecimalsCheck[1]
                    _token = tokenDecimalsCheck[0]
                    setisReliably(false)
                }
                const temp = BigInt(await contract.getBalance(_token, user))

                setDecimals(decimals)
                let _balance = (parseInt(temp) / 10 ** (decimals)).toString() + (tokenDecimalsCheck == element.address ? '' : "*")
                setbigBalance(_balance)
                let str = _balance.toString()
                if (str.length > 8)
                    _balance = str.substring(0, 8)
                setbalance(_balance.toString())
                element.balance = _balance.toString()
            } catch (err) {
                console.log("checkBalance", err)
            }
        }
        else
            setbalance(element.balance)
    }


    const deleteToken = async () => {
        const body = { address: user, deleteTokenAddress: element.address, chainId }
        try {
            await fetch('/api/deleteToken', {
                method: "POST",
                body: JSON.stringify(body)
            }).then(() => {
                setDELETED(true)
                deleteTokenFromFronend(element.address)
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (!DELETED) {
        return (
            <div className={TokenSelected == element.address ? "shablonbalanceClicked" : 'shablonbalance'} onClick={(e) => { if (element.address != TokenSelected) { setTokenSelected(element.address) } else { setTokenSelected(null) } }} >
                <div className="tokenImage">
                    {isfaund && <Image className="tokenpng" src={`/tokens/${element.address}.png`} width={32} height={32} />}
                    {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={32} height={32} />}

                </div>


                <div class="balanceForToken">
                    <div class="balance"> {balance}</div>
                </div>
                <div className="tokenImage" id="delete" >
                    <Image className=" hover" src="/delete.png" onClick={() => { deleteToken() }} width={25} height={25} />
                </div>
            </div >
        )
    }

}