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
import IssueMaker from '../components/IssueMaker';
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



export default function Home({ LOTTERY_ADDRESS, setneedNews, chainId, tymblerNaNetwork, settxData, setneedWallet }) {
    const [ALL_LOBBYES, setAll_LOBBYES] = useState({
        lobbysETH: [],
        lobbysBNB: [],
        lobbysETHActive: [],
        lobbysBNBActive: []
    })

    const fakeMassive = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]

    const [deposit, setdeposit] = useState("")
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [isdepositvalid, setisdepositvalid] = useState()
    const [iscountOfPlayersvalid, setiscountOfPlayersvalid] = useState()
    const [token, settoken] = useState("")
    const [lobbyes, setlobbyes] = useState([])
    const [lobbyesActive, setlobbyesActive] = useState([])
    const [imageFounded, setimageFounded] = useState([])
    const [imageFoundedLobbyActive, setimageFoundedLobbyActive] = useState([])
    const [rokens, setTokens] = useState([{
        address: "0",
        symbol: "Tokens"
    }])



    useEffect(() => {
        if (lobbyes == undefined)
            setimageFounded([])
        else
            setimageFounded(lobbyes.map(() => {
                return true
            }))
    }, [lobbyes])

    useEffect(() => {
        if (lobbyes == undefined)
            setimageFoundedLobbyActive([])
        else
            setimageFoundedLobbyActive(lobbyesActive.map(() => {
                return true
            }))
    }, [lobbyesActive])

    ///FILTER
    const [tokenn, settokenn] = useState("")
    const [UP, setUP] = useState(true)
    const [filterModeScreen, setfilterMode] = useState(1)
    const [isLobbyFetched, setisLobbyFetched] = useState(false)
    let filterMode = filterModeScreen


    const { chain } = useNetwork()
    const provider = useProvider()
    const { data } = useSigner()
    const signer = data
    const { address, isConnected } = useAccount()



    useEffect(() => {
        getAllLobbyes()
    }, [address])

    const getAllLobbyes = async () => {
        const body = { user: address, isConnected, chainId }
        await fetch("/api/getAllLobby", {
            method: "POST",
            body: JSON.stringify(body)
        }).then(async (data) => {
            const lobbys = await data.json()
            setAll_LOBBYES(lobbys)
            setlobbyesActive(chainId == ETHid ? lobbys.lobbysETHActive : lobbys.lobbysBNBActive)
            setlobbyes(chainId == ETHid ? lobbys.lobbysETH : lobbys.lobbysBNB)
            setisLobbyFetched(true)
        })
    }

    useEffect(() => {
        if (!isConnected) {
            if (tymblerNaNetwork) {
                setlobbyes(ALL_LOBBYES.lobbysETH)
            }
            else {
                setlobbyes(ALL_LOBBYES.lobbysBNB)
            }
        } else {
            getAllLobbyes()
        }
    }, [tymblerNaNetwork, chainId])


    useEffect(() => {
        if (countOfPlayers / 1 > 1 && countOfPlayers / 1 <= 1000)
            setiscountOfPlayersvalid(true)
        else if (countOfPlayers == "")
            setiscountOfPlayersvalid(undefined)
        else
            setiscountOfPlayersvalid(false)
    }, [countOfPlayers])

    useEffect(() => {
        if (parseFloat(deposit) == deposit)
            setisdepositvalid(true)
        else if (deposit == "")
            setisdepositvalid(undefined)
        else
            setisdepositvalid(false)
    }, [deposit])

    useEffect(() => {
        getTokens()
    }, [address, chainId])

    // useEffect(() => {
    //     events()
    // }, [])

    // const events = async () => {
    //     const now = new Date().getTime() / 1000
    //     console.log(now)
    //     const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)

    //     let lobbys
    //     const body = { user: address, isConnected, chainId }
    //     await fetch("/api/getAllLobby", {
    //         method: "POST",
    //         body: JSON.stringify(body)
    //     }).then(async (data) => {
    //         lobbys = await data.json()
    //         console.log("FFFFFFFF")
    //     })


    //     contract.removeAllListeners()
    //     // contract.on("playLobby", (user, creator, lobbyId, lobby, time) => {
    //     //     console.log(user, lobby)
    //     // })
    //     // contract.on("enterLobby", async (user, creator, lobbyId, lobby, time) => {
    //     //     if (time > now) {
    //     //         const stop = lobbyes.length
    //     //         for (let i = 0; i < stop; i++) {
    //     //             if (lobbyId == lobbyes[i].id && lobbyes[i].creator == creator) {
    //     //                 if (parseInt(BigInt(lobby.nowInLobby)) != 0) {
    //     //                     if (chainId == ETHid) {
    //     //                         ALL_LOBBYES.lobbysETH[i].nowInLobby = parseInt(BigInt(lobby.nowInLobby))
    //     //                         ALL_LOBBYES.lobbysETH[i].players += user + "_"
    //     //                         if (user == address) {
    //     //                             lobbyes[i].isEntered = true
    //     //                             setlobbyesActive([...lobbyesActive, lobbyes[i]])
    //     //                         }
    //     //                         setlobbyes([...lobbyes])
    //     //                     }
    //     //                     else {
    //     //                         ALL_LOBBYES.lobbysBNB[i].nowInLobby = parseInt(BigInt(lobby.nowInLobby))
    //     //                         ALL_LOBBYES.lobbysBNB[i].players += user + "_"
    //     //                         if (user == address) {
    //     //                             lobbyes[i].isEntered = true
    //     //                             setlobbyesActive([...lobbyesActive, lobbyes[i]])
    //     //                         }
    //     //                         setlobbyes([...lobbyes])
    //     //                     }

    //     //                 }
    //     //                 break
    //     //             }
    //     //         }
    //     //     }
    //     // })
    //     contract.on("newLobby", async (user, lobbyId, lobby, time) => {
    //         if (time > now) {
    //             console.log(parseInt(lobbyId), "dd", time, now, lobbys)
    //             const bod = {
    //                 addresses: [lobby.token]
    //             }
    //             await fetch("/api/getTokensGlobal", {
    //                 method: "POST",
    //                 body: JSON.stringify(bod)
    //             }).then(async (data) => {
    //                 const token = await data.json()
    //                 const _data = {
    //                     deposit: `${parseInt(lobby.deposit) / (10 ** token[0].decimals)}`,
    //                     nowInLobby: parseInt(lobby.nowInLobby),
    //                     // players: lobby.players,
    //                     countOfPlayers: parseInt(lobby.countOfPlayers),
    //                     IERC20: token[0].address,
    //                     creator: user,
    //                     id: parseInt(lobbyId),
    //                     percent: parseInt(`${lobby.nowInLobby / lobby.countOfPlayers * 100}`.substring(0, 2)),
    //                     isEntered: user == address
    //                 }

    //                 chainId == ETHid ? ALL_LOBBYES.lobbysETH.push(_data) : ALL_LOBBYES.lobbysBNB.push(_data)
    //                 chainId == ETHid ? ALL_LOBBYES.lobbysETHActive.push(_data) : ALL_LOBBYES.lobbysBNBActive.push(_data)
    //                 setlobbyes(chainId == ETHid ? ALL_LOBBYES.lobbysETH : ALL_LOBBYES.lobbysBNB)
    //                 if (_data.creator == address)
    //                     setlobbyesActive(chainId == ETHid ? ALL_LOBBYES.lobbysETHActive : ALL_LOBBYES.lobbysBNBActive)
    //                 setAll_LOBBYES(ALL_LOBBYES)
    //             })
    //         }
    //     })
    // }

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
                            decimals: element.decimals,
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
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const Deposit = BigInt(deposit * 10 ** token.decimals)
            const id = 1 + parseInt(await contract.getlobbyCountForAddressALL(address))
            const body = { user: address, token: token.address, countOfPlayers, deposit, chainId, id }
            console.log(body, token, Deposit, chainId, id)
            const tx = await contract.createNewLobby(token.address, Deposit, countOfPlayers, { value: BigInt(10 ** 16) })
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
                    percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2)),
                    isEntered: true
                }
                setlobbyes([...lobbyes, _data])
                setlobbyesActive([...lobbyesActive, _data])

                const temp = ALL_LOBBYES
                chainId == ETHid ? temp.lobbysETH.push(_data) : temp.lobbysBNB.push(_data)
                setAll_LOBBYES(temp)
            })
            settxData({
                isPending: true,
                result: true
            })

            try {
                document.getElementById("deposit").value = "";
                document.getElementById("countofplayers").value = "";
            } catch (err) { }

        } catch (err) {
            console.log(err)
            let issue
            if (iscountOfPlayersvalid && isdepositvalid)
                issue = IssueMaker({ data: err.code, from: "createNewLobby" })
            else
                issue = "Deposit or Count of players"
            settxData({
                isPending: false,
                result: false,
                issue
            })
            if (!isConnected) {
                setneedWallet(true)
            }
        }

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
        setlobbyes([...Filter(!tymblerNaNetwork ? ALL_LOBBYES.lobbysBNB : ALL_LOBBYES.lobbysETH, settings)])
        try {

        } catch (err) {
            console.log(err)
        }
    }

    const EnterLobby = async (lobby, index) => {
        try {
            console.log(lobby)
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tx = await contract.EnterLobby(lobby.creator, lobby.id, { value: BigInt(10 ** 16) })
            await tx.wait()

            const _lobby = await contract.getLobby(lobby.creator, lobby.id)

            const creator = lobby.creator
            const id = parseInt(lobby.id)
            const body = { creator, id, newPlayer: address, chainId, winer: _lobby.winer }

            try {
                fetch("/api/enterLobby", {
                    method: "POST",
                    body: JSON.stringify(body)
                }).then(() => {
                    setneedNews(true)
                })
            } catch (err) {
                console.log(err)
            }

            const loby = await contract.getLobby(creator, id)
            const stop = lobbyes.length
            for (let i = 0; i < stop; i++) {
                if (id == lobbyes[i].id && lobbyes[i].creator === creator) {
                    if (parseInt(BigInt(loby.nowInLobby)) != 0) {
                        lobbyes[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                        lobbyes[i].isEntered = true
                        if (chainId == ETHid) {
                            ALL_LOBBYES.lobbysETH[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                            ALL_LOBBYES.lobbysETH[i].players = address + "_"
                        }
                        else {
                            ALL_LOBBYES.lobbysBNB[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                            ALL_LOBBYES.lobbysBNB[i].players = address + "_"
                        }

                        setlobbyesActive([...lobbyesActive, lobbyes[i]])
                    }
                    else {
                        lobbyes.splice(i, 1)
                        setlobbyes([...lobbyes])
                    }
                    break
                }
            }
            settxData({
                isPending: true,
                result: true
            })
        } catch (err) {
            let issue = IssueMaker({ data: err.code, from: "createNewLobby" })
            settxData({
                isPending: false,
                result: false,
                issue
            })
            if (!isConnected) {
                setneedWallet(true)
            }
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
        <div className='MAIN_MARGIG'>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
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
                    <input className='input I' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value.toString())} style={{ color: isdepositvalid == false ? "red" : null }} />
                    <input className='input I' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} style={{ color: iscountOfPlayersvalid == false ? "red" : null }} />
                    <button onClick={createNewLobby} className="mybutton I">Create New Lobby</button>
                </div>
                <div className='area' >

                    {lobbyesActive && lobbyesActive.map((element, index) =>
                        <div className='LobbyShablon' style={{ borderColor: "antiquewhite", cursor: "default" }} >
                            <div className='tokenAnd'>
                                <div className="tokeninlobbyshablon gridcenter">
                                    {imageFoundedLobbyActive[index] && <Image className="tokenpng" alt='' onError={() => { imageFoundedLobbyActive[index] = false; setimageFoundedLobbyActive([...imageFoundedLobbyActive]) }} src={`/tokens/${element.IERC20}.png`} width={45} height={45} />}
                                    {!imageFoundedLobbyActive[index] && <Image className="tokenpng" src="/questionMark.png" width={45} height={45} />}
                                </div>
                                <div className='countofplayers gridcenter'>
                                    <div style={{ position: "relative" }}>
                                        <div className="circle" style={{ backgroundImage: `conic-gradient(#fffeee ${element.percent}%, #232323 0)` }}>
                                            <div className='countOfPlayersImagetru'>
                                                <Image src="/persons.png" width={40} height={40} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='predepositlobby'>
                                <div className='depositlobby'>
                                    <div>Deposit: {element.deposit}</div>
                                    <div>Prize: {`${(element.deposit * element.countOfPlayers)}`}</div>
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
                            <option>Deposit</option>
                            <option>Percent</option>
                            <option>Players</option>
                        </select>
                    </div>

                    <button onClick={() => setSettingFOrFilter()} className='mybutton choosetoken'>Filter</button>
                </div>
            </div>
            <a name="Steps"></a>

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
                    {isLobbyFetched && lobbyes && lobbyes.map((element, index) => isEnogth(index + 1) &&
                        <div className='areaAraund'>
                            <div className={(!element.isEntered) ? 'LobbyShablon shadows' : 'LobbyShablon'} onClick={() => { if (!element.isEntered) { EnterLobby(element, index) } }} style={!element.isEntered ? {} : { margin: "0px 30px", borderColor: "antiquewhite", cursor: "default" }}>
                                <div className='tokenAnd'>
                                    <div className="tokeninlobbyshablon gridcenter">
                                        {imageFounded[index] && <Image className="tokenpng" alt='' onError={() => { imageFounded[index] = false; setimageFounded([...imageFounded]) }} src={`/tokens/${element.IERC20}.png`} width={46} height={46} />}
                                        {!imageFounded[index] && <Image className="tokenpng" src="/questionMark.png" width={46} height={46} />}
                                    </div>
                                    <div className='countofplayers gridcenter'>
                                        <div style={{ position: "relative" }}>
                                            <div className="circle" style={{ backgroundImage: `conic-gradient(#fffeee ${element.percent}%, #232323 0)` }}>
                                                <div className='countOfPlayersImagetru'>
                                                    <Image src="/persons.png" width={40} height={40} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='predepositlobby'>
                                    <div className='depositlobby'>
                                        <div>Deposit: <strong style={{ color: needLigth && filterModeScreen == 1 ? "rgb(42 255 0)" : null }}>{element.deposit}</strong></div>
                                        <div>Prize: <strong>{`${(element.deposit * element.countOfPlayers)}`.substring(0, 10)}</strong></div>
                                        <div>Players: <strong style={{ color: needLigth && filterModeScreen == 3 ? "rgb(42 255 0)" : null }}>{element.nowInLobby}/{element.countOfPlayers}</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!isLobbyFetched && fakeMassive.map((element, index) => isEnogth(index + 1) &&
                        <div className='areaAraund'>
                            <div className={'LobbyShablon'} >

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

