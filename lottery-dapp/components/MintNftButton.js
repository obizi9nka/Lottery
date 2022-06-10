const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"


export default function MintNftButton() {


    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [arrayAllowToMint, setarrayAllowToMint] = useState([])
    const [discord, setdiscord] = useState("")

    const [user, setuser] = useState("")

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch (err) {
            setuser('')
            console.log(err)
        }
    }
    setUser()

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        const contractM = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
        contract.once("play", async (winer) => {
            getAllows()
        })
        contractM.once("NewNFT", async (user, id) => {
            getAllows()
        })
    }, [])

    useEffect(() => {
        getAllows()
    }, [user])

    const getAllows = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
                const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
                const wins = await lottery._allowToNFT(user)
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
                const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
                const tx = await contract.MintMarten(element, {
                    value: BigInt(32 * 10 ** 15)
                })
                await tx.wait()
            }
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
            <button className={isMintMartenActive ? "nftmintbuttonactive" : "MINTnav mybutton"} onClick={() => {
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
            } >MintNFT</button>
            <div className={isMintMartenActive ? "modallMINT active" : "modallMINT"} onClick={() => setisMintMartenActive(false)}>
                <div className="areaMINT" onClick={e => e.stopPropagation()}>
                    <input className='input discord' placeholder='Discord' onChange={e => setdiscord(e.target.value)} />
                    <div className='space-around'>
                        {arrayAllowToMint && arrayAllowToMint.map(element =>
                            <div className='MINT'>
                                <Image src={`/images/${element}.png`} width={350} height={350} /><br />
                                <button className='mybutton' onClick={() => MintMarten(element)}>Mint{element}</button>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}