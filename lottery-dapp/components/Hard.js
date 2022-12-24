import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "/blockchain/A.json"
import Lottery from "/blockchain/Lottery.json"
import { LotteryAddressETH, LotteryAddressBNB, ETHid, BNBid, PRODACTION, ALCHEMY_KEY, INFURA_KEY } from '/components/Constants.js';
import Loader from "react-spinners/HashLoader";
import IssueMaker from './IssueMaker';


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
    useDisconnect,
    useSigner,
    useNetwork,
    useSwitchNetwork,
    useProvider
} from 'wagmi';
import Hars_Monitors from './Hard_Monitors';
import HARD_LobbuShablon from './HARD_LobbuShablon';


export default function Hard({ LOTTERY_ADDRESS, setneedNews, chainId, tymblerNaNetwork, Data, settxData, setneedWallet, isSession, setVERSION, VERSION }) {

    const [ALL_LOBBYES, setAll_LOBBYES] = useState({
        lobbysETH: [],
        lobbysBNB: [],
        lobbysETHActive: [],
        lobbysBNBActive: []
    })

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
    const [isSlideShow, setisSlideShow] = useState(false)
    const [filterModeScreen, setfilterMode] = useState(1)
    const [SlideShow, setSlideShow] = useState(0)


    const { chain } = useNetwork()
    const provider = useProvider()
    const { data } = useSigner()
    const signer = data
    const { address, isConnected } = useAccount()

    const [activeMassive, setactiveMassive] = useState(0)
    const [activeMassiveLength, setactiveMassiveLength] = useState(0)

    // useEffect(() => {
    // }, [])




    useEffect(() => {
        getAllLobbyes()
        getAllNews()
    }, [address, tymblerNaNetwork, chainId])

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
            setactiveMassiveLength(chainId == ETHid ? lobbys.lobbysETH.length : lobbys.lobbysBNB.length)
        })
    }

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
            const tx = await contract.createNewLobby(token.address, Deposit, countOfPlayers, { value: BigInt(10 ** 1) })
            await tx.wait()

            await fetch('/api/createNewLobby', {
                method: "PUT",
                body: JSON.stringify(body)
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

    const EnterLobby = async (lobby, index) => {
        try {
            console.log(lobby)
            settxData({
                isPending: true,
                result: null
            })
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, signer)
            const tx = await contract.EnterLobby(lobby.creator, lobby.id, { value: BigInt(10 ** 1) })
            await tx.wait()

            const id = parseInt(lobby.id)
            const creator = lobby.creator

            const loby = await contract.getLobby(creator, id)

            const body = {
                creator,
                id,
                newPlayer: address,
                chainId,
                winer: loby.winer,
                nowInLobby: parseInt(loby.nowInLobby),
                countOfPlayers: parseInt(loby.countOfPlayers),
                IERC20: loby.token,
                deposit: `${loby.deposit}`,
                players: loby.nowInLobby == 0 ? loby.players : null
            }

            console.log(body)

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
            let issue = IssueMaker({ data: err.code, from: "createNewLobby", reason: err.reason })
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

    const [news, setnews] = useState([])

    const getAllNews = async () => {
        try {
            const user = address
            const constructorNews = []
            const body = { user, chainId }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(async (data) => {
                    const tr = await data.json()
                    let temp
                    if (chain.id == ETHid)
                        temp = tr.newsETH
                    else
                        temp = tr.newsBNB
                    if (temp == null)
                        return
                    const t = temp.split("&")
                    t.pop()
                    t.map(element => {
                        let data = element.split("_")
                        let winOrLose = "Lose"
                        if (data[5] == "1") {
                            winOrLose = "Win"
                        }
                        constructorNews.push(Object({
                            creator: data[0],
                            id: data[1],
                            IERC20: data[2],
                            deposit: data[3],
                            countOfPlayers: data[4],
                            isWin: winOrLose
                        }
                        ))
                    });

                })

            // constructorNews.reverse()
            setnews(constructorNews)
        } catch (err) {
            setnews()
            console.log(err)
        }
    }

    const [interval, setinterval] = useState()

    const StartSlideShow = async () => {
        if (!isSlideShow) {
            setisSlideShow(true)
            setinterval(setInterval(() => {
                setSlideShow((SlideShow, length = lobbyes.length) => {
                    if (SlideShow + 1 == length) {
                        getAllLobbyes()
                        getAllNews()
                    }
                    return (SlideShow + 1) % length
                })
            }, 10000))
        } else {
            clearInterval(interval)
            setisSlideShow(false)
        }

    }

    return (
        <div className=''>
            < Head >
                <title>!Mudebz</title>
                <style> @import url('https://fonts.googleapis.com/css2?family=Caramel&display=swap'); </style>
                <meta name="description" content=" user-scalable=no" />
            </Head >
            {isConnected && <div className={activeMassive == 1 ? 'menuLobby Selected pointer USER_NoSelected' : 'menuLobby menuHover pointer USER_NoSelected'} onClick={() => {
                setactiveMassive(1)
                setactiveMassiveLength(lobbyesActive?.length)
            }}>
                Active
            </div>}
            <div className={activeMassive == 0 ? 'menuGallery Selected pointer USER_NoSelected' : 'menuGallery menuHover pointer USER_NoSelected'} onClick={() => {
                setactiveMassive(0)
                setactiveMassiveLength(lobbyes?.length)
            }}>
                Lobby
            </div>
            <div className={isSlideShow ? 'Show Selected pointer USER_NoSelected' : 'Show menuHover pointer USER_NoSelected'} onClick={() => {
                StartSlideShow()
            }}>
                Show
            </div>
            {isConnected && <div className={activeMassive == 2 ? 'NewsButtonText Selected pointer USER_NoSelected' : 'NewsButtonText menuHover pointer USER_NoSelected'} onClick={() => {
                setactiveMassive(2)
                setactiveMassiveLength(news?.length)
            }}>
                News
            </div>}
            <div className='OFF pointer menuHover USER_NoSelected' onClick={() => {
                setVERSION(!VERSION);
            }}></div>
            {!isSlideShow && <div className='HARD_BACK_NEXT pointer USER_NoSelected'>
                <div className='HARD_areaBN '>
                    <div className='menuHover ' style={{ fontWeight: "700" }} onClick={() => {
                        setSlideShow(SlideShow - 1 > 0 ? SlideShow - 1 : 0)
                    }}>
                        BACK
                    </div>
                    <div className='menuHover' style={{ fontWeight: "700" }} onClick={() => {
                        setSlideShow(SlideShow + 1 < activeMassiveLength ? SlideShow + 1 : activeMassiveLength - 1)
                    }}>
                        NEXT
                    </div>
                </div>
            </div>}

            <div className='HARD_PopUp pointer USER_NoSelected' onClick={() => {
                settxData({
                    isPending: null,
                    result: null
                })
            }}>
                {Data.isPending && Data.result == null ? <Loader loading={true} color={"#0d212a"} size={30} /> : Data.result ? <Image src="/succses.png" width={35} height={35} /> : Data.result == false ? <Image src="/wrong.png" width={35} height={35} /> : <div />}
            </div>
            <div className="" >
                <div className="LeftMonitor USER_NoSelected">
                    <div className="HARD_lobbyCreate" >
                        <input className="HARD_lobbyCreate_input HARD_ELEMENTS_LOBBY_CREATE" placeholder="Deposit" onChange={e => setdeposit(e.target.value.toString())} style={{ color: isdepositvalid == false ? "red" : null }} />
                        <input className="HARD_lobbyCreate_input HARD_ELEMENTS_LOBBY_CREATE" placeholder="Players" onChange={e => setcountOfPlayers(e.target.value)} style={{ color: iscountOfPlayersvalid == false ? "red" : null }} />
                        <select onClick={e => {
                            rokens.forEach((element) => {
                                if (e.target.value === element.symbol)
                                    settoken(element)
                            });
                        }} className="HARD_lobbyCreate_select HARD_ELEMENTS_LOBBY_CREATE pointer" >
                            {rokens && rokens.map((element) => {
                                if (element.symbol != "Tokens") return (<option>{element.symbol}</option>)
                            }
                            )}
                        </select>
                        <button onClick={createNewLobby} className="HARD_lobbyCreate_button HARD_ELEMENTS_LOBBY_CREATE pointer" >Create</button>

                    </div>
                </div>
            </div >
            {/* {
                lobbyes &&
                <div >
                    <div className='case1 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />
                    </div>
                    <div className='case2 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 1]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 1} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />
                    </div>
                    <div className='case3 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />
                    </div>
                    <div className='case4 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case5 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case6 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case7 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case8 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case9 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case10 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case11 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case12 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case13 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case14 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case15 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case16 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case17 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case18 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case19 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                    <div className='case20 case'>
                        <HARD_LobbuShablon element={lobbyes[startIndex + 2]} isSHOW={isSHOW} EnterLobby={EnterLobby} imageFounded={imageFounded} index={startIndex + 2} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />

                    </div>
                </div>
            } */}
            <div className={isSlideShow ? 'HARD_RigthMonitor active' : 'HARD_RigthMonitor'}>
                <HARD_LobbuShablon element={activeMassive == 0 ? lobbyes[SlideShow] : activeMassive == 1 ? lobbyesActive[SlideShow] : news[SlideShow]} activeMassive={activeMassive} isSHOW={true} isMonitor={true} EnterLobby={EnterLobby} imageFounded={imageFounded} index={SlideShow} filterModeScreen={filterModeScreen} needLigth={needLigth} setimageFounded={setimageFounded} />
            </div>
            {/* <div style={{ color: "white" }}>{SlideShow}</div> */}
        </div >


    )
}