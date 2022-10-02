import { useState, useEffect } from "react";
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
import Image from 'next/image'
import Prom from "./Prom";


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
    useNetwork, useProvider
} from 'wagmi';
import TokensBalancePylt from "./TokenBalancePylt";


export default function WalletAlert({ LOTTERY_ADDRESS, NFT_ADDRESS, settxData, active, setActive, chainId, address, tymblerNaNetwork, txData }) {


    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)
    const [isdecimals, setisdecimals] = useState(false)
    const [Decimals, setDecimals] = useState()

    const [user, setuser] = useState("")
    const [rokens, setTokens] = useState([])

    const [PromSet, setPromSet] = useState(null)
    const [PromInput, setPromInput] = useState(null)

    const [isReliably, setisReliably] = useState(true)

    const provider = useProvider()

    const [Mode, setMode] = useState(true)

    const [TokenSelected, setTokenSelected] = useState()

    const [tokenTransfered, settokenTransfered] = useState(false)

    const [balances, setBalances] = useState([])

    const [AutoEnter, setAutoEnter] = useState([])
    const [ImageInAutoEnter, setImageInAutoEnter] = useState(0)

    const [shouldrevard, setshouldrevard] = useState({})



    useEffect(() => {
        getTokens()
        setBalances([])
    }, [address, chainId, active])


    useEffect(() => {
        checkValidAddress()
    }, [addTokenAddress])


    const checkValidAddress = async () => {
        let flag = true
        rokens.forEach(element => {
            if (element.address == addTokenAddress)
                flag = false
        });
        let sup, dec, symb
        if (flag) {
            try {
                const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(addTokenAddress, A.abi, chainId != 31337 ? provider : providerLocal)
                console.log(contract)
                sup = await contract.totalSupply()//проверка на валидность
                try {
                    dec = await contract.decimals()
                } catch {
                    dec = 18
                }

                try {
                    symb = await contract.symbol()
                } catch {
                    symb = "000"
                }

                console.log("valid")
            } catch (err) {
                console.log(err, "no valid")
            }
        }

        sup != undefined ? setvalid(true) : setvalid(false)
        dec != undefined ? setisdecimals(true) : setisdecimals(false)

        let _flag = false
        if (sup != undefined && dec != undefined)
            _flag = true
        else if (sup != undefined && (parseInt(Decimals) >= 0 && parseInt(Decimals) != NaN))
            _flag = true
        const data = {
            flag: _flag,
            symbol: symb,
            decimals: dec
        }
        return data
    }

    const getTokens = async () => {
        try {
            const body = { user: address, chainId }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(async (data) => {
                    const temp = await data.json()
                    let t, set, In, Auto, f = []
                    if (chainId === 4) {
                        t = temp.tokensETH
                        set = temp.PromSetETH
                        In = temp.PromInputETH
                        Auto = temp.AutoEnterETH
                    }
                    else {
                        t = temp.tokensBNB
                        set = temp.PromSetBNB
                        In = temp.PromInputBNB
                        Auto = temp.AutoEnterBNB
                    }
                    const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
                    const contractLottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, chainId != 31337 ? provider : providerLocal)

                    try {
                        const temp = parseInt(await contractLottery.getshouldRevard(address))
                        const r = parseInt(await contractLottery.getcountOfLotteryEnter(address))
                        console.log(temp, r)
                        const t = {
                            count: temp,
                            isEnteredOnce: r
                        }
                        setshouldrevard(t)
                    } catch (err) {

                    }


                    if (Auto != null) {
                        Auto = Auto.split("_")
                        Auto.pop()
                        Auto.sort((a, b) => {
                            return a - b
                        })
                        let id = 1001
                        try {
                            id = parseInt(await contractLottery.getLotteryCount())
                        } catch (err) {
                            console.log(err)
                        }
                        const temp = []
                        Auto.forEach(async element => {
                            if (element < id) {
                                temp.push(element)
                                Auto.splice(Auto.indexOf(element), 1)
                            }
                        })
                        temp.forEach(async element => {
                            const body = { address, chainId, tokenId: element }
                            await fetch('/api/deleteFromAutoEnter', {
                                method: "POST",
                                body: JSON.stringify(body)
                            })
                        });

                    }
                    if (t != null) {
                        f = t.split("_")
                        f.pop()
                    }

                    const b = {
                        addresses: f,
                        chainId
                    }
                    await fetch('/api/getTokensGlobal', {
                        method: "POST",
                        body: JSON.stringify(b)
                    })
                        .then(async (data) => {
                            const temp = await data.json()
                            const r = f.map((address, index) => {
                                const l = {
                                    address,
                                    symbol: temp[index].symbol,
                                    decimals: temp[index].decimals,
                                    balance: undefined
                                }
                                return l
                            })
                            setPromSet(set)
                            setPromInput(In)
                            setTokens(r)
                            setAutoEnter(Auto)
                        })
                })
        } catch (err) {
            console.log(err)
        }
    }

    function deleteTokenFromFronend(address) {
        console.log(address)
        const temp = []
        rokens.map(element => {
            if (element.address != address)
                temp.push(element)
        });
        console.log(temp)
        setTokens(temp != [] ? temp : [])
    }

    const addToAutoEnter = async () => {
        try {
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
            const tx = await contract.addToAutoEnter(AutoEnter)
            await tx.wait()
            setclicked(false)
            setAutoEnter([])
            document.getElementById("AutoEnter").value = "";
        } catch (err) {
            console.log(err)
        }
    }


    const addToken = async () => {
        const n = new Promise((res) => {
            res(checkValidAddress())
        })
        n.then(async (result) => {
            if (result.flag) {
                const _addTokenAddress = addTokenAddress
                const body = { address, addTokenAddress: _addTokenAddress, chainId, isImageAdded: true, symbol: result.symbol, decimals: result.decimals }
                const data = {
                    address: _addTokenAddress,
                    symbol: result.symbol,
                    decimals: result.decimals,
                    balance: 0
                }
                setTokens([...rokens, data])
                try {
                    await fetch('/api/addToken', {
                        method: "PUT",
                        body: JSON.stringify(body)
                    }).then(() => {
                        getTokens()
                    })

                    document.getElementById("inputToken").value = "";
                    setaddTokenAddress()
                    settryed(false)
                } catch (err) {
                    console.log(err)
                }

                try {
                    await fetch('/api/addTokenGlobal', {
                        method: "POST",
                        body: JSON.stringify(body)
                    })

                } catch {
                    console.log(err)
                }
                setTokenSelected()
            }
            else {
                settryed(true)
            }
            localStorage.setItem("addToken", "true")
        })

        // console.log(isvalid, isdecimals, parseInt(Decimals))

    }

    const makePDF = async () => {
        let data
        try {
            body = { user: address, chainId }
            await fetch("/api/pdf", {
                method: "POST",
                body: JSON.stringify(body)
            }).then(async (_data) => {
                data = await _data.json()
                console.log(data)
            })
        } catch (err) {
            console.log(err)
        }


        const pdf = {
            pageOrientation: "landscape",
            content: [
                {
                    style: 'tableExample',
                    table: {
                        dontBreakRows: true,
                        widths: [17, 170, 170, 100, 170, 35, 35],
                        headerRows: 1,
                        body: data.body,
                    },
                    // layout: {
                    //     fillColor: function (rowIndex, node, columnIndex) {
                    //         return (rowIndex % 2 === 0) ? '#CCCCCC' : '#ffffff';
                    //     }
                    // }
                }
            ],
            styles: data.styles,
        }


        pdfMake.createPdf(pdf).open();
    }

    return (
        <div className={active ? "modall active" : "modall"} onClick={() => {
            setActive(false)
            if (localStorage.getItem("overflow") != "lock")
                document.body.style.overflow = ('overflow', 'auto');
            else
                document.body.style.overflow = ('overflow', 'hidden');
        }}>
            <div className="walletalert" onClick={e => e.stopPropagation()}>

                <div className="dopInfo" onClick={() => setMode(!Mode)} />

                {Mode && <div className="wallettokens">
                    <TokensBalancePylt LOTTERY_ADDRESS={LOTTERY_ADDRESS} NFT_ADDRESS={NFT_ADDRESS} settxData={settxData} tymblerNaNetwork={tymblerNaNetwork} rokens={rokens} setTokenSelected={setTokenSelected} TokenSelected={TokenSelected} user={address} chainId={chainId} setisReliably={setisReliably} settokenTransfered={settokenTransfered} />
                    {rokens && rokens.map((element) =>
                        <TokensBalanceShablon LOTTERY_ADDRESS={LOTTERY_ADDRESS} txData={txData} NFT_ADDRESS={NFT_ADDRESS} settxData={settxData} rokens={rokens} tymblerNaNetwork={tymblerNaNetwork} tokenTransfered={tokenTransfered} setTokenSelected={setTokenSelected} TokenSelected={TokenSelected} user={address} element={element} chainId={chainId} settokenTransfered={settokenTransfered} setisReliably={setisReliably} deleteTokenFromFronend={deleteTokenFromFronend} />
                    )}
                </div>}

                {!Mode && <div className="">
                    <div>
                        <div className="areaProm">
                            <Prom LOTTERY_ADDRESS={LOTTERY_ADDRESS} NFT_ADDRESS={NFT_ADDRESS} shouldrevard={shouldrevard} settxData={settxData} address={address} PromSet={PromSet} PromInput={PromInput} setPromInput={setPromInput} setPromSet={setPromSet} chainId={chainId} tymblerNaNetwork={tymblerNaNetwork} />
                        </div>
                        <div className="underProm">
                            {AutoEnter && AutoEnter.length > 0 ?
                                <div className="AutoEnter">
                                    <div className="areaimageINAutoEnter">
                                        <div className="arow DEG180" onClick={() => { if (ImageInAutoEnter != 0) { setImageInAutoEnter(parseInt(ImageInAutoEnter) - 1) } }}>
                                            <Image src={"/rigth.png"} width={30} height={30} />
                                        </div>
                                        <div className="imageINAutoEnter">
                                            <Image src={`/${chainId == 31337 ? "imagesETH" : "imagesBNB"}/${AutoEnter[ImageInAutoEnter]}.png`} width={160} height={160} className="ff" />
                                        </div>
                                        <div className="arow" onClick={() => { if (ImageInAutoEnter != AutoEnter.length - 1) { setImageInAutoEnter(parseInt(ImageInAutoEnter) + 1) } }}>
                                            <Image src={"/rigth.png"} width={30} height={30} />
                                        </div>
                                    </div>
                                    <div className="listAutoEnter">
                                        <div className="listAutoEnterA">
                                            {AutoEnter.map((e, i) => { if (i != ImageInAutoEnter) { return <div style={{ padding: "0px 2px" }}>{`${e}`}</div> } else { return <div style={{ color: "purple", padding: "0px 2px" }}>{`${e}`}</div> } })}
                                        </div>
                                    </div>
                                    <div className="buttonAutoEnter">
                                        <button className="mybutton" onClick={() => addToAutoEnter()}>Pay entrance to selected {`${AutoEnter.length * 5} USDT`}</button>
                                    </div>
                                </div> :
                                <div className="AutoEnter" />}
                            <div className="yaxz">
                                <div className="PDF">
                                </div>
                                <div className="MudebzInfo">
                                </div>
                            </div>
                        </div>
                        <div className="addToken">
                            <div>
                                <input className={isvalid && !isdecimals ? "input small" : "input big"} id="inputToken" placeholder="Token Address" onChange={e => setaddTokenAddress(e.target.value)} />
                            </div>
                            {(!isvalid && tryed) && <div className="invalid">Invalid Address</div>}
                            <div>
                                <button onClick={() => addToken()} className="mybutton" >Add new token</button>
                            </div>
                        </div>
                    </div>
                </div>
                }


            </div>


        </div >
    )
}
