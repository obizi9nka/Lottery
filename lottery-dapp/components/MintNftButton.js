const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Lottery from "/blockchain/Lottery.json"
import MudebzNFT from "/blockchain/MudebzNFT.json"
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
    useContractRead,
    useProvider,
    useSigner,
    useConnect,
    useNetwork
} from 'wagmi';


export default function MintNftButton({ LOTTERY_ADDRESS, NFT_ADDRESS, chainId, address, settxData, daloyNFTbutton, setdaloyNFTbutton }) {

    const [arrayAllowToMint, setarrayAllowToMint] = useState([])
    const provider = useProvider()
    const { data } = useSigner()
    const signer = data
    const [isMintMartenActive, setisMintMartenActive] = useState(false)
    const [index, setindex] = useState(0)

    useEffect(() => {
        getAllows()
    }, [address, chainId, LOTTERY_ADDRESS, NFT_ADDRESS])

    const getAllows = async () => {
        try {
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const lottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, chainId != 31337 ? provider : providerLocal)
            const nft = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, chainId != 31337 ? provider : providerLocal)
            // const lottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, chainId != 31337 ? provider : providerLocal)
            // const nft = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, chainId != 31337 ? provider : providerLocal)
            const wins = await lottery._allowToNFT(address)
            console.log(wins.lotteryes)
            const array = []
            for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                if (!await nft.istokenMints(wins.lotteryes[i])) {
                    array.push(parseInt(wins.lotteryes[i]))
                }
            }
            setarrayAllowToMint(array)
        } catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        if (daloyNFTbutton) {
            setisMintMartenActive(false)
            setdaloyNFTbutton(false)
            localStorage.removeItem("overflow")
            document.body.style.overflow = ('overflow', 'auto');
        }
    }, [daloyNFTbutton])

    const MintMarten = async (element) => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, signer)
            const tx = await contract.MintMarten(element, {
                value: BigInt(32 * 10 ** 15)
            })
            await tx.wait()
            const body = { tokenId: element, chainId, isMinted: true }
            await fetch('/api/update1000', {
                method: "POST",
                body: JSON.stringify(body)
            })
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
        setindex(0)
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
                    <div className='imageWithArrow'>
                        <div className="arow DEG180" style={{ margin: "0px 30px" }} onClick={() => { if (index != 0) { setindex(parseInt(index) - 1) } }}>
                            <Image src={"/rigth.png"} width={30} height={30} />
                        </div>
                        <div className='MINT'>
                            <Image src={`/imagesETH/${arrayAllowToMint[index]}.png`} style={{ "border-radius": 12 }} width={350} height={350} /><br />
                        </div>
                        <div className="arow" style={{ margin: "0px 30px" }} onClick={() => { if (index != arrayAllowToMint.length - 1) { setindex(parseInt(index) + 1) } }}>
                            <Image src={"/rigth.png"} width={30} height={30} />
                        </div>
                    </div>
                    <div className='MINT'>
                        <button className='mybutton Mint' style={{ margin: "20px" }} onClick={() => { MintMarten(arrayAllowToMint[index]) }}>Mint</button>
                    </div>
                </div>
            </div>

        </div>
    )
}