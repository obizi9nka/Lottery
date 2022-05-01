import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import bigStar from 'C:/Lottery/lottery-dapp/images/star-big.png'

export default function Home() {


  const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const MudeBzNFT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [lcContract, setLcContract] = useState()
  const [freeTokens, setFreeTokens] = useState(0)
  const [deposit, setdeposit] = useState(0)
  const [lotteryPlayers, setPlayers] = useState([])

  /*useEffect(() => {
    updateState()
  }, [lcContract])

  const updateState = () => {
    //if (lcContract) getPot()
    //if (lcContract) getPlayers()
    //if (lcContract) getLotteryId()
  }*/

  const approve = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(AAddress, A.abi, singer)
      const tx = await contract.approve(LotteryAddress, deposit)
      await tx.wait()
    }
  }

  const Enter = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
      const tx = await contract.Enter()
      await tx.wait()
      contract.once("enter", async () => {
        console.log("Welcome!", await singer.getAddress())
      })
    }
  }

  const addTokensToBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await approve()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
      const tx = await contract.addTokensToBalance(AAddress, deposit)
      await tx.wait()
    }
  }

  const allowToNFT = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
      const tx = await contract.allowToNFT(1)
      console.log(tx)
    }
  }


  const getTokens = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(AAddress, A.abi, singer)
      const tx = await contract.getTokens(freeTokens)
      await tx.wait()
    }
  }

  const balanceOf = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(AAddress, A.abi, provider)
      const address = await signer.getAddress()
      try {
        const balance = await contract.balanceOf(address)
        console.log('data :', parseInt(balance))
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  const balanceInTokenForAccount = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      try {
        const balance = await contract.getBalance(AAddress, address)
        console.log('balance contract :', parseInt(balance))
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  const getLotteryShablonByIndex = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
      console.log(await contract.getLotteryShablonByIndex(await contract.getLotteryCount() - 1))
    }
  }

  const Play = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
      const tx = await contract.Play()
      await tx.wait()
      contract.on("play", async () => {
        console.log("Winer:", contract.getLotteryShablonByIndex(contract.getLotteryCount() - 1).winer)
      })
    }
  }

  const setAdrressNFT = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
      const tx = await contract.setAdrressNFT(MudeBzNFT)
      await tx.wait()
    }
  }


  return (
    <div>
      <Head>
        <title>!Mudebz Lottery</title>
        <meta name="description" content="An Ethereum Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='newnft'>
        <Image src={bigStar} />
        <div className=''>
          <button onClick={Enter} className="button">Enter Lottery</button>
        </div>
      </div>

    </div >
  )
}

/*

*/