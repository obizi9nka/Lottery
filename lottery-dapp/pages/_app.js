import '../styles/globals.css'
import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import bigStar from 'C:/Lottery/lottery-dapp/images/star-big.png'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"


function MyApp({ Component, pageProps }) {

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [NftButton, setNftButton] = useState(false)

  const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  useEffect(() => {
    checkNftButton()
  }, [])

  const connectWalletHandler = async () => {
    setError('')
    setSuccessMsg('')
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        window.ethereum.on('accountsChanged', async () => { })
        //localStorage.setItem("walletConnect", "true")
        checkNftButton()
      } catch (err) {
        setError(err.message)
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask")
    }
  }

  const checkNftButton = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const lottery = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
        const nft = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, provider)
        const address = await signer.getAddress()
        const wins = await lottery._allowToNFT(address)
        for (let i = 0; i < wins.count; i++) {
          if (!nft.istokenMints(wins.lotteryes[i])) {
            setNftButton(true)
            break
          }
        }
        setNftButton(true)
      }
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className='black'>
      <nav className="nav">
        <div className='container leftside'>
          <div className='navigation'>
            <Link href="/">
              <a className='menu'> Lottery </a>
            </Link>
            <Link href="/lobbyes">
              <a className='menu'> Lobbys </a>
            </Link>
            <Link href="/Marketplace">
              <a className='menu'> Marketplace </a>
            </Link>
            <Link href="/About">
              <a className='menu'> About </a>
            </Link>
          </div>
          <div className='image'>
            <Image src={bigStar} width="100px" height="100px" />
          </div>
          <div className='nftmint'>
            {NftButton && <MintNftButton />}
          </div>
          <div className='wallet'>
            <button onClick={connectWalletHandler} className="button">Connect Wallet</button>
          </div>
        </div>
      </nav>
      <div>
        <Component {...pageProps} />
      </div>
      <footer>
        footer
      </footer>
    </div>
  )
}

export default MyApp