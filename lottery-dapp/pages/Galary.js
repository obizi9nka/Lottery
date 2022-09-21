import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import metadataETH from "C:/Lottery/lottery-dapp/metadats/metadataETH.json"
import metadataBNB from "C:/Lottery/lottery-dapp/metadats/metadataBNB.json"
import NftsShablon from '../components/NftsShablon'
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")

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



export default function Home({ tymblerNaNetwork, setIsSession, isSession, settxData }) {


    const kek = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]

    const [DATA, setDATA] = useState([])

    const [NFTS, setNFTS] = useState([])
    const [tokensMints, settokensMints] = useState([])
    const [tokensNotMints, settokensNotMints] = useState([])

    const [ALL_OR_MINTS, setALL_OR_MINTS] = useState(1)

    const [chainId, setchainId] = useState(0)

    const { chain } = useNetwork()
    const provider = useProvider()
    const { address, isConnected } = useAccount()

    const [iskek, setIsKek] = useState(true)

    const [LotteryId, setLotteryId] = useState()

    const [NotShuffle, setNotShuffle] = useState()

    useEffect(() => {
        if (chain != undefined && isConnected) {
            setchainId(chain?.id)
            // setNFTS(chain.id == 4 ? metadataETH : metadataBNB)
        }
        else
            setchainId(0)
    }, [chain])


    useEffect(() => {
        checkLotteryId()
    }, [chainId])

    const checkLotteryId = async () => {
        try {
            const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
            const contractLottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, chainId != 31337 ? provider : providerLocal)
            const id = await contractLottery.getLotteryCount()
            setLotteryId(parseInt(id))
        } catch (err) {
            console.log(err)
            setLotteryId(undefined)
        }
    }


    const setNFT = async () => {
        setIsKek(true)
        let list = []
        let usertokens = []
        let autoenter = []
        let messages = []
        let AutoEnterFromDB = []





        // autoenter
        if (isConnected) {
            try {
                const body = { user: address, chainId: chainId != 0 ? chainId : (tymblerNaNetwork ? 4 : 31337) }
                await fetch('/api/getUserData', {
                    method: "POST",
                    body: JSON.stringify(body)
                }).then(async (data) => {
                    const temp = await data.json()
                    // let messages
                    // if (chainId == 4) {
                    //     if (temp.messageETH != null) {
                    //         messages = temp.messageETH.split("_")
                    //     }
                    // }
                    // else {
                    //     if (temp.messageBNB != null) {
                    //         messages = temp.messageBNB.split("_")
                    //     }
                    // }
                    // message.map((element) => {
                    //     console.log(element.splice(0, 3))
                    // })

                    if (chainId == 4) {
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
                body: chainId != 0 ? chainId : (tymblerNaNetwork ? 4 : 31337)
            }).then(async (data) => {
                const temp = await data.json()
                temp.forEach(element => {
                    if (element.isMinted)
                        list.push(element.id)
                    if (element.message != null)
                        messages.push({
                            id: element.id,
                            message: element.message
                        })
                })
                console.log(list, messages)
            })
            // let provider
            // if (tymblerNaNetwork)
            //     provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            // else
            //     provider = new ethers.providers.JsonRpcProvider

            // const contract = new ethers.Contract(tymblerNaNetwork ? MudeBzNFTETH : MudeBzNFTLocalhost, MudebzNFT.abi, provider)
            // const tx = await contract.gettokensMints()
            // if (tx.length > 0) {
            //     list = tx.map(element => {
            //         return (parseInt(element))
            //     });
            //     list.sort((a, b) => {
            //         return a - b
            //     })

            // }
        } catch (err) {
            console.log(err)
        }

        // какими владеет поьзователь 
        if (isConnected) {
            try {
                const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, chainId != 31337 ? provider : providerLocal)
                const tx = await contract.getTokensForAddress(address)
                usertokens = tx.ids.map(element => {
                    return (parseInt(element))
                });

                usertokens = usertokens.sort((a, b) => {
                    return a - b
                })

                //Autoenter
                if (chainId === 31337) {
                    const contractLottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, chainId != 31337 ? provider : providerLocal)
                    const id = await contractLottery.getLotteryCount()
                    const data = await contractLottery.getAutoEnter(address)
                    let temp = data.map((element) => {
                        if (element > id)
                            return parseInt(element)
                    })
                    autoenter = temp.sort((a, b) => {
                        return a - b
                    })
                }

            } catch (err) {
                console.log(err)
                usertokens = [-1]
            }
        }


        // minted
        let minted = []
        let notMinted = []
        for (let i = 1, j = 0, x = 0, y = 0, mes = 0, autoEnterbd = 0; i < 1001; i++) {
            if (list[j] === i) {
                const ismints = true
                const isowner = usertokens[x] == i
                if (isowner)
                    x++
                const edition = list[j]
                const message = messages[mes]?.id == i ? messages[mes].message : null
                if (message)
                    mes++
                const body = { ismints, isowner, edition, isOnSell: null, message }
                minted.push(body)
                if (j !== list.length - 1)
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
                const body = { edition, isAutoEnter, autoEnterBD }
                notMinted.push(body)
                if (j !== list.length - 1)
                    j++
            }
        }

        //all
        let all = []
        let noshuffled = []
        for (let i = 1, j = 0, x = 0, y = 0, z = 0, autoEnterbd = 0, mes = 0; i < 1001; i++) {
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
            const body = { ismints, isowner, edition: i, isAutoEnter, autoEnterBD, isOnSell: null, message }
            all.push(body)
            noshuffled.push(body)
            if (j !== list.length - 1)
                j++
        }


        const shuffled = shuffledArr(all)
        setNotShuffle(noshuffled)
        setNFTS(shuffled)
        setDATA(shuffled)

        settokensMints(minted)
        settokensNotMints(notMinted)



        sessionStorage.setItem("all", JSON.stringify(all))
        sessionStorage.setItem("minted", JSON.stringify(minted))
        sessionStorage.setItem("notMinted", JSON.stringify(notMinted))
        sessionStorage.setItem("chaindata", JSON.stringify(tymblerNaNetwork))
        setIsSession(false)

        console.log(minted, notMinted)
        setIsKek(false)
    }

    const shuffledArr = (arr) => {
        const temp = arr
        return temp.sort(() => {
            return Math.random() - 0.5;
        });
    }


    useEffect(() => {
        // setNFT()
        setLotteryId()
        if (!isSession || tymblerNaNetwork != JSON.parse(sessionStorage.getItem("chaindata")))
            setNFT()
        else {
            setNFTS(JSON.parse(sessionStorage.getItem("all")))
            setDATA(JSON.parse(sessionStorage.getItem("all")))
            settokensMints(JSON.parse(sessionStorage.getItem("minted")))
            settokensMints(JSON.parse(sessionStorage.getItem("notMinted")))
            setIsKek(false)
        }
    }, [chainId, address, tymblerNaNetwork])



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
        // settxData({
        //     isPending: true,
        //     pesult: null
        // })
        // setTimeout(() => {
        //     settxData({
        //         isPending: false,
        //         result: true
        //     })
        // }, 2000);

    }

    const isEnogth = (index) => {
        return (index >= startIndex && index < countOfRenderNfts + startIndex)
    }


    const filter = (search) => {
        if (search == ".") {
            setNFTS(NotShuffle)
        }
        else if (search === '') {
            setNFTS(DATA)
        } else {
            setstartIndex(1)
            const temp = []
            NotShuffle.map((element) => {
                if (`${element.edition}`.indexOf(search) !== -1) {
                    temp.push(element)
                }
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
            <div className='areaFiter'>
                <div className='fiter'>
                    <div className='anotherShit'>
                        <button className='mybutton' onClick={() => changeState(false, false)}>Back</button>
                        <input className='input' style={{ width: 90 }} placeholder='Search' onChange={e => {
                            setTimeout(() => {
                                filter(e.target.value)
                            }, 400);
                        }} />
                        <label className="switch zx">
                            <input type="checkbox" onChange={() => setALL_OR_MINTS(ALL_OR_MINTS == 1 ? 2 : (ALL_OR_MINTS == 2 ? 3 : 1))} />
                            <span className={ALL_OR_MINTS == 1 ? "slider round" : ALL_OR_MINTS == 2 ? "sliderGREEN round" : "sliderRED round"} ></span>
                        </label>
                        <select className="choosetoken" id="enougth" onClick={(e) => { localStorage.setItem("ENOUGTH", e.target.value); setcountOfRenderNfts(parseInt(e.target.value)) }}>
                            <option>25</option>
                            <option>100</option>
                            <option>250</option>
                            <option>1000</option>
                        </select>
                        <button className='mybutton' onClick={() => changeState(true, false)}>Next</button>
                    </div>
                </div>
            </div>

            <div className='data'>
                {ALL_OR_MINTS == 1 && NFTS.map((element, index) => isEnogth(index + 1) && < NftsShablon settxData={settxData} Data={element} chainId={chainId} tymblerNaNetwork={tymblerNaNetwork} LotteryId={LotteryId} />)}
                {ALL_OR_MINTS == 2 && tokensMints.map((element, index) => isEnogth(index + 1) && < NftsShablon settxData={settxData} Data={element} chainId={chainId} tymblerNaNetwork={tymblerNaNetwork} LotteryId={LotteryId} />)}
                {ALL_OR_MINTS == 3 && tokensNotMints.map((element, index) => isEnogth(index + 1) && < NftsShablon settxData={settxData} Data={element} chainId={chainId} tymblerNaNetwork={tymblerNaNetwork} LotteryId={LotteryId} />)}
                {iskek && kek.map(() =>
                    <div className='nftsShablon'>
                        <div className='pad'>
                            <div className='bordernft'></div></div></div>
                )}

            </div>
            <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>
                    <button className='mybutton' onClick={() => changeState(false, true)}>Back</button>
                    <button className='mybutton' onClick={() => changeState(true, true)}>Next</button>
                </div>
            </div>


        </div >
    )
}