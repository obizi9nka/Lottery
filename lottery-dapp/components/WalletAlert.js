import { useState, useEffect } from "react";
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"


export default function WalletAlert({ active, setActive, }) {

    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)
    const [user, setuser] = useState("")
    const [rokens, setTokens] = useState([])

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
        getTokens()
    }, [user])

    useEffect(() => {
        checkValidAddress()
    }, [addTokenAddress])

    const checkValidAddress = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(addTokenAddress, A.abi, provider)
            await contract.totalSupply() //проверка на валидность
            setvalid(true)
            console.log("valid")
        } catch (err) {
            setvalid(false)
            console.log("no valid")
        }

    }

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
                })
        } catch (err) {
            console.log(err)
        }
    }

    async function addToken() {
        settryed(true)
        if (isvalid) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const body = { address, addTokenAddress }
            setTokens([...rokens, addTokenAddress])
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
    }

    const makePDF = async () => {
        let data, _user
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            _user = await signer.getAddress()
            console.log("_user", _user)
            await fetch("/api/pdf", {
                method: "POST",
                body: _user
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
                <div className="between">
                    <input className="input big" id="inputToken" placeholder="Token Address" onChange={e => setaddTokenAddress(e.target.value)} />
                    {(!isvalid && tryed) && <div className="invalid">Invalid address</div>}
                    <button onClick={addToken} className="addtoken mybutton" >Add new token</button>
                </div>
                <div className="wallettokens">
                    {rokens && rokens.map((element) =>
                        <TokensBalanceShablon user={user} token={element} />
                    )}
                </div>
                {(localStorage.getItem("isReliably") === "true") && <div className="isReliably">*Balance may not be displayed correctly</div>}
            </div>
        </div>
    )
}
