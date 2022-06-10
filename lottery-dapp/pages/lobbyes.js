import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { PrismaClient } from '@prisma/client';
import LobbyShablon from '../components/LobbyShablon'
import Filter from '../components/Filter';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { _toUtf8String } from '@ethersproject/strings/lib/utf8';
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { resolve } from 'path';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const prisma = new PrismaClient();


export async function getServerSideProps() {
    const lobbyess = await prisma.lobby.findMany();
    return {
        props: {
            allLobbyes: lobbyess
        }
    }
}

export default function Home({ allLobbyes }) {


    const [ALL_LOBBYES, setAll_LOBBYES] = useState(allLobbyes)

    const [deposit, setdeposit] = useState("")
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [token, settoken] = useState("")
    const [lobbyes, setlobbyes] = useState(allLobbyes)
    const [lobbyesActive, setlobbyesActive] = useState([])
    const [user, setuser] = useState('')
    const [rokens, setTokens] = useState([])

    ///FILTER
    const [tokenn, settokenn] = useState("")
    const [depositt, setdepositt] = useState(false)
    const [nowInLobby, setnowInLobby] = useState(true)
    const [countOfPlayerss, setcountOfPlayerss] = useState(false)
    const [UP, setUP] = useState(true)

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

    useEffect(() => {
        setUser()
    })

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        window.ethereum.on("accountsChanged", (data) => {
            setuser(data[0])
        });
    }, [])

    const filterUserLobbyes = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            const f = lobbyes.filter((element) => {
                return (element.players.indexOf(_user) !== -1)
            })
            setlobbyesActive(f)
        } catch (err) {
            setlobbyesActive([])
            console.log(err)
        }

    }

    useEffect(() => {
        getTokens()
        filterUserLobbyes()
    }, [user])


    const getTokens = async () => {
        try {
            await fetch('/api/getUserData', {
                method: "POST",
                body: user
            })
                .then(async (data) => {
                    const temp = await data.json()
                    const t = temp.tokens
                    let f = t.split("_")
                    f.pop();
                    settoken(f[0])

                    const promises = f.map(async (item) => {
                        return await new Promise(resolve => {
                            const provider = new ethers.providers.Web3Provider(window.ethereum)
                            const contract = new ethers.Contract(item, A.abi, provider)
                            try {
                                const symbol = contract.symbol()
                                resolve(symbol)
                            } catch (err) {
                                resolve(item)
                            }

                        });
                    }
                    );
                    await Promise.all(promises)

                    let tokensSymbols = []

                    const objects = []
                    promises.forEach((element, index) => {
                        element.then((e) => {
                            tokensSymbols.push(e)
                            objects.push({
                                address: f[index],
                                symbol: e
                            })
                        })
                    })
                    setTokens(objects)
                })
        } catch (err) {
            setTokens([])
            console.log(user, err)
        }
    }

    const createNewLobby = async () => {
        /*
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const user = await signer.getAddress()
        const body = { user, token, countOfPlayers, deposit }
        try {
            await fetch('/api/makeBigData', {
                method: "PUT",
                body: JSON.stringify(body)
            })
    
        } catch (err) {
            console.log(err)
        }
        */
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tokenContract = new ethers.Contract(token, A.abi, provider)
        let decimals = 18
        try {
            decimals = await tokenContract.decimals()
        } catch (err) {
            console.log("net f decimals", err)
        }
        console.log(deposit, deposit * (10 ** decimals), 10 ** decimals)
        const Deposit = BigInt(deposit * 10 ** decimals)
        const body = { user, token, countOfPlayers, deposit }
        console.log(body, token, Deposit)
        const tx = await contract.createNewLobby(token, Deposit, countOfPlayers)
        await tx.wait()
        try {
            await fetch('/api/createNewLobby', {
                method: "PUT",
                body: JSON.stringify(body)
            })

            await fetch('/api/getNewLobby', {
                method: "POST",
                body: user
            }).then(async (data) => {
                data = await data.json()
                setlobbyes([...lobbyes, data])
                setAll_LOBBYES([...ALL_LOBBYES, data])
            })

            await fetch('/api/getUserLobbys', {
                method: "POST",
                body: user
            })
                .then(async (data) => {
                    const temp = await data.json()
                    setlobbyesActive(temp.userLobbyes)
                    console.log(temp)
                })
        } catch (err) {
            console.log(err)
        }
        document.getElementById("deposit").value = "";
        document.getElementById("countofplayers").value = "";
    }

    const setSettingFOrFilter = () => {
        let _token
        rokens.map((element) => {
            if (element.symbol === tokenn)
                _token = element.address
        })
        let setting = _token
        if (depositt && UP) setting = setting + " deposit_up"
        else if (depositt && !UP) setting = setting + " deposit_down"

        else if (countOfPlayerss && UP) setting = setting + " countOfPlayers_up"
        else if (countOfPlayerss && !UP) setting = setting + " countOfPlayers_down"

        else if (nowInLobby && UP) setting = setting + " nowInLobby_up"
        else if (nowInLobby && !UP) setting = setting + " nowInLobby_down"
        console.log(ALL_LOBBYES, "settings", setting)
        try {
            const filtered = Filter(ALL_LOBBYES, setting)
            setlobbyes([...filtered])
        } catch (err) {
            console.log(err)
        }
    }

    const [isfaund, setisfaund] = useState(true)

    const EnterLobby = async (lobby) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const newPlayer = await signer.getAddress()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.EnterLobby(lobby.creator, lobby.id)
        await tx.wait()

        const creator = lobby.creator
        const id = lobby.id
        const body = { creator, id, newPlayer }

        try {
            fetch("/api/enterLobby", {
                method: "POST",
                body: JSON.stringify(body)
            })
        } catch (err) {
            console.log(err)
        }

        const loby = await contract.getLobby(creator, id)
        for (let i = 0; i < lobbyes.length; i++) {
            if (lobbyes[i].creator === creator && parseInt(id) == lobbyes[i].id) {
                if (parseInt(BigInt(loby.nowInLobby)) != 0) {
                    lobbyes[i].nowInLobby = parseInt(BigInt(loby.nowInLobby))
                    setlobbyesActive([...lobbyesActive, lobbyes[i]])
                }
                else
                    lobbyes.splice(i, 1)
                break
            }
        }

        setlobbyes([...lobbyes])
        console.log("rr")
    }


    //lobbyesActive.pop()
    //lobbyesActive.pop()
    //lobbyesActive.pop()
    return (
        <div>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />

            </Head>
            <h1 className='titel'>Lobbyes</h1>

            <div className='new_active_lobbys'>
                <div className='newLobby'>
                    <select onClick={e => {
                        if (localStorage.getItem("addToken") === "true") {
                            getTokens()
                            localStorage.removeItem("addToken")
                        }

                        rokens.forEach((element) => {
                            if (e.target.value === element.symbol)
                                settoken(element.address)
                        });
                    }} className="choosetoken">
                        {rokens && rokens.map((element) =>
                            <option className='option' > {element.symbol}</option>
                        )}
                    </select>
                    <input className='input I' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value.toString())} />
                    <input className='input I' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} />
                    <button onClick={createNewLobby} className="mybutton">Create New Lobby</button>
                </div>
                <div className='area'>
                    <div className='overflow'>
                        <div className='arealobbychoose'>
                            {lobbyesActive && lobbyesActive.map((element, index) =>
                                <LobbyShablon
                                    lobby={element}
                                    index={index == lobbyesActive.length - 1 ? true : false} />
                            )}
                            {lobbyesActive && lobbyesActive.map((element, index) =>
                                <LobbyShablon
                                    lobby={element}
                                    index={index == lobbyesActive.length - 1 ? true : false} />
                            )}

                            {lobbyesActive.length < 1 && <h1 style={{ color: "white" }}>Здесь появяться ваши aктивные Лобби</h1>}
                        </div>
                    </div>
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
                        {rokens && rokens.map((element) =>
                            <option>{element.symbol}</option>
                        )}
                    </select>
                    <div className='UpAndDown'>
                        <label className="switch">
                            <input type="checkbox" style={{ display: "none" }} onChange={() => setUP(!UP)} ></input>
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div>
                        <input onChange={() => { setdepositt(true); setnowInLobby(false); setcountOfPlayerss(false) }} type="radio" id="depositt" name="monster" />
                        <label for="depositt" className='choosecoler'>deposit</label><br />
                        <input onChange={() => { setnowInLobby(true); setdepositt(false); setcountOfPlayerss(false) }} type="radio" id="nowInLobby" name="monster" />
                        <label for="nowInLobby" className='choosecoler'>nowInLobby</label><br />
                        <input onChange={() => { setcountOfPlayerss(true); setdepositt(false); setnowInLobby(false); }} type="radio" id="countOfPlayerss" name="monster" />
                        <label for="countOfPlayerss" className='choosecoler'>countOfPlayers</label><br />
                    </div>

                    <button onClick={setSettingFOrFilter} className='mybutton choosetoken'>Filter</button>
                </div>
            </div>
            <div className='arealobbyes'>
                <div className='alllobbyes'>
                    {lobbyes && lobbyes.map((element, index) =>
                        <div className={(index == lobbyes.length - 1) ? 'LobbyShablonKOSTLb2 ' : 'LobbyShablon'}>
                            <div className="tokeninlobbyshablon gridcenter">
                                {isfaund && <Image className="tokenpng" alt='?' src={`/tokens/${element.IERC20}.png`} width={45} height={45} />}
                                {!isfaund && <Image className="tokenpng" src="/question_mark.png" width={45} height={45} />}
                            </div>
                            <div className='countofplayers gridcenter'>
                                {element.nowInLobby}/{element.countOfPlayers}
                                <Image src="/countOfPlayers.png" width={27} height={27} />
                            </div>
                            <div className='depositlobby gridcenter'>{element.deposit}</div>
                            <div className='enter mybutton gridcenter' onClick={() => EnterLobby(element)}> Enter </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

