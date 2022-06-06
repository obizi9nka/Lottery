import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import metadata from "C:/Lottery/nfts/hashlips_art_engine/build/json/_metadata.json"
import NftsShablon from '../components/NftsShablon'

export default function Home() {

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [TokenId, setTokenId] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)

    const [user, setuser] = useState('')

    const [NFTS, setNFTS] = useState(metadata)

    const [tokensOfUser, settokensOfUser] = useState([])
    const [tokensMints, settokensMints] = useState([])
    const [ALL_OR_MINTS, setALL_OR_MINTS] = useState(false)

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch {
            console.log("Connect Wallet")
        }
    }
    setUser()


    useEffect(() => {
        const temp = NFTS.filter((element, index) => {
            return index < 100
        })
        setNFTS(temp)
        gettokensMints()
    }, [])

    useEffect(() => {
        getTokensForUser()
    }, [user])


    const getTokensForUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
            const tx = await contract.getTokensForAddress(singer.getAddress())
            const temp = tx.ids.map(element => {
                return (parseInt(element))
            });
            settokensOfUser(temp)
        } catch (err) {

        }

    }

    const gettokensMints = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
        const tx = await contract.gettokensMints()
        let temp = tx.map(element => {
            return (parseInt(element))
        });
        temp.sort((a, b) => {
            return a - b
        })
        temp = tx.map(element => {
            return (metadata[element - 1])
        });
        settokensMints(temp)
        console.log(temp)
    }


    const isOWNER = (index) => {
        let flag = false
        tokensOfUser.forEach(element => {
            if (element == index)
                flag = true
        });
        return flag
    }



    return (
        <div className='some-padding'>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='titel'>!Mudebz NFTS</h1>
            <div className='UpAndDown'>
                <label className="switch">
                    <input type="checkbox" onChange={() => setALL_OR_MINTS(!ALL_OR_MINTS)} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div>

                {!ALL_OR_MINTS && NFTS.map((element) => < NftsShablon data={element} isowner={isOWNER(element.edition)} />)}
                {ALL_OR_MINTS && tokensMints.map((element) => < NftsShablon data={element} isowner={isOWNER(element.edition)} />)}
            </div>



        </div>
    )
}
