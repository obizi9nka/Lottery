import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import { ETHid, BNBid, LocalhostId, PRODACTION } from '/components/Constants.js';
import notForYourEyesBitch from "../notForYourEyesBitch.json"
import Lottery from "/blockchain/Lottery.json"

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  defaultChains,
  useAccount,
  useContractWrite,
  useNetwork,
  useProvider,
  useSigner,
  usePrepareContractWritde
} from 'wagmi';
import { ConstructorFragment } from 'ethers/lib/utils';




export default function Home({ LOTTERY_ADDRESS, NFT_ADDRESS, chainId, tymblerNaNetwork, settxData }) {

  const Default = `/blackFon.png`

  const [Images, setImages] = useState({
    id: undefined,
    lotteryId: Default,
    lotteryIdPLUS: Default,
    lotteryIdPLUSPLUS: Default,
    lotteryIdMINUS: Default,
    lotteryIdMINUSMINUS: Default
  })

  const { data } = useSigner()
  const provider = useProvider()
  const PROVIDRER = provider
  const { address, isConnected } = useAccount()

  useEffect(() => {
    checkAmIn()
  }, [chainId, address])

  useEffect(() => {
    const images = sessionStorage.getItem("index")
    if (images != undefined)
      setImages(JSON.parse(images))
    changeImages(false)
  }, [])

  useEffect(() => {
    changeImages(true)
  }, [chainId, LOTTERY_ADDRESS, tymblerNaNetwork])



  const changeImages = async (flag) => {
    try {
      let provider, _id
      if (tymblerNaNetwork)
        provider = new ethers.providers.InfuraProvider("goerli", notForYourEyesBitch.infuraKey)
      else
        provider = new ethers.providers.InfuraProvider("sepolia", notForYourEyesBitch.infuraKey)
      if (chainId == 31337)
        provider = new ethers.providers.JsonRpcProvider
      try {
        const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)
        _id = parseInt(await contract.getLotteryCount())
        console.log("_id", _id)
      } catch (err) {
        _id = 0
      }
      console.log(Images.id, _id)
      if (Images.id != _id || flag) {
        const papka = `${tymblerNaNetwork ? "imagesETH" : "imagesBNB"}`
        const images = {
          id: _id,
          lotteryId: `/${papka}/${_id}.png`,
          lotteryIdPLUS: `/${papka}/${_id + 1 < 1001 ? _id + 1 : 0}.png`,
          lotteryIdPLUSPLUS: `/${papka}/${_id + 2 < 1001 ? _id + 2 : 0}.png`,
          lotteryIdMINUS: `/${papka}/${_id - 1 > 0 ? _id - 1 : 0}.png`,
          lotteryIdMINUSMINUS: `/${papka}/${_id - 2 > 0 ? _id - 2 : 0}.png`
        }
        setImages(images)

        sessionStorage.setItem("index", JSON.stringify(images))
      }


    } catch (err) {
      console.log(err)
    }
  }

  const [amIn, setamIn] = useState(false)

  const checkAmIn = async () => {
    if (isConnected) {
      // const checkAmIn = localStorage.getItem("checkAmIn")
      // if (checkAmIn != undefined && checkAmIn.lotteryId)
      try {

        const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)
        const id = await contract.getLotteryCount()
        let players = (await contract.getLotteryShablonByIndex(id)).players
        const length = players.length

        console.log(players)

        let flag = false
        for (let i = 0; i < length; i++) {
          if (players[i] == address) {
            flag = true
            break
          }
        }
        setamIn(flag)
        const d = {
          lotteryId: id,
          isEntered: falg
        }
        localStorage.setItem("checkAmIn", JSON.stringify(d))
      } catch (err) {
        console.log(err)
      }
    }

  }

  const Enter = async () => {
    // try {
    //   await fetch('/api/add1000', {
    //     method: "POST",
    //     body: JSON.stringify(5)
    //   })
    // }
    // catch (err) {
    //   console.log(err)
    // }
    // return
    try {
      settxData({
        isPending: true,
        result: null
      })
      const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
      const tx = await contract.Enter()
      await tx.wait()
      setamIn(true)
      contract.once("enter", async () => {
        console.log("Welcome!", address)
      })
      settxData({
        isPending: false,
        result: true
      })
    } catch (err) {
      console.log(err)
      settxData({
        isPending: false,
        result: false
      })
    }
  }

  return (
    <div>
      <Head>
        <title>!Mudebz</title>
        <meta name="description" content="An Ethereum Lottery dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=''>
        <div className='index'>
          <div className='MINUSMINUS'>
            <Image src={Images.lotteryIdMINUSMINUS} className="tttt" width={150} height={150} />
          </div>
          <div className='PLUS'>
            <Image src={Images.lotteryIdMINUS} className="tttt" width={225} height={225} />
          </div>
          <div className='newnft'>
            <Image src={Images.lotteryId} className="tttt" width={300} height={300} />
            <div className='enterNftPlay'>
              {!amIn && <button onClick={Enter} className="mybutton tobottom">Am In!</button>}
              {amIn && <button className="nftmintbuttonactive">You're In!</button>}
            </div>
          </div>
          <div className='PLUS'>
            <Image src={Images.lotteryIdPLUS} className="tttt" width={225} height={225} />
          </div>
          <div className='PLUSPLUS'>
            <Image src={Images.lotteryIdPLUSPLUS} className="tttt" width={150} height={150} />
          </div>
        </div>
      </div>
    </div >
  )
}

/*

*/