import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { PrismaClient } from '@prisma/client';
import LobbyShablon from '../components/LobbyShablon'
import Filter from '../components/Filter';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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


    let ALL_LOBBYES = allLobbyes


    const [deposit, setdeposit] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [LobbyCreator, setLobbyCreator] = useState('')
    const [LobbyId, setLobbyId] = useState(0)
    const [token, settoken] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const [tokenForFilter, settokenForFolter] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const [lobbyes, setlobbyes] = useState(allLobbyes)
    const [lobbyesHistory, setlobbyesHistory] = useState([])
    const [lobbyesActive, setlobbyesActive] = useState([])
    const [ActiveOrHistory, setActiveOrHistory] = useState(false)
    const [user, setuser] = useState('')
    const [rokens, setTokens] = useState([])

    const [tokenn, settokenn] = useState("")
    const [depositt, setdepositt] = useState(false)
    const [nowInLobby, setnowInLobby] = useState(false)
    const [countOfPlayerss, setcountOfPlayerss] = useState(false)
    const [UP, setUP] = useState(true)

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'


    let pdf, body
    const makePDF = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const _user = await signer.getAddress()
        await fetch("/api/pdf", {
            method: "POST",
            body: _user
        }).then(async (data) => {
            body = await data.json()
        })

        pdf = {
            pageOrientation: "landscape",
            content: [
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        body,
                    },
                    layout: {
                        fillColor: function (rowIndex, node, columnIndex) {
                            return (rowIndex % 2 === 0) ? '#2196F3' : '#ffffff';
                        }
                    }

                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 0]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 0]
                },
                tableExample: {
                    margin: [0, 0, 0, 0],
                    fontSize: 7
                },
                tableHeader: {
                    bold: true,
                    fontSize: 10,
                    color: 'black'
                }
            },
        }


        pdfMake.createPdf(pdf).open();
    }
    useEffect(() => {
        makePDF()

    }, [])

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

    const filterUserLobbyes = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            const f = lobbyes.filter((element) => {
                return (element.players.indexOf(_user) !== -1)
            })
            setlobbyesActive(f)
            console.log(f)
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        getTokens()
        filterUserLobbyes()
    }, [user])

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        contract.on("enterLobby", async (creator, id, newPlayer, players, deposit, countOfPlayers, IERC20) => {
            // в теории это сильно может понадобится если я правильно понял как это раотает, к пример по поводу рередрера всей страницы если кто то зашел в какое то лобби но мб это выльется в бесконечные рендеры
            await fetch("/api/getAllLobbyes", {
                method: "POST",
            }).then(async (data) => {
                const temp = await data.json()
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const _user = await signer.getAddress()
                const f = temp.filter((element) => {
                    return (element.players.indexOf(_user) !== -1)
                })
                setlobbyesActive(f)
                setlobbyes(temp)
                ALL_LOBBYES = temp
                console.log(f, temp)
            })
        })
    }, [])

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
                    setTokens(f)
                    settoken(f[0])
                })
            // await fetch('/api/getUserLobbys', {
            //     method: "POST",
            //     body: user
            // })
            //     .then(async (data) => {
            //         const temp = await data.json()
            //         setlobbyesHistory(temp.userLobbyesHistory)
            //         setlobbyesActive(temp.userLobbyes)
            //         console.log("r", temp.userLobbyes)
            //     })
        } catch (err) {
            console.log(err)
        }
    }
    const createNewLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const body = { user, token, countOfPlayers, deposit }
        const tx = await contract.createNewLobby(token, deposit, countOfPlayers)
        await tx.wait()
        try {
            await fetch('/api/createNewLobby', {
                method: "PUT",
                body: JSON.stringify(body)
            })

        } catch (err) {
            console.log(err)
        }

        await fetch('/api/getNewLobby', {
            method: "POST",
            body: user
        }).then(async (data) => {
            data = await data.json()
            setlobbyes([...lobbyes, data])
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

        document.getElementById("deposit").value = "";
        document.getElementById("countofplayers").value = "";
    }

    const setSettingFOrFilter = () => {
        let setting = tokenn
        if (depositt && UP) setting = setting + " deposit_up"
        else if (depositt && !UP) setting = setting + " deposit_down"

        else if (countOfPlayerss && UP) setting = setting + " countOfPlayers_up"
        else if (countOfPlayerss && !UP) setting = setting + " countOfPlayers_down"

        else if (nowInLobby && UP) setting = setting + " nowInLobby_up"
        else if (nowInLobby && !UP) setting = setting + " nowInLobby_down"
        console.log("settings", setting)
        try {
            const filtered = Filter(ALL_LOBBYES.length > lobbyes.length ? ALL_LOBBYES : lobbyes, setting)
            setlobbyes([...filtered])
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />

            </Head>
            <h1 className='titel'>!Mudebz Lobbys</h1>
            <div className='container'>
                <div className='areanewLobby'>
                    <div className='newLobby'>
                        <select onChange={e => settoken(e.target.value)} className="choosetoken">
                            {rokens && rokens.map((element) =>
                                <option>{element}</option>
                            )}
                        </select>
                        <input className='input' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value)} />
                        <input className='input' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} />
                        <button onClick={createNewLobby} className="mybutton">Creat Lobby</button>
                    </div>
                </div>
                <div className='arealobbychoose'>
                    {ActiveOrHistory && lobbyesHistory.map(({ creator, nowInLobby, countOfPlayers, deposit, IERC20, id }) =>
                        <LobbyShablon
                            creator={creator}
                            nowInLobby={nowInLobby}
                            countOfPlayers={countOfPlayers}
                            deposit={deposit}
                            IERC20={IERC20}
                            id={id} />
                    )}
                    {!ActiveOrHistory && lobbyesActive.map(({ creator, nowInLobby, countOfPlayers, deposit, IERC20, id }) =>
                        <LobbyShablon
                            creator={creator}
                            nowInLobby={nowInLobby}
                            countOfPlayers={countOfPlayers}
                            deposit={deposit}
                            IERC20={IERC20}
                            id={id} />
                    )}
                </div>
            </div>
            <div className='con'>
                <div className='areafilterlobby'>
                    <div className='choose'>
                        <div className='UpAndDown'>
                            Active
                            <label className="switch">
                                <input type="checkbox" onChange={() => setActiveOrHistory(!ActiveOrHistory)} />
                                <span className="slider round"></span>
                            </label>
                            History
                        </div>
                        <select onChange={e => settokenn(e.target.value)} className="choosetoken">
                            <option>ALL</option>
                            {rokens && rokens.map((element) =>
                                <option>{element}</option>
                            )}
                        </select>
                        <div className='UpAndDown'>
                            Up
                            <label className="switch">
                                <input type="checkbox" onChange={() => setUP(!UP)} />
                                <span className="slider round"></span>
                            </label>
                            Down
                        </div>

                        <div>
                            <input onChange={() => { setdepositt(true); setnowInLobby(false); setcountOfPlayerss(false) }} type="radio" id="depositt" name="monster" />
                            <label for="depositt" className='choosecoler'>deposit</label><br />
                        </div>
                        <div>
                            <input onChange={() => { setnowInLobby(true); setdepositt(false); setcountOfPlayerss(false) }} type="radio" id="nowInLobby" name="monster" />
                            <label for="nowInLobby" className='choosecoler'>nowInLobby</label><br />
                        </div>
                        <div>
                            <input onChange={() => { setcountOfPlayerss(true); setdepositt(false); setnowInLobby(false); }} type="radio" id="countOfPlayerss" name="monster" />
                            <label for="countOfPlayerss" className='choosecoler'>countOfPlayers</label><br />
                        </div>
                    </div>
                    <button onClick={setSettingFOrFilter} className='mybutton filterbutton'>Filter</button>
                </div>
                <div className='arealobbyes'>
                    {lobbyes && lobbyes.map(({ creator, nowInLobby, countOfPlayers, deposit, IERC20, id }) =>
                        <LobbyShablon
                            creator={creator}
                            nowInLobby={nowInLobby}
                            countOfPlayers={countOfPlayers}
                            deposit={deposit}
                            IERC20={IERC20}
                            id={id} />
                    )}
                </div>
            </div>
        </div>
    )
}



