const { ethers } = require("ethers");
import { useState } from "react";
const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"

export default function TokensBalanceShablon(info) {

    const [balance, setbalance] = useState(0)

    const checkBalance = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
            try {
                const temp = await contract.getBalance(info.token, info.user)
                setbalance(parseInt(temp))
            } catch (err) {
                console.log("Error: ", err)
            }
        }
    }

    checkBalance()

    return (
        <div className='shablonbalance'>
            <p>{info.token}  {balance} </p>
        </div>
    )
}