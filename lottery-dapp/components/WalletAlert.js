import { get } from "http";
import { useState, useEffect } from "react";
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'


export default function WalletAlert({ active, setActive, user }) {

    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [rokens, setTokens] = useState([' '])

    useEffect(() => {
        getTokens()
    }, [rokens])

    const getTokens = async () => {
        try {
            await fetch('/api/getTokens')
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

    if (rokens[0] === " ") getTokens()


    async function addToken() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const body = { address, addTokenAddress }
        try {
            await fetch('/api/addToken', {
                method: "PUT",
                body: JSON.stringify(body)
            })
            document.getElementById("inputToken").value = "";
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className={active ? "modall active" : "modall"} onClick={() => setActive(false)}>
            <div className="walletalert" onClick={e => e.stopPropagation()}>
                <div>
                    <input className="input" id="inputToken" onChange={e => setaddTokenAddress(e.target.value)} />
                    <button onClick={addToken} className="addtoken mybutton">Add new token</button>
                </div>
                <div className="wallettokens">
                    {rokens && rokens.map((element) =>
                        <TokensBalanceShablon user={user} token={element} />
                    )}
                </div>
            </div>
        </div>
    )
}
