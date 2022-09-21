const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")
import Loader from "react-spinners/HashLoader";


import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useContractRead,
    useProvider,
    useSigner,
    useConnect,
    useNetwork
} from 'wagmi';


export default function InfoPopUp({ data, settxData }) {

    const [mode, setMode] = useState()
    const [active, setActive] = useState(false)

    useEffect(() => {
        if (data.isPending != null || data.result != null) {
            setActive(true)
        }
        if (data.isPending != null && data.result == true) {
            setTimeout(() => {
                setActive(false)
            }, 6000)
            setTimeout(() => {
                settxData({
                    isPending: null,
                    result: null
                })
            }, 7000);
        }

    }, [data])

    const info = () => {
        settxData({
            isPending: null,
            result: null
        })
        setActive(false)
    }

    // const data = {
    //     isPending: true,
    //     result: null
    // }

    // if (data.isPending != null || data.result != null) {
    return (
        <div className={active ? 'InfoPopUp active' : "InfoPopUp"}>
            <div className={'LOADER active'}>
                {data.isPending && data.result == null ? <Loader loading={true} color={"white"} size={35} /> : data.result ? <Image src="/succses.png" width={35} height={35} /> : data.result == false ? <Image src="/wrong.png" onClick={() => info()} width={35} height={35} /> : <div />}
                {/* {mode == 1 && <Loader loading={true} color={"white"} size={35} />}
                {mode == 2 && <Image src="/succses.png" width={35} height={35} />}
                {mode == 3 && <Image src="/wrong.png" width={35} height={35} />} */}
            </div>
        </div>
    )
    // }

}

{/* <div className='status'>
                <div className='TracsactionStatus'>
                    {data.isPending ? "Pending" : data.result ? "Complite" : "Canceled"}
                </div>

            </div> */}