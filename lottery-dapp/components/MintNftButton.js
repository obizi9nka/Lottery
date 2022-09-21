const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")

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


export default function MintNftButton({ chainId, address, settxData }) {

    const [arrayAllowToMint, setarrayAllowToMint] = useState([])

    // useEffect(() => {
    //     try {
    //         let provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
    //         const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
    //         const contractM = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
    //         contract.once("play", async (winer) => {
    //             getAllows()
    //         })
    //         contractM.once("NewNFT", async (user, id) => {
    //             getAllows()
    //         })
    //     } catch (err) {
    //     }
    // }, [])

    useEffect(() => {
        if (chainId > 0)
            getAllows()
    }, [address, chainId])

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data

    const getAllows = async () => {
        try {
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const lottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, chainId != 31337 ? provider : providerLocal)
            const nft = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, chainId != 31337 ? provider : providerLocal)
            const wins = await lottery._allowToNFT(address)
            const array = []
            for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                if (!await nft.istokenMints(wins.lotteryes[i])) {
                    array.push(parseInt(wins.lotteryes[i], 10))
                }
            }
            console.log(wins)
            setarrayAllowToMint(array)
        } catch (err) {
            console.log(err)
        }
    }

    const [isMintMartenActive, setisMintMartenActive] = useState(false)

    const MintMarten = async (element) => {
        try {
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, signer)
            const tx = await contract.MintMarten(element, {
                value: BigInt(32 * 10 ** 15)
            })
            await tx.wait()

        } catch (err) {
            console.log(err)
        }
        if (arrayAllowToMint.length == 1) {
            localStorage.removeItem("overflow")
            document.body.style.overflow = ('overflow', 'auto');
        }
        getAllows()
    }

    return (
        <div>
            <button className={isMintMartenActive ? "pulse active " : "pulse"} onClick={() => {
                window.scrollTo(0, 0)
                if (!isMintMartenActive) {
                    localStorage.setItem("overflow", "lock")
                    document.body.style.overflow = ('overflow', 'hidden');
                }
                else {
                    localStorage.removeItem("overflow")
                    document.body.style.overflow = ('overflow', 'auto');
                }

                setisMintMartenActive(!isMintMartenActive)

            }
            } >NFT</button>
            <div className={isMintMartenActive ? "modallMINT active" : "modallMINT"} onClick={() => setisMintMartenActive(false)}>
                <div className="areaMINT" onClick={e => e.stopPropagation()}>
                    <div className='space-around'>
                        {arrayAllowToMint && arrayAllowToMint.map(element =>
                            <div className='MINT'>
                                <Image src={`/images/${element}.png`} style={{ "border-radius": 10 }} width={350} height={350} /><br />
                                <button className='mybutton Mint' onClick={() => { MintMarten(element) }}>Mint{element}</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='back' />
            </div>

        </div>
    )
}