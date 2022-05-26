import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { PrismaClient } from '@prisma/client';
import LobbyShablon from '../components/LobbyShablon'
import Filter from '../components/Filter';

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


    const ALL_LOBBYES = allLobbyes


    const [deposit, setdeposit] = useState(0)
    const [countOfPlayers, setcountOfPlayers] = useState(0)
    const [LobbyCreator, setLobbyCreator] = useState('')
    const [LobbyId, setLobbyId] = useState(0)
    const [token, settoken] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const [tokenForFilter, settokenForFolter] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3')
    const [lobbyes, setlobbyes] = useState(allLobbyes)
    const [user, setuser] = useState('')
    const [rokens, setTokens] = useState([])

    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

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
        getTokens()
    }, [user])

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        contract.on("enterLobby", async (creator, user, LobbyId) => {
            await fetch("/api/getAllLobbyes", {
                method: "POST",
            }).then(async (data) => {
                const temp = await data.json()
                setlobbyes(temp)
            })
        })
    }, [])

    const getTokens = async () => {
        try {
            await fetch('/api/getTokens', {
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
        } catch (err) {
            console.log(err)
        }
    }

    const getLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        try {
            console.log(await contract.getLobby("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 4))
        }
        catch (err) { console.log(err) }
    }
    //getLobby()

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

        document.getElementById("deposit").value = "";
        document.getElementById("countofplayers").value = "";
    }
    const setSettingFOrFilter = () => {
        let setting = ''
        //setting = setting + " deposit_up"
        //setting = setting + " 0x5FbDB2315678afecb367f032d93F642f64180aa3"
        //setting = setting + " countOfPlayers_down"
        setting = setting + " nowInLobby_up"
        const filtered = Filter(lobbyes, setting)
        setlobbyes([...filtered])
    }

    const RAISE_DEPOSIT = async () => {
        lobbyes.sort((a, b) => {
            return a.deposit - b.deposit
        })
        setlobbyes([...lobbyes])
    }

    const DOWN_DEPOSIT = async () => {
        lobbyes.sort((a, b) => {
            return b.deposit - a.deposit
        })
        setlobbyes([...lobbyes])
    }


    return (
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
    )
}