/*

<div>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1 className='createNewLobby'>Create New Lobby</h1>
            <div className='newLobby'>
                <div className='container lobbymenu between'>
                    <select onChange={e => settoken(e.target.value)} className="choosetoken">
                        {rokens && rokens.map((element) =>
                            <option>{element}</option>
                        )}
                    </select>
                    <input className='input' id='deposit' placeholder='Deposit' onChange={e => setdeposit(e.target.value)} />
                    <input className='input' id='countofplayers' placeholder='Count Of Players' onChange={e => setcountOfPlayers(e.target.value)} />
                    <button onClick={createNewLobby} className="mybutton">Creat Lobby</button>
                </div>
            </div>
            <h1 className='createNewLobby'>Enter Lobby</h1>
            <button onClick={RAISE_DEPOSIT}>RAISE_DEPOSIT</button>
            <button onClick={DOWN_DEPOSIT}>DOWN_DEPOSIT</button>
            <button onClick={setSettingFOrFilter}>Filter</button>
            {lobbyes && lobbyes.map(({ creator, nowInLobby, countOfPlayers, deposit, IERC20, id }) =>
                <LobbyShablon
                    creator={creator}
                    nowInLobby={nowInLobby}
                    countOfPlayers={countOfPlayers}
                    deposit={deposit}
                    IERC20={IERC20}
                    id={id} />
            )}

        </div>


*/

