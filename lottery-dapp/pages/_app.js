import '../styles/globals.css'
import "C:/Lottery/lottery-dapp/styles/Componets.css"
import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MintNftButton from '../components/MintNftButton';
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import Wallet from '../components/Wallet';
import Head from 'next/head';


function MyApp({ Component, pageProps }) {

  const [token, setToken] = useState('')

  const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'



  return (
    <div className='main'>
      <Head>
        <meta name="viewport" content='width=device-width' />
      </Head>
      <nav className="nav">
        <div className='container between'>
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
            <Link href="/" >
              <Image src="/star-big.png" width="100px" height="100px" />
            </Link>
          </div>
          <Wallet />
        </div>
      </nav >
      <Component {...pageProps} />
      <footer>
        f
      </footer>
    </div >
  )
}

export default MyApp