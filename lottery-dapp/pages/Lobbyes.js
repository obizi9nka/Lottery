import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "/blockchain/Lottery.json"
import { PrismaClient } from '@prisma/client';
import Filter from '../components/Filter';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import A from "/blockchain/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB, ETHid, BNBid, LocalhostId, PRODACTION } from '../components/Constants';
import notForYourEyesBitch from "../notForYourEyesBitch.json"
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    usePrepareContractWritde,
    useConnect,
    useNetwork, useProvider, useSigner
} from 'wagmi';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const prisma = new PrismaClient();


export async function getServerSideProps() {
    let lobbyETH = await prisma.lobbyETH.findMany()
    let lobbyBNB = await prisma.lobbyBNB.findMany()

    if (lobbyETH != [])
        lobbyETH = lobbyETH.map((element) => {
            return {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                players: element.players,
                IERC20: element.IERC20,
                countOfPlayers: element.countOfPlayers,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2))
            }
        })
    if (lobbyBNB != [])
        lobbyBNB = lobbyBNB.map((element) => {
            return {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                players: element.players,
                countOfPlayers: element.countOfPlayers,
                IERC20: element.IERC20,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2))
            }
        })

    return {
        props: {
            lobbyETH,
            lobbyBNB
        }
    }
}

export default function Home({ LOTTERY_ADDRESS, NFT_ADDRESS, chainId, lobbyBNB, lobbyETH, tymblerNaNetwork, settxData }) {



    const [ALL_LOBBYES, setAll_LOBBYES] = useState({
        lobbyBNB,
        lobbyETH
    })

    const [deposit, setdeposit] = useState("")
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [token, settoken] = useState("")
    const [lobbyes, setlobbyes] = useState(lobbyETH)
    const [lobbyesActive, setlobbyesActive] = useState([])
    const [rokens, setTokens] = useState([{
        address: "0",
        symbol: "Tokens"
    }])

    ///FILTER
    const [tokenn, settokenn] = useState("")
    const [UP, setUP] = useState(true)
    const [filterModeScreen, setfilterMode] = useState(1)
    let filterMode = filterModeScreen


    const { chain } = useNetwork()
    const provider = useProvider()
    const { data } = useSigner()
    const signer = data
    const { address, isConnected } = useAccount()

    const [userlobbyActive, setuserlobbyActive] = useState([])



    useEffect(() => {
        if (chain == undefined) {
            if (tymblerNaNetwork) {
                setlobbyes(lobbyETH)
            }
            else {
                setlobbyes(lobbyBNB)
            }
        } else {
            if (chainId == ETHid) {
                setlobbyes(lobbyETH)
            }
            else {
                setlobbyes(lobbyBNB)
            }
        }
    }, [tymblerNaNetwork, chainId])




    const filterUserLobbyes = async () => {
        try {
            const te = []
            const f = (tymblerNaNetwork ? ALL_LOBBYES.lobbyETH : ALL_LOBBYES.lobbyBNB).filter((element) => {
                console.log(element)
                if (element.players.indexOf(address) === -1) {
                    te.push(false)
                }
                else {
                    te.push(true)
                    return element
                }

            })
            setuserlobbyActive(te)
            setlobbyesActive(f)
        } catch (err) {
            setlobbyesActive([])
            console.log(err)
        }

    }

    useEffect(() => {
        getTokens()
    }, [address, chainId])


    useEffect(() => {
        if (isConnected) {
            filterUserLobbyes()
        }
        else {
            setuserlobbyActive([])
            setlobbyesActive([])
        }

    }, [address, chainId, LOTTERY_ADDRESS, ALL_LOBBYES])


    const getTokens = async () => {
        if (isConnected) {
            try {
                const body = { address, chainId }
                await fetch('/api/getUserTokens', {
                    method: "POST",
                    body: JSON.stringify(body)
                }).then(async (data) => {
                    const temp = await data.json()
                    console.log(temp)
                    settoken(temp[0])
                    const objects = []
                    temp.forEach((element) => {
                        objects.push({
                            address: element.address,
                            symbol: element.symbol,
                            decimals: element.decimals
                        })
                    })
                    setTokens(objects)
                })
            } catch (err) {
                console.log("getUserTokens", err)
            }
        }
        else {
            setTokens([{
                address: "0",
                symbol: "Tokens"
            }])
        }
    }

    const createNewLobby = async () => {

        try {
            settxData({
                isPending: true,
                result: null
            })
            console.log("ssw", token)
            if (token.decimals >= 0) {
                console.log("ss", token)
                const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
                const Deposit = BigInt(deposit * 10 ** token.decimals)
                const body = { user: address, token: token.address, countOfPlayers, deposit, chainId }
                console.log(body, token, Deposit, chainId)
                const tx = await contract.createNewLobby(token.address, Deposit, countOfPlayers)
                await tx.wait()
                await fetch('/api/createNewLobby', {
                    method: "PUT",
                    body: JSON.stringify(body)
                })

                const newy = { user: address, chainId }
                await fetch('/api/getNewLobby', {
                    method: "POST",
                    body: JSON.stringify(newy)
                }).then(async (data) => {
                    const element = await data.json()
                    const _data = {
                        deposit: element.deposit,
                        nowInLobby: element.nowInLobby,
                        players: element.players,
                        countOfPlayers: element.countOfPlayers,
                        IERC20: element.IERC20,
                        creator: element.creator,
                        id: element.id,
                        percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2))
                    }
                    setlobbyes([...lobbyes, _data])
                    setlobbyesActive([...lobbyesActive, _data])
                    setuserlobbyActive([...userlobbyActive, true])

                    const temp = ALL_LOBBYES
                    chainId == ETHid ? temp.lobbyETH.push(_data) : temp.lobbyBNB.push(_data)
                    setAll_LOBBYES(temp)
                })
                settxData({
                    isPending: true,
                    result: true
                })
            }
            else {
                settxData({
                    isPending: false,
                    result: false
                })
            }
        } catch (err) {
            console.log(err)
            settxData({
                isPending: false,
                result: false
            })
        }
        document.getElementById("deposit").value = "";
        document.getElementById("countofplayers").value = "";
    }

    const [needLigth, setneedLigth] = useState(false)

    const setSettingFOrFilter = () => {
        setfilterMode(filterMode)
        setneedLigth(true)
        let token
        rokens.map((element) => {
            if (element.symbol === tokenn)
                token = element.address
        })
        const settings = {
            token,
            filterMode,
            UP
        }
        setlobbyes([...Filter(!tymblerNaNetwork ? ALL_LOBBYES.lobbyBNB : ALL_LOBBYES.lobbyETH, settings)])
        try {

        } catch (err) {
            console.log(err)
        }
    }

    const [isfaund, setisfaund] = useState(true)

    const EnterLobby = async (lobby, index) => {
        try {
            console.log(lobby)
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tx = await contract.EnterLobby(lobby.creator, lobby.id)
            await tx.wait()

            const _lobby = await contract.getLobby(lobby.creator, lobby.id)

            const creator = lobby.creator
            const id = parseInt(lobby.id)
            const body = { creator, id, newPlayer: address, chainId, winer: _lobby.winer }

            try {
                fetch("/api/enterLobby", {
                    method: "POST",
                    body: JSON.stringify(body)
                })
            } catch (err) {
                console.log(err)
            }

            const loby = await contract.getLobby(creator, id)
            let flag = false
            const stop = lobbyes.length
            for (let i = 0; i < stop; i++) {
                if (id == lobbyes[i].id && lobbyes[i].creator === creator) {
                    if (parseInt(BigInt(loby.nowInLobby)) != 0) {
                        lobbyes[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                        if (chainId == ETHid) {
                            ALL_LOBBYES.lobbyETH[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                            ALL_LOBBYES.lobbyETH[i].players = loby.players
                        }
                        else {
                            ALL_LOBBYES.lobbyBNB[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                            ALL_LOBBYES.lobbyBNB[i].players = loby.players
                        }

                        setlobbyesActive([...lobbyesActive, lobbyes[i]])
                    }
                    else {
                        flag = true
                        lobbyes.splice(i, 1)
                    }
                    break
                }
            }
            settxData({
                isPending: true,
                result: true
            })
            if (flag) {
                setlobbyes([...lobbyes])
            }
            else {
                userlobbyActive[index] = true
                setuserlobbyActive([...userlobbyActive])
            }


        } catch (err) {
            settxData({
                isPending: true,
                result: false
            })
        }
    }
    const [startIndex, setstartIndex] = useState(1)
    const [countOfRenderNfts, setcountOfRenderNfts] = useState(25)


    useEffect(() => {
        const temp = localStorage.getItem("LobbyENOUGTH")
        if (temp > 0) {
            setcountOfRenderNfts(temp)
            document.getElementById("enougth").value = temp;
        }
    }, [])

    const changeState = (isup) => {
        if (isup) {
            const first = parseInt(countOfRenderNfts) + parseInt(startIndex)
            if (first <= lobbyes.length)
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



    return (
        <div className='lobbyes'>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />

            </Head>

            <div className='new_active_lobbys'>
                <div className='newLobby'>
                    <select onClick={e => {
                        if (localStorage.getItem("addToken") === "true") {
                            getTokens()
                            localStorage.removeItem("addToken")
                        }

                        rokens.forEach((element) => {
                            if (e.target.value === element.symbol)
                                settoken(element)
                        });
                    }} className="choosetoken">
                        {rokens && rokens.map((element) =>
                            <option className='option' > {element.symbol}</option>
                        )}
                    </select>
                    <input className='input I' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value.toString())} />
                    <input className='input I' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} />
                    <button onClick={createNewLobby} className="mybutton I">Create New Lobby</button>
                </div>
                <div className='area' >
                    {lobbyesActive && lobbyesActive.map((element, index) =>
                        <div className='LobbyShablon' style={{ borderColor: "antiquewhite", cursor: "default" }} >
                            <div className='tokenAnd'>
                                <div className="tokeninlobbyshablon gridcenter">
                                    {isfaund && <Image className="tokenpng" alt='?' src={`/tokens/${element.IERC20}.png`} width={45} height={45} />}
                                    {!isfaund && <Image className="tokenpng" src="/questionMark.png" width={45} height={45} />}
                                </div>
                                <div className='countofplayers gridcenter'>
                                    {element.percent}%
                                </div>
                            </div>
                            <div className='predepositlobby'>
                                <div className='depositlobby'>
                                    <div>Deposit: {element.deposit}</div>
                                    <div>Pot: {`${(element.deposit * element.countOfPlayers)}`}</div>
                                    <div>Players: {element.nowInLobby}/{element.countOfPlayers}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>




            </div>
            <div className='areafilterlobby'>
                <div className='FILTER'>

                    <select onChange={e => settokenn(e.target.value)} className="choosetoken" onClick={() => {
                        if (localStorage.getItem("addToken") === "true") {
                            getTokens()
                            localStorage.removeItem("addToken")
                        }
                    }
                    }>
                        <option>ALL</option>
                        {rokens && rokens.map((element) => {
                            if (element.symbol != "Tokens") return (<option>{element.symbol}</option>)
                        }
                        )}
                    </select>
                    <div className='UpAndDown'>
                        <label className="switch" style={{ transform: "rotate(0deg)" }}>
                            <input type="checkbox" style={{ display: "none" }} onClick={() => setUP(!UP)} ></input>
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div>
                        <select className="choosetoken" style={{ minWidth: "85px" }} onClick={(e) => { e.target.value == "Deposit" ? filterMode = 1 : e.target.value == "Percent" ? filterMode = 2 : filterMode = 3 }}>
                            <option>
                                Deposit
                            </option>
                            <option >
                                Percent
                            </option>
                            <option >
                                Players
                            </option>
                        </select>
                    </div>

                    <button onClick={() => setSettingFOrFilter()} className='mybutton choosetoken'>Filter</button>
                </div>
            </div>
            <a name="Steps"></a>
            {/* <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>

                </div>
            </div> */}
            <div className='Loby'>
                <button className='mybutton' onClick={() => changeState(false)}>Back</button>
                <select className="choosetoken mm" style={{ width: "65px" }} id="enougth" onClick={(e) => { localStorage.setItem("LobbyENOUGTH", e.target.value); setcountOfRenderNfts(e.target.value) }}>
                    <option>20</option>
                    <option>100</option>
                    <option>250</option>
                    <option>1000</option>
                </select>
                <button className='mybutton' onClick={() => changeState(true)}>Next</button>
            </div>

            <div className='arealobbyes'>
                <div className='alllobbyes'>
                    {lobbyes && lobbyes.map((element, index) => isEnogth(index + 1) &&
                        <div className='areaAraund'>
                            <div className='LobbyShablon' onClick={() => { if (!userlobbyActive[index]) { EnterLobby(element, index) } }} style={!userlobbyActive[index] ? {} : { margin: "0px 30px", borderColor: "antiquewhite", cursor: "default" }}>
                                <div className='tokenAnd'>
                                    <div className="tokeninlobbyshablon gridcenter">
                                        {isfaund && <Image className="tokenpng" alt='?' src={`/tokens/${element.IERC20}.png`} width={45} height={45} />}
                                        {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={45} height={45} />}
                                    </div>
                                    <div className='countofplayers gridcenter'>
                                        <strong style={{ color: needLigth && filterModeScreen == 2 ? "rgb(42 255 0)" : null }}>{`${element.percent}%`}</strong>
                                    </div>
                                </div>
                                <div className='predepositlobby'>
                                    <div className='depositlobby'>
                                        <div>Deposit: <strong style={{ color: needLigth && filterModeScreen == 1 ? "rgb(42 255 0)" : null }}>{element.deposit}</strong></div>
                                        <div>Pot: <strong>{`${(element.deposit * element.countOfPlayers)}`.substring(0, 10)}</strong></div>
                                        <div>Players: <strong style={{ color: needLigth && filterModeScreen == 3 ? "rgb(42 255 0)" : null }}>{element.nowInLobby}/{element.countOfPlayers}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>
                    <button className='mybutton' onClick={() => changeState(false)}><a href="#Steps" style={{ color: "white" }}>Back</a></button>
                    <div style={{ minWidth: "130px" }} />
                    <button className='mybutton' onClick={() => changeState(true)}><a href="#Steps" style={{ color: "white" }}>Next</a></button>
                </div>
            </div>

        </div >
    )
}

