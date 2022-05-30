const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MudeBzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import Image from 'next/image';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"


export default function MintNftButton() {

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [arrayAllowToMint, setarrayAllowToMint] = useState([])

    useEffect(() => {
        getAllows()
    }, [])

    const getAllows = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
                const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
                const USER = await signer.getAddress()
                const wins = await lottery._allowToNFT(USER)
                const array = []
                for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                    if (!await nft.istokenMints(wins.lotteryes[i])) {
                        array.push(parseInt(wins.lotteryes[i], 10))
                    }
                }
                setarrayAllowToMint(array)

            }
        } catch (err) {
            console.log(err)
        }
    }

    const [TokenId, setTokenId] = useState(1)
    const [isMintMartenActive, setisMintMartenActive] = useState(false)


    const MintMarten = async (element) => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const singer = provider.getSigner()
                const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, singer)
                const tx = await contract.MintMarten(element, {
                    value: 32
                })
                await tx.wait()
                window.location.reload()
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <button className={isMintMartenActive ? "nftmint" : "mybutton"} onClick={() => {
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
            } >MintMarten</button>
            <div className={isMintMartenActive ? "modallMINT active" : "modallMINT"} onClick={() => setisMintMartenActive(false)}>
                <div className="areaMINT" onClick={e => e.stopPropagation()}>
                    <div className='space-around'>
                        {arrayAllowToMint && arrayAllowToMint.map(element =>
                            <div className='MINT'>
                                <Image src={`/images/${element % 5 === 0 ? element % 5 + 1 : element % 5}.png`} width={200} height={200} /><br />
                                <button className='mybutton' onClick={() => MintMarten(element)}>Mint</button>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}