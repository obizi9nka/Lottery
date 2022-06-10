import { useState, useEffect } from "react";
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"


export default function ChangeNetwork({ active }) {

    console.log(active)

    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [tryed, settryed] = useState(false)
    const [isvalid, setvalid] = useState(false)
    const [user, setuser] = useState("")
    const [rokens, setTokens] = useState([])

    return (
        <div className={!active ? "modall active" : "modall"}>
            <div className="networkAlert" onClick={e => e.stopPropagation()}>
                <h2 className="">This Network Do Not Supporting</h2>
                <h3> Please change network</h3>
            </div>
        </div >
    )
}
