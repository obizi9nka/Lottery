import { useState, useEffect } from "react";
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
import Prom from "./Prom";
import { parse } from "path";


export default function WalletAlert({ active, setActive, chainId }) {


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


    const setUser = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const _user = await signer.getAddress()
            setuser(_user)
        } catch (err) {
            console.log()
        }
    }
    setUser()


    useEffect(() => {
        if (chainId > 0)
            getTokens()
    }, [user, chainId])


    useEffect(() => {
        checkValidAddress()
    }, [addTokenAddress])

    const checkValidAddress = async () => {
        let flag = true
        rokens.forEach(element => {
            if (element == addTokenAddress)
                flag = false
        });
        let sup, dec
        if (flag) {
            try {
                // console.log(addTokenAddress)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const contract = new ethers.Contract(addTokenAddress, A.abi, provider)
                sup = await contract.totalSupply()//проверка на валидность
                dec = await contract.decimals()
                // console.log("valid")
            } catch (err) {
                // console.log("no valid")
            }
        }

        sup != undefined ? setvalid(true) : setvalid(false)
        dec != undefined ? setisdecimals(true) : setisdecimals(false)

        let _flag = false
        if (sup != undefined && dec != undefined)
            _flag = true
        else if (sup != undefined && (parseInt(Decimals) >= 0 && parseInt(Decimals) != NaN))
            _flag = true
        return _flag
    }


    const getTokens = async () => {
        try {
            const body = { user, chainId }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(async (data) => {
                    const temp = await data.json()
                    let t, set, In
                    if (chainId === 4) {
                        t = temp.tokensETH
                        set = temp.PromSetETH
                        In = temp.PromInputETH
                    }
                    else {
                        t = temp.tokensBNB
                        set = temp.PromSetBNB
                        In = temp.PromInputBNB
                    }

                    let f = t.split("_")
                    setPromSet(set)
                    setPromInput(In)
                    f.pop();
                    setTokens(f)
                })
        } catch (err) {
            console.log(err)
        }
    }

    async function addToken() {
        settryed(true)
        const n = new Promise((res) => {
            res(checkValidAddress())
        })
        n.then(async (result) => {
            if (result) {
                //if (isvalid && (isdecimals ? true : (parseInt(Decimals) >= 0 && parseInt(Decimals) != NaN))) {
                const _addTokenAddress = addTokenAddress + (isdecimals ? "" : "." + Decimals)
                // console.log(_addTokenAddress, isvalid, isdecimals, (isdecimals ? (parseInt(Decimals) >= 0 && parseInt(Decimals) != NaN) : true), parseInt(Decimals) >= 0, parseInt(Decimals) != NaN)
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const address = await signer.getAddress()
                const body = { address, addTokenAddress: _addTokenAddress, chainId }
                setTokens([...rokens, _addTokenAddress])
                try {
                    await fetch('/api/addToken', {
                        method: "PUT",
                        body: JSON.stringify(body)
                    })
                    document.getElementById("inputToken").value = "";
                    setaddTokenAddress()
                    settryed(false)
                } catch (err) {
                    //console.log(err)
                }

            }
            localStorage.setItem("addToken", "true")
        })

        // console.log(isvalid, isdecimals, parseInt(Decimals))

    }

    const makePDF = async () => {
        let data, _user
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            _user = await signer.getAddress()
            body = { user, chainId }
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
                <div className="PDF">
                    <button onClick={makePDF} className=" mybutton">PDF</button>
                </div>
                <div className={isvalid && !isdecimals ? "tokeninput" : "tokeninput cut"}>
                    <input className={isvalid && !isdecimals ? "input small" : "input big"} id="inputToken" placeholder="Token Address" onChange={e => setaddTokenAddress(e.target.value)} />
                    {(!isvalid && tryed) && <div className="invalid">Invalid Address</div>}
                    {isvalid && !isdecimals && <input className="input decimals" placeholder="Decimals" onChange={e => setDecimals(e.target.value)} />}
                    <button onClick={addToken} className="addtoken mybutton" >Add new token</button>
                </div>

                <div className="wallettokens">
                    {rokens && rokens.map((element) =>
                        <TokensBalanceShablon user={user} token={element} chainId={chainId} setisReliably={setisReliably} />
                    )}
                    {!isReliably && <div className="isReliably">*Balance may not be displayed correctly</div>}
                </div>
                <Prom PromSet={PromSet} PromInput={PromInput} setPromInput={setPromInput} setPromSet={setPromSet} chainId={chainId} />

            </div>
        </div>
    )
}
