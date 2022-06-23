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
import ChangeNetwork from '../components/ChangeNetwork';


function MyApp({ Component, pageProps }) {

  const [token, setToken] = useState('')
  const [logo, setlogo] = useState('/star-big.png')
  const [Chain, setChain] = useState(true)


  const [user, setuser] = useState("")

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


  useEffect(() => {
    setUser()
  })


  const [chainId, setchainId] = useState(0)
  const checkChain = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const chain = await provider.getNetwork()
    if (chain.chainId == 31337) {
      setlogo('/star-big.png')
      setChain(true)
      setchainId(31337)
    }
    else if (chain.chainId == 4) {
      setlogo('/countOfPlayers.png')
      setChain(true)
      setchainId(4)
    }
    else {
      setlogo('/delete.png')
      setChain(false)
      setchainId(0)
    }
  }

  useEffect(() => {
    checkChain()
  }, [])


  useEffect(() => {
    window.ethereum.on('chainChanged', () => {
      checkChain()
    });
    window.ethereum.on("accountsChanged", () => {
      setUser()
    });
  }, [])

  return (
    <div className='main'>
      <Head>
        <meta name="viewport" content='width=device-width' />
      </Head>
      {!Chain && <ChangeNetwork active={Chain} />}
      <div className="nav">
        <div className='content'>
          <div className='navigation'>
            <Link href="/" className="spase">
              <a className='menu'> Lottery </a>
            </Link>
            <Link href="/lobbyes">
              <a className='menu'> Lobbys </a>
            </Link>
            <Link href="/Galary">
              <a className='menu'> Galary </a>
            </Link>
            <Link href="/About">
              <a className='menu'> About </a>
            </Link>
          </div>
          <div className='image'>
            <Link href="/" >
              <Image src={logo} width="100px" height="100px" />
            </Link>
          </div>
          <Wallet f={user} chainId={chainId} />
        </div>
      </div >
      <Component {...pageProps} />
      <footer>
      </footer>
    </div >
  )
}

export default MyApp