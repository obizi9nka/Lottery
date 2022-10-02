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


    const [balance, setbalance] = useState(0)

    const [DELETED, setDELETED] = useState(false)

    const [bigBalance, setbigBalance] = useState(0)
    const [Decimals, setDecimals] = useState(18)

    const [isfaund, setisfaund] = useState(true)

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
    }, [chainId, user, element, TokenSelected, rokens, txData])


    const checkBalance = async () => {
        try {
            try {
                let decimals, _token
                const tokenDecimalsCheck = element.address.split(".")
                const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, chainId != 31337 ? provider : providerLocal)

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
        } catch (err) {

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
        return (
            <div className="relative">
                <div className={TokenSelected == element.address ? "shablonbalanceClicked" : 'shablonbalance'} onClick={(e) => { if (element.address != TokenSelected) { setTokenSelected(element.address) } else { setTokenSelected(null) } }} >
                    <div className="tokenImage">
                        {isfaund && <Image className="tokenpng" src={`/tokens/${element.address}.png`} width={32} height={32} />}
                        {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={32} height={32} />}

                    </div>


                    <div class="balanceForToken">
                        <div class="balance"> {balance}</div>
                    </div>

                </div >
                <div className="tokenImageDElete" id="delete" >
                    <Image className=" hover" src="/delete.png" onClick={() => { deleteToken() }} width={25} height={25} />
                </div>
            </div>

        )
    }

}