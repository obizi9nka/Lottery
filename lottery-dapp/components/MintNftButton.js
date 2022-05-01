const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'

export default function MintNftButton() {

    const [TokenId, setTokenId] = useState(1)

    const MudeBzNFT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const MintMarten = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await approve()
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const singer = provider.getSigner()
                const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, singer)
                const tx = await contract.MintMarten(TokenId)
                await tx.wait()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <button onClick={MintMarten} className="">MintMarten</button>
        </div>
    )
}