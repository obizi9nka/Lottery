const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")

export default function MintNftButton({ chainId }) {

    const [arrayAllowToMint, setarrayAllowToMint] = useState([])
    const [Discord, setDiscord] = useState("")

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
        try {
            let provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const contractM = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            contract.once("play", async (winer) => {
                getAllows()
            })
            contractM.once("NewNFT", async (user, id) => {
                getAllows()
            })
        } catch (err) {
        }
    }, [])

    useEffect(() => {
        if (chainId > 0)
            getAllows()
    }, [user, chainId])

    const getAllows = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const lottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
                const nft = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
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
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, singer)
            const tx = await contract.MintMarten(element, {
                value: BigInt(32 * 10 ** 15)
            })
            await tx.wait()

            // const body = {
            //     address: await singer.getAddress(), Discord: `{${element}}` + Discord
            // }

            // await fetch("/api/discord", {
            //     method: "POST",
            //     body: JSON.stringify(body)
            // })
        } catch (err) {
            console.log(err)
        }
        if (arrayAllowToMint.length == 1) {
            localStorage.removeItem("overflow")
            document.body.style.overflow = ('overflow', 'auto');
        }
        getAllows()
    }

    const validateDiscord = (nikename) => {
        if (nikename.indexOf("@") == 0) {
            setDiscord(nikename)
        }
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
                    <div className='space-around'>
                        {arrayAllowToMint && arrayAllowToMint.map(element =>
                            <div className='MINT'>
                                <Image src={`/images/${element}.png`} style={{ "border-radius": 10 }} width={350} height={350} /><br />
                                <button className='mybutton' onClick={() => { MintMarten(element) }}>Mint{element}</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className='back' />
            </div>

        </div>
    )
}