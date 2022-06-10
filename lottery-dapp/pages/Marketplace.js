import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import metadata from "C:/Lottery/nfts/hashlips_art_engine/build/json/_metadata.json"
import NftsShablon from '../components/NftsShablon'

export async function getServerSideProps() {
    let isMINTS = []
    let list = []
    try {
        const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
        const tx = await contract.gettokensMints()
        list = tx.map(element => {
            return (parseInt(element))
        });
        list.sort((a, b) => {
            return a - b
        })
        list = list.map(element => {
            return (metadata[element - 1])
        });
        for (let i = 0, j = 0; i < 1001; i++) {
            if (list[j].edition === i) {
                isMINTS.push(true)
                j++
            }
            else
                isMINTS.push(false)
        }
    } catch (err) {
        console.log(err)
    }
    const body = { list, isMINTS }
    return {
        props: {
            MINTS: body
        }
    }
}

export default function Home({ MINTS }) {

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [TokenId, setTokenId] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)

    const [user, setuser] = useState('')

    const [NFTS, setNFTS] = useState(metadata)

    const [tokensOfUser, settokensOfUser] = useState([])
    const [tokensMints, settokensMints] = useState(MINTS.list)
    const [tokensMintsBOOL, settokensMintsBOOL] = useState(MINTS.isMINTS)
    const [ALL_OR_MINTS, setALL_OR_MINTS] = useState(false)

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch {
            console.log("Connect Wallet")
            setuser("")
            settokensOfUser([])
        }
    }

    useEffect(() => {
        window.ethereum.on("accountsChanged", (data) => {
            setUser()
            getTokensForUser()
        });
    }, [])

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        const contractM = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)

        contract.once("play", async (winer) => {
            getTokensForUser()
        })
        contractM.once("NewNFT", async (user, id) => {
            getTokensForUser()
        })
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

    const isOWNER = (index) => {
        let flag = false
        tokensOfUser.forEach(element => {
            if (element == index)
                flag = true
        });
        return flag
    }





    const [startIndex, setstartIndex] = useState(1)
    const [countOfRenderNfts, setcountOfRenderNfts] = useState(25)

    const IStokensMints = (index) => {
        if (tokensMintsBOOL.length > 0 && tokensMintsBOOL[index]) {
            return true
        }
        return false
    }

    useEffect(() => {
        const temp = localStorage.getItem("ENOUGTH")
        if (temp > 0) {
            setcountOfRenderNfts(temp)
            document.getElementById("enougth").value = temp;
        }

    }, [])

    const changeState = (isup) => {
        window.scrollTo(0, 0)
        if (isup) {
            const first = parseInt(countOfRenderNfts) + parseInt(startIndex)
            if (first < metadata.length)
                setstartIndex(first)
        }
        else {
            const first = parseInt(startIndex) - parseInt(countOfRenderNfts)
            if (first > 0)
                setstartIndex(first)
            else
                setstartIndex(1)
        }

    }

    const isEnogth = (index) => {
        return (index >= startIndex && index < parseInt(countOfRenderNfts) + parseInt(startIndex))
    }

    const filter = (search) => {
        if (search === '') {
            setNFTS(metadata)
        } else {
            const temp = []
            metadata.map((element) => {
                if (`${element.edition}`.indexOf(search) !== -1)
                    temp.push(element)
            })
            setNFTS(temp)
        }
    }

    return (
        <div className='areaNfts'>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <h1 className='titel'>!Mudebz NFTS</h1>
            <div className='areaFiter'>
                <div className='fiter'>
                    <div className='anotherShit'>
                        <input className='input' style={{ width: 90 }} placeholder='Search' onChange={e => { filter(e.target.value) }} />
                        <select className="choosetoken" id="enougth" onClick={(e) => { localStorage.setItem("ENOUGTH", e.target.value); setcountOfRenderNfts(e.target.value) }}>
                            <option>25</option>
                            <option>100</option>
                            <option>250</option>
                            <option>1000</option>
                        </select>
                        <label className="switch zx">
                            <input type="checkbox" onChange={() => setALL_OR_MINTS(!ALL_OR_MINTS)} />
                            <span className={!ALL_OR_MINTS ? "slider round" : "sliderGREEN round"}></span>
                        </label>
                    </div>
                    <div className='BackNext'>
                        <button className='mybutton' onClick={() => changeState(false)}>Back</button>
                        <button className='mybutton' onClick={() => changeState(true)}>Next</button>
                    </div>
                </div>
            </div>

            <div className='data'>
                {NFTS.length == 0 &&
                    <h1 className='titel' style={{ padding: " 30px 39.7vw 0px 39.7vw" }} >Empty</h1>}

                {!ALL_OR_MINTS && NFTS.map((element, index) => isEnogth(index + 1) && < NftsShablon data={element} isowner={isOWNER(element.edition)} istokensMints={IStokensMints(element.edition)} />)}
                {ALL_OR_MINTS && tokensMints.map((element, index) => isEnogth(index + 1) && < NftsShablon data={element} isowner={isOWNER(element.edition)} istokensMints={IStokensMints(element.edition)} />)}

            </div>
            <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>
                    <button className='mybutton' onClick={() => changeState(false)}>Back</button>
                    <button className='mybutton' onClick={() => changeState(true)}>Next</button>
                </div>

            </div>


        </div>
    )
}
