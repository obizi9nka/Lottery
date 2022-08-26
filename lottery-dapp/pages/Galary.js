import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import metadata from "C:/Lottery/nfts/hashlips_art_engine/build/json/_metadata.json"
import NftsShablon from '../components/NftsShablon'
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")




export async function getServerSideProps() {
    let isMINTS = []
    let list = []
    try {
        let provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
        const contract = new ethers.Contract(MudeBzNFTETH, MudebzNFT.abi, provider)
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

    const [DATA, setDATA] = useState([])

    const [user, setuser] = useState('')

    const [NFTS, setNFTS] = useState(metadata)

    const [tokensMints, settokensMints] = useState([])
    const [ALL_OR_MINTS, setALL_OR_MINTS] = useState(false)

    const [chainId, setchainId] = useState(0)

    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()


            setuser(_user)
        } catch (err) {
            console.log("Connect Wallet", err)
            setuser("")
        }
    }




    const checkChain = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const chain = await provider.getNetwork()

        if (chain.chainId == 31337) {
            setchainId(31337)
        }
        else if (chain.chainId == 4) {
            setchainId(4)
        }
        else {
            setchainId(0)
        }
    }

    useEffect(() => {
        checkChain()
    }, [])

    useEffect(() => {
        setUser()
    }, [chainId])

    useEffect(() => {
        window.ethereum.on('chainChanged', () => {
            checkChain()
        })
        window.ethereum.on("accountsChanged", (data) => {
            setUser()
        });
    }, [])




    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
        const contractM = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)

        contract.once("play", async (winer) => {
            setNFT()
        })
        contractM.once("NewNFT", async (user, id) => {
            setNFT()
        })
    }, [])

    const setNFT = async () => {
        let list = []
        let usertokens = []
        let autoenter = []

        // узнаем какие заминчены
        try {
            let provider
            if (chainId == 4)
                provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            else
                provider = new ethers.providers.JsonRpcProvider

            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            const tx = await contract.gettokensMints()
            if (tx.length > 0) {


                list = tx.map(element => {
                    return (parseInt(element))
                });
                list.sort((a, b) => {
                    return a - b
                })

            }
        } catch (err) {
            console.log(err)
        }

        // какими владеет поьзователь 
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(chainId === 4 ? MudeBzNFTETH : chainId === 31337 ? MudeBzNFTLocalhost : MudeBzNFTBNB, MudebzNFT.abi, provider)
            const USER = await singer.getAddress()
            const tx = await contract.getTokensForAddress(USER)
            usertokens = tx.ids.map(element => {
                return (parseInt(element))
            });

            usertokens = usertokens.sort((a, b) => {
                return a - b
            })

            //Autoenter
            if (chainId === 31337) {
                const contractLottery = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
                const id = await contractLottery.getLotteryCount()
                const data = await contractLottery.getAutoEnter(_user)
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



        // minted
        let minted = []
        for (let i = 1, j = 0, x = 0, y = 0; i < 1001; i++) {
            if (list[j] === i) {
                const ismints = true
                const isowner = usertokens[x] == i
                if (isowner)
                    x++
                const edition = list[j]
                const isAutoEnter = autoenter[y] == i
                if (isAutoEnter)
                    y++
                const body = { ismints, isowner, edition, isAutoEnter }
                minted.push(body)
                if (j !== list.length - 1)
                    j++
            }
        }

        //all
        let all = []
        for (let i = 1, j = 0, x = 0, y = 0, z = 0; i < 1001; i++) {
            const ismints = list[z] == i
            if (ismints)
                z++
            const isowner = usertokens[x] == i
            if (isowner)
                x++
            const isAutoEnter = autoenter[y] == i
            if (isAutoEnter)
                y++
            const body = { ismints, isowner, edition: i, isAutoEnter }
            all.push(body)
            if (j !== list.length - 1)
                j++
        }

        setNFTS(all)
        setDATA(all)

        console.log(usertokens, all, minted)

        settokensMints(minted)
    }


    useEffect(() => {
        setNFT()
    }, [chainId, user])



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
            if (first < metadata.length)
                setstartIndex(first)
            else {
                const t = 300 - countOfRenderNfts + 1
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

    const filter = (search) => {
        console.log(search)
        if (search === '') {
            setNFTS(DATA)
        } else {
            setstartIndex(1)
            const temp = []
            DATA.map((element) => {
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
                        <button className='mybutton' onClick={() => changeState(false, false)}>Back</button>
                        <button className='mybutton' onClick={() => changeState(true, false)}>Next</button>
                    </div>
                </div>
            </div>

            <div className='data'>
                {NFTS.length == 0 &&
                    <h1 className='titel' style={{ padding: " 30px 39.7vw 0px 39.7vw" }} >Empty</h1>}
                {!ALL_OR_MINTS && chainId > 0 && NFTS.map((element, index) => isEnogth(index + 1) && < NftsShablon data={element} chainId={chainId} />)}
                {ALL_OR_MINTS && chainId > 0 && tokensMints.map((element, index) => isEnogth(index + 1) && < NftsShablon data={element} chainId={chainId} />)}

            </div>
            <div className='areaFiter'>
                <div className='BackNext' style={{ width: 300 }}>
                    <button className='mybutton' onClick={() => changeState(false, true)}>Back</button>
                    <button className='mybutton' onClick={() => changeState(true, true)}>Next</button>
                </div>
            </div>


        </div>
    )
}
