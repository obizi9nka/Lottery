const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import Image from "next/image";
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from './Constants';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useSigner,
    useConnect,
    useNetwork, useProvider
} from 'wagmi';
import Prom from "./Prom";


export default function OtherPylt({ user, rokens, chainId, setisReliably, deleteTokenFromFronend, setTokenSelected, TokenSelected, settokenTransfered }) {


    const [balance, setbalance] = useState(0)
    const [deposit, setDeposit] = useState("null")
    const [needApprove, setneedAprove] = useState(false)
    const [bigBalance, setbigBalance] = useState(0)

    const [placeholder, setplaceholder] = useState("Choose token")

    const [isfaund, setisfaund] = useState(true)

    const provider = useProvider()
    const { data } = useSigner()
    const signer = data

    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)
    const [isdecimals, setisdecimals] = useState(false)
    const [Decimals, setDecimals] = useState()


    const [PromSet, setPromSet] = useState(null)
    const [PromInput, setPromInput] = useState(null)



    const [Mode, setMode] = useState(true)


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
                sup = await contract.totalSupply()//проверка на валидность
                try {
                    dec = await contract.decimals()
                } catch {
                    dec = 18
                }

                try {
                    symb = await contract.symbol()
                } catch {
                    symb = addTokenAddress.substring(38, 42)
                }

                console.log("valid")
            } catch (err) {
                console.log("no valid")
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


    const addToken = async () => {
        settryed(true)
        const n = new Promise((res) => {
            res(checkValidAddress())
        })
        n.then(async (result) => {
            if (result.flag) {
                const _addTokenAddress = addTokenAddress
                const body = { address, addTokenAddress: _addTokenAddress, chainId, isImageAdded: true, symbol: result.symbol, decimals: result.decimals }
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
            }
            localStorage.setItem("addToken", "true")
        })

        // console.log(isvalid, isdecimals, parseInt(Decimals))

    }

    const addToAutoEnter = async () => {
        if (clicked) {
            try {
                const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, data)
                const tx = await contract.addToAutoEnter(AutoEnterMAS)
                await tx.wait()
                setclicked(false)
                setAutoEnterMAS([])
                document.getElementById("AutoEnter").value = "";
            } catch (err) {
                console.log(err)
            }
        }
        else {
            const mas = AutoEnter.split(",")
            let data = []
            let flag = true
            for (let i = 0; i < mas.length; i++) {
                let _flag = true
                data.forEach(element => {
                    if (element == mas[i])
                        _flag = false
                });
                if (parseInt(mas[i]) == mas[i] && mas[i] > id && _flag) {
                    data.push(parseInt(mas[i]))
                } else {
                    flag = false
                    break
                }
            }
            if (flag) {
                setclicked(true)
                setAutoEnterMAS(data)
                setInvalid(false)
            } else {
                setInvalid(true)
            }

        }
    }







    return (
        <div>
            {/* <div className="PDF">
                <button onClick={makePDF} className=" mybutton">PDF</button>
            </div>
            <input className={isvalid && !isdecimals ? "input small" : "input big"} id="inputToken" placeholder="Token Address" onChange={e => setaddTokenAddress(e.target.value)} />
            {(!isvalid && tryed) && <div className="invalid">Invalid Address</div>}
            {isvalid && !isdecimals && <input className="input decimals" placeholder="Decimals" onChange={e => setDecimals(e.target.value)} />}
            <button onClick={addToken} className="addtoken mybutton" >Add new token</button>
            <Prom PromSet={PromSet} PromInput={PromInput} setPromInput={setPromInput} setPromSet={setPromSet} chainId={chainId} /> */}

        </div>
    )

}