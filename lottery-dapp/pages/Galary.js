import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "/blockchain/Lottery.json"
import MudebzNFT from "/blockchain/MudebzNFT.json"
import metadataETH from "/blockchain/metadataETH.json"
import NftsShablon from '/components/NftsShablon'
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB, ETHid, BNBid, INFURA_KEY, ALCHEMY_KEY } from '/components/Constants.js';

import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    useNetwork,
    useProvider,
    useSigner,
    usePrepareContractWritde
} from 'wagmi';

import InfoPopUp from '../components/InfoPopUp';
import { shuffled } from 'ethers/lib/utils';
import { listenerCount } from 'process';



export default function Home({ LOTTERY_ADDRESS, NFT_ADDRESS, chainId, ENTERED, setENTERED, tymblerNaNetwork, setIsSession, isSession, settxData, setneedWallet }) {


    const kek = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]

    const [DATA, setDATA] = useState([])

    const [NFTS, setNFTS] = useState([])
    const [tokensMints, settokensMints] = useState([])
    const [tokensNotMints, settokensNotMints] = useState([])

    const [ALL_OR_MINTS, setALL_OR_MINTS] = useState(1)

    const provider = useProvider()
    const { data } = useSigner()
    const { address, isConnected } = useAccount()

    const [iskek, setIsKek] = useState(true)

    const [LotteryId, setLotteryId] = useState()

    const [NotShuffle, setNotShuffle] = useState()

    const [search, setsearch] = useState("")
    const [costil, setcostil] = useState(false)

    useEffect(() => {
        if (ENTERED)
            setNFT()
    }, [ENTERED])


    useEffect(() => {
        checkLotteryId()
    }, [LOTTERY_ADDRESS])

    const checkLotteryId = async () => {
        try {
            let providerr
            if (tymblerNaNetwork)
                providerr = new ethers.providers.InfuraProvider("goerli", INFURA_KEY)
            else
                providerr = new ethers.providers.InfuraProvider("sepolia", INFURA_KEY)
            if (chainId == 31337)
                providerr = new ethers.providers.JsonRpcProvider
            console.log(providerr)
            const contractLottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, providerr)
            const id = parseInt(await contractLottery.getLotteryCount())
            setLotteryId(id)
            const dita = await contractLottery.getLotteryShablonByIndex(id - 1)
            const body = { tokenId: id - 1, chainId, players: parseInt(dita.playersCount) }
            await fetch('/api/update1000', {
                method: "POST",
                body: JSON.stringify(body)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const setNFT = async () => {
        let list = []
        let listTransferCount = []
        let usertokens = []
        let autoenter = []
        let messages = []
        let AutoEnterFromDB = []
        let Prices = []
        let Players = []





        // autoenter
        if (isConnected) {
            try {
                const body = { user: address, chainId: tymblerNaNetwork ? ETHid : BNBid }
                await fetch('/api/getUserData', {
                    method: "POST",
                    body: JSON.stringify(body)
                }).then(async (data) => {
                    const temp = await data.json()
                    if (chainId == ETHid) {
                        if (temp.AutoEnterETH != null) {
                            AutoEnterFromDB = temp.AutoEnterETH.split("_")
                        }
                    }
                    else {
                        if (temp.AutoEnterBNB != null) {
                            AutoEnterFromDB = temp.AutoEnterBNB.split("_")
                        }
                    }
                    AutoEnterFromDB.pop()
                    AutoEnterFromDB.sort((a, b) => {
                        return a - b
                    })

                    // console.log(AutoEnterFromDB)
                })
            }
            catch (err) {
                console.log(err)
            }
        }


        // узнаем какие заминчены
        try {
            await fetch('/api/get1000', {
                method: "POST",
                body: chainId != 0 ? chainId : (tymblerNaNetwork ? ETHid : BNBid)
            }).then(async (data) => {
                const temp = await data.json()
                temp.sort((a, b) => {
                    return a.id - b.id
                })
                console.log(temp)
                temp.forEach(element => {
                    if (element.isMinted)
                        list.push(element.id)
                    if (element.message != null)
                        messages.push({
                            id: element.id,
                            message: element.message
                        })
                    Players.push(element.players)
                    Prices.push(element.price)
                })
                console.log(list, messages)
            })

        } catch (err) {
            console.log(err)
        }


        // сколько доступно перемещений
        if (list != []) {
            try {
                let providerr
                if (tymblerNaNetwork)
                    providerr = new ethers.providers.InfuraProvider("goerli", INFURA_KEY)
                else
                    providerr = new ethers.providers.InfuraProvider("sepolia", INFURA_KEY)
                if (chainId == 31337)
                    providerr = new ethers.providers.JsonRpcProvider
                const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, providerr)
                const promises = list.map(async (item) => {
                    return await new Promise(async resolve => {
                        try {
                            const count = await contract.getTokenTransferCount(item)
                            console.log(count)
                            const body = {
                                transfers: parseInt(count),
                                tokenId: item
                            }
                            resolve(body)
                        } catch (err) {
                            console.log(err)
                            resolve(0)
                        }
                    });
                }
                );
                await Promise.all(promises).then((data) => {
                    listTransferCount = [...data, 0]
                })
            } catch (err) {
                console.log(err)
            }


        }

        // какими владеет поьзователь 
        if (isConnected) {
            try {
                const contract = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, provider)
                const tx = await contract.getTokensForAddress(address)
                usertokens = tx.ids.map(element => {
                    return (parseInt(element))
                });

                usertokens = usertokens.sort((a, b) => {
                    return a - b
                })

                //Autoenter
                const contractLottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)
                const id = await contractLottery.getLotteryCount()
                const data = await contractLottery.getAutoEnter(address)
                let temp = data.map((element) => {
                    if (parseInt(element) > id)
                        return parseInt(element)
                })
                autoenter = temp.sort((a, b) => {
                    return a - b
                })
            } catch (err) {
                console.log(err)
                usertokens = [-1]
            }
        }

        // minted
        let minted = []
        let notMinted = []
        for (let i = 1, j = 0, x = 0, y = 0, mes = 0, autoEnterbd = 0, Tcount = 0; i < 1001; i++) {
            if (list[j] === i) {
                const ismints = true
                const isowner = usertokens[x] == i
                if (isowner)
                    x++
                const edition = list[j]
                const message = messages[mes]?.id == i ? messages[mes].message : null
                if (message)
                    mes++
                const TransferCount = listTransferCount[Tcount++].transfers
                const body = { ismints, isowner, edition, message, TransferCount, price: Prices[i - 1], players: Players[i - 1], date: metadataETH[i - 1].date }
                minted.push(body)
                j++
            }
            else {
                const edition = i
                const isAutoEnter = autoenter[y] == i
                if (isAutoEnter)
                    y++
                const autoEnterBD = AutoEnterFromDB[autoEnterbd] == i
                if (autoEnterBD && AutoEnterFromDB.length != autoEnterbd + 1)
                    autoEnterbd++
                const body = { edition, isAutoEnter, autoEnterBD, TransferCount: 0, price: Prices[i - 1], players: Players[i - 1], date: metadataETH[i - 1].date }
                notMinted.push(body)
            }
        }

        //all
        let all = []
        let noshuffled = []
        for (let i = 1, j = 0, x = 0, y = 0, z = 0, autoEnterbd = 0, mes = 0, Tcount = 0; i < 1001; i++) {
            const ismints = list[z] == i
            if (ismints)
                z++
            const isowner = usertokens[x] == i
            if (isowner)
                x++
            const isAutoEnter = autoenter[y] == i
            if (isAutoEnter)
                y++
            const autoEnterBD = AutoEnterFromDB[autoEnterbd] == i
            if (autoEnterBD && AutoEnterFromDB.length != autoEnterbd + 1)
                autoEnterbd++
            const message = messages[mes]?.id == i ? messages[mes].message : null
            if (message)
                mes++
            const TransferCount = listTransferCount[Tcount]?.tokenId == i ? listTransferCount[Tcount].transfers : 0
            if (TransferCount > 0 && listTransferCount.length > Tcount + 1)
                Tcount++
            const body = { ismints, isowner, edition: i, isAutoEnter, autoEnterBD, message, TransferCount, price: Prices[i - 1], players: Players[i - 1], date: metadataETH[i - 1].date }
            all.push(body)
            noshuffled.push(body)
            if (j !== list.length - 1)
                j++
        }


        const shuffled = shuffledArr(all)
        setNotShuffle(noshuffled)
        setNFTS(shuffled)
        setDATA(shuffled)
        setsearch("")
        try {
            document.getElementById("search").value = "";
        } catch (err) { }

        settokensMints(minted)
        settokensNotMints(notMinted)



        sessionStorage.setItem("all", JSON.stringify(shuffled))
        sessionStorage.setItem("minted", JSON.stringify(minted))
        sessionStorage.setItem("notMinted", JSON.stringify(notMinted))
        sessionStorage.setItem("chaindata", JSON.stringify({ tymblerNaNetwork, address }))
        sessionStorage.setItem("notShuffle", JSON.stringify(noshuffled))
        setIsSession(false)

        console.log(minted, notMinted)
        setIsKek(false)
        if (ENTERED)
            setENTERED(false)
    }

    const shuffledArr = (arr) => {
        const temp = arr
        return temp.sort(() => {
            return Math.random() - 0.5;
        });
    }

    useEffect(() => {
        // setNFT()
        if (!isSession || tymblerNaNetwork != JSON.parse(sessionStorage.getItem("chaindata"))?.tymblerNaNetwork || address != JSON.parse(sessionStorage.getItem("chaindata"))?.address) {
            setNFT()
        }
        else {
            setNFTS(JSON.parse(sessionStorage.getItem("all")))
            setDATA(JSON.parse(sessionStorage.getItem("all")))
            settokensMints(JSON.parse(sessionStorage.getItem("minted")))
            settokensNotMints(JSON.parse(sessionStorage.getItem("notMinted")))
            setNotShuffle(JSON.parse(sessionStorage.getItem("notShuffle")))
            setIsKek(false)
        }
    }, [chainId, tymblerNaNetwork, address])


    const [startIndex, setstartIndex] = useState(1)
    const [countOfRenderNfts, setcountOfRenderNfts] = useState(25)


    useEffect(() => {
        const temp = localStorage.getItem("ENOUGTH")
        if (temp > 0) {
            setcountOfRenderNfts(parseInt(temp))
            document.getElementById("enougth").value = temp;
        }
    }, [])

    const changeState = (isup, isbuttom) => {
        if (isbuttom)
            window.scrollTo(0, 0)
        if (isup) {
            const first = parseInt(countOfRenderNfts) + parseInt(startIndex)
            console.log(first, metadataETH)
            if (first < metadataETH.length)
                setstartIndex(first)
            else {
                const t = metadataETH.length - countOfRenderNfts + 1
                setstartIndex(t)
            }

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
        return (index >= startIndex && index < countOfRenderNfts + startIndex)
    }

    useEffect(() => {
        if (costil)
            filter()
    }, [search])

    // console.log(NFTS, tokensMints, tokensNotMints, ALL_OR_MINTS)

    const filter = () => {
        const temp = []
        if (search == "s") {
            setNFTS(NotShuffle)
        }
        else if (search[0] == "s") {
            setstartIndex(1)
            NotShuffle.map((element) => {
                if (`.${element.edition}` == search) {
                    temp.push(element)
                }
            })
            setNFTS(temp)
        }
        else if (search === '') {
            setNFTS(DATA)
        }
        else if (search == "a" || search == "а") {
            NotShuffle.map((element) => {
                if (element.autoEnterBD || element.isAutoEnter) {
                    temp.push(element)
                }
            })
            setNFTS(temp)
        }
        else if (search == "m") {
            NotShuffle.map((element) => {
                if (element.isowner) {
                    temp.push(element)
                }
            })
            setNFTS(temp)
        }
        else {
            setstartIndex(1)
            NotShuffle.map((element) => {
                if (`${element.edition}`.indexOf(search) !== -1) {
                    temp.push(element)
                }
            })
            setNFTS(temp)
        }
    }



    return (
        <div className='areaNfts MAIN_MARGIG'>
            <Head>
                <title>!MuDeBz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
            </Head>
            <div className='fiter'>
                <div className='anotherShit'>
                    <button className='mybutton butound' onClick={() => changeState(false, false)}>Back</button>
                    <div style={{ position: "relative" }}>
                        <input className='input' id="search" style={{ width: 70 }} placeholder='Search' onChange={e => {
                            setcostil(true)
                            setTimeout(() => {
                                setsearch(e.target.value)
                            }, 300);
                        }} />
                        <div className='searchI' onClick={() => { const temp = (search == "" ? "s" : search == "s" ? "a" : search == "a" ? "m" : ""); setcostil(true); setsearch(temp); document.getElementById("search").value = `${temp}`; }}>
                            <Image src={"/i.png"} width={"16px"} height="20px" />
                            <div className='searchIINFO'>
                                <div style={{ display: 'grid' }}>
                                    <div className='ttete'>
                                        s - sort
                                    </div>
                                    <div className='ttete'>
                                        a - autoenter
                                    </div >
                                    <div className='ttete'>
                                        m - my NFT
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <label className="switch zx">
                        <input type="checkbox" onChange={() => setALL_OR_MINTS(ALL_OR_MINTS == 1 ? 2 : (ALL_OR_MINTS == 2 ? 3 : 1))} />
                        <span className={ALL_OR_MINTS == 1 ? "slider round" : ALL_OR_MINTS == 2 ? "sliderGREEN round" : "sliderRED round"} style={{ minWidth: "60px" }}></span>


                    </label>
                    <select className="choosetoken" style={{ minWidth: "40px" }} id="enougth" onClick={(e) => { localStorage.setItem("ENOUGTH", e.target.value); setcountOfRenderNfts(parseInt(e.target.value)) }}>
                        <option>5</option>
                        <option>25</option>
                        <option>100</option>
                        <option>250</option>
                        <option>1000</option>
                    </select>
                    <button className='mybutton butound' onClick={() => changeState(true, false)}>Next</button>
                </div>
            </div>

            <div className='data'>
                {(ALL_OR_MINTS == 1 ? NFTS : ALL_OR_MINTS == 2 ? tokensMints : tokensNotMints).map((element, index) => isEnogth(index + 1) && < NftsShablon LOTTERY_ADDRESS={LOTTERY_ADDRESS} NFT_ADDRESS={NFT_ADDRESS} setneedWallet={setneedWallet} setNFTS={setNFTS} settxData={settxData} Data={element} chainId={chainId} tymblerNaNetwork={tymblerNaNetwork} LotteryId={LotteryId} />)}
                {iskek && kek.map(() =>
                    <div className='nftsShablon'>
                        <div className='pad'>
                            <div className='bordernft'></div></div></div>
                )}

            </div>
            {(ALL_OR_MINTS == 1 ? NFTS : ALL_OR_MINTS == 2 ? tokensMints : tokensNotMints).length > countOfRenderNfts && <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>
                    <button className='mybutton' onClick={() => changeState(false, true)}>Back</button>
                    <button className='mybutton' onClick={() => changeState(true, true)}>Next</button>
                </div>
            </div>}


        </div >
    )
}