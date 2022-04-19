import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
const { ethers } = require("ethers");
import detectEthereumProvider from '@metamask/detect-provider';
import Head from 'next/head'
import { useState, useEffect } from 'react'

function MyApp({ Component, pageProps }) {

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const connectWalletHandler = async () => {
    /* check if MetaMask is installed */
    setError('')
    setSuccessMsg('')
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* request wallet connection */
        await window.ethereum.request({ method: "eth_requestAccounts" })
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance in React state */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts()
        /* set account 1 to React state */
        setAddress(accounts[0])

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()
          console.log(accounts[0])
          /* set account 1 to React state */
          setAddress(accounts[0])
        })
      } catch (err) {
        setError(err.message)
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask")
    }
  }
  return (
    <div>
      <nav className="border-b p-3">
        <p className="text-4xl font-bold">!MudeBz</p>
        <div className="flex mt-3">
          <Link href="/">
            <a className="mr-6 text-pink-500">
              Lottery
            </a>
          </Link>
          <Link href="lobbyes">
            <a className="mr-6 text-pink-500">
              Lobbys
            </a>
          </Link>
          <Link href="Marketplace">
            <a className="mr-6 text-pink-500">
              Marketplace
            </a>
          </Link>
          <Link href="About">
            <a className="mr-6 text-pink-500">
              About
            </a>
          </Link>
          <div className="navbar-end">
            <button onClick={connectWalletHandler} className="button is-link">Connect Wallet</button>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
