const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "/blockchain/Lottery.json"
import Image from "next/image";
import A from "/blockchain/A.json"
import { USDT_ETH } from './Constants';
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

export default function TokensBalanceShablon({ LOTTERY_ADDRESS, txData, user, element, rokens, chainId, index, deleteTokenFromFronend, setTokenSelected, TokenSelected, settxData, needCheck }) {


    const [balance, setbalance] = useState(-1)

    const [DELETED, setDELETED] = useState(false)

    const [isfaund, setisfaund] = useState(element.isImageAdded)
    const [needApprove, setneedAprove] = useState(undefined)
    const { data } = useSigner()

    const provider = useProvider()

    useEffect(() => {
        checkApprove()
    }, [element, user])


    const approve = async () => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            const contract = new ethers.Contract(element.address, A.abi, data)
            const tx = await contract.approve(LOTTERY_ADDRESS, BigInt(1000 * 10 ** 18))
            await tx.wait()
            settxData({
                isPending: false,
                result: true
            })
            setneedAprove(false)
        } catch (err) {
            settxData({
                isPending: false,
                result: false
            })
            console.log(err)
        }

    }

    const checkApprove = async () => {
        try {
            const tokenContract = new ethers.Contract(element.address, A.abi, provider)
            if (BigInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)) == 0) {
                setneedAprove(true)
            } else {
                setneedAprove(false)
            }
            console.log(parseInt(await tokenContract.allowance(user, LOTTERY_ADDRESS)))
        } catch (err) {
            console.log(err)
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
        if (element.address != 0)
            return (
                <div className="relative">
                    <div className={'shablonbalance'}
                        style={{ margin: index.last == index.index ? "" : index.index == 0 ? "0px 0px 10px 0px" : index.last == index.index ? "10px 0px 0px 0px" : "10px 0px 10px 0px" }} >
                        <div className="tokenImage">
                            {element.isImageAdded && <Image className="tokenpng" src={`/tokens/${element.address}.png`} width={32} height={32} />}
                            {!element.isImageAdded && <Image className="tokenpng" src="/questionMark.png" width={32} height={32} />}
                        </div>
                        {needApprove != undefined && <div className="approveArea">
                            {needApprove ?
                                <div>
                                    <button className="Approve" onClick={() => approve()}>Approve</button>
                                </div>
                                :
                                <div className="approved">
                                    Approved
                                </div>
                            }
                        </div>}
                        <div></div>
                        {/* <div class="balanceForToken">
                            <div class="balance"> {balance} {!isfaund ? element.symbol : null}</div>
                        </div> */}
                    </div >
                    {element.address != USDT_ETH && < div className="tokenImageDElete" id="delete" >
                        <Image className=" hover" src="/delete.png" onClick={() => { deleteToken() }} width={25} height={25} />
                    </div>}
                </div >

            )
        else
            return (
                <div className="shablonbalance" style={{ margin: index.last == index.index ? "" : index.index == 0 ? "0px 0px 10px 0px" : index.last == index.index ? "10px 0px 0px 0px" : "10px 0px 10px 0px" }}>

                </div>
            )
    }

}