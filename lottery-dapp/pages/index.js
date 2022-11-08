import Head from 'next/head'
import Image from 'next/image'
const { ethers, Wallet } = require("ethers");
import { useState, useEffect } from 'react'
import { LotteryAddressETH, LotteryAddressBNB, ETHid, BNBid, PRODACTION } from '/components/Constants.js';
import notForYourEyesBitch from "../notForYourEyesBitch.json"
import Lottery from "/blockchain/Lottery.json"
import Script from "next/script"

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
import IssueMaker from '../components/IssueMaker';



export default function Home({ LOTTERY_ADDRESS, NFT_ADDRESS, chainId, tymblerNaNetwork, settxData, setneedWallet }) {

  const Default = `/blackFon.png`

  const [Images, setImages] = useState({
    id: undefined,
    lotteryId: Default,
    lotteryIdPLUS: Default,
    lotteryIdPLUSPLUS: Default,
    lotteryIdMINUS: Default,
    lotteryIdMINUSMINUS: Default
  })
  const [isneedShadow, setisneedShadow] = useState(false)
  const { data } = useSigner()
  const { chain } = useNetwork()
  const provider = useProvider()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    checkAmIn()
  }, [chainId, address])

  useEffect(() => {
    const images = sessionStorage.getItem("index")
    if (images != undefined) {
      setImages(JSON.parse(images))
    }
    infinity()
    changeImages(false)
  }, [])

  useEffect(() => {
    changeImages(true)
  }, [chainId, LOTTERY_ADDRESS, tymblerNaNetwork])

  const infinity = async () => {
    let shit = 180
    let OneDay = 86400000
    let g = Math.floor((Date.now() + OneDay + shit * 60 * 1000) / OneDay)

    let y = new Date(g * OneDay - shit * 60 * 1000)
    //180ss
    let countDownDate = y.getTime();

    let _provider, id
    if (tymblerNaNetwork)
      _provider = new ethers.providers.InfuraProvider("goerli", notForYourEyesBitch.infuraKey)
    else
      _provider = new ethers.providers.InfuraProvider("sepolia", notForYourEyesBitch.infuraKey)
    if (chain?.id == 31337)
      _provider = new ethers.providers.JsonRpcProvider
    try {
      const contract = new ethers.Contract(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressBNB, Lottery.abi, _provider)
      id = parseInt(await contract.getLotteryCount())
      console.log(id)
    } catch (err) {
      console.log(err)
    }

    let x = setInterval(async () => {
      let now = Date.now()
      let distance = countDownDate - now;
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        setisneedShadow(true)
        clearInterval(x)
        listenEvent(id)
      }
      else
        try {
          document.getElementById("hours").innerHTML = (hours > 9 ? "" : "0") + hours
          document.getElementById("minutes").innerHTML = (minutes > 9 ? "" : "0") + minutes
          document.getElementById("seconds").innerHTML = (seconds > 9 ? "" : "0") + seconds
        } catch (err) {
          // clearInterval(x)
          console.log(err)
        }

    }, 1000);
  }

  const listenEvent = async (ID) => {
    console.log("###", ID, chain?.id)
    let _provider
    if (tymblerNaNetwork)
      _provider = new ethers.providers.InfuraProvider("goerli", notForYourEyesBitch.infuraKey)
    else
      _provider = new ethers.providers.InfuraProvider("sepolia", notForYourEyesBitch.infuraKey)
    if (chain?.id == 31337)
      _provider = new ethers.providers.JsonRpcProvider
    try {
      const contract = new ethers.Contract(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressBNB, Lottery.abi, _provider)
      let i = 0
      var hh = setInterval(async () => {
        try {
          let id = parseInt(await contract.getLotteryCount())
          console.log("i=", ++i, id, ID)
          if (id == 1 + ID) {
            const papka = `${tymblerNaNetwork ? "imagesETH" : "imagesBNB"}`
            const images = {
              id: id,
              lotteryId: `/${papka}/${id}.png`,
              lotteryIdPLUS: `/${papka}/${id + 1 < 1001 ? id + 1 : 0}.png`,
              lotteryIdPLUSPLUS: `/${papka}/${id + 2 < 1001 ? id + 2 : 0}.png`,
              lotteryIdMINUS: `/${papka}/${id - 1 > 0 ? id - 1 : 0}.png`,
              lotteryIdMINUSMINUS: `/${papka}/${id - 2 > 0 ? id - 2 : 0}.png`
            }
            setImages(images)
            sessionStorage.setItem("index", JSON.stringify(images))
            setk(1000)
            clearInterval(hh)
            infinity()
          }
          if (i > 100) {
            clearInterval(hh)
          }
        } catch (err) {
          console.log(err)
        }
      }, 7000)



    } catch (err) {
      console.log(err)
    }
  }

  const changeImages = async (flag) => {
    try {
      let _provider, _id
      if (tymblerNaNetwork)
        _provider = new ethers.providers.InfuraProvider("goerli", notForYourEyesBitch.infuraKey)
      else
        _provider = new ethers.providers.InfuraProvider("sepolia", notForYourEyesBitch.infuraKey)
      if (chain?.id == 31337)
        _provider = new ethers.providers.JsonRpcProvider
      try {
        const contract = new ethers.Contract(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressBNB, Lottery.abi, _provider)
        console.log(contract, _provider)
        _id = parseInt(await contract.getLotteryCount())
      } catch (err) {
        console.log(err)
      }
      if (Images.id < _id || flag) {
        const papka = `${tymblerNaNetwork ? "imagesETH" : "imagesBNB"}`
        const images = {
          id: _id,
          lotteryId: `/${papka}/${_id != undefined ? _id : 0}.png`,
          lotteryIdPLUS: `/${papka}/${_id + 1 < 1001 ? _id + 1 : 0}.png`,
          lotteryIdPLUSPLUS: `/${papka}/${_id + 2 < 1001 ? _id + 2 : 0}.png`,
          lotteryIdMINUS: `/${papka}/${_id - 1 > 0 ? _id - 1 : 0}.png`,
          lotteryIdMINUSMINUS: `/${papka}/${_id - 2 > 0 ? _id - 2 : 0}.png`
        }
        setImages(images)
        sessionStorage.setItem("index", JSON.stringify(images))
      }
      // console.log("dtt", tempID < _id, tempID, _id)
      // return tempID < _id

    } catch (err) {
      console.log("ttt", err)
      // return false
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
          isEntered: flag
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
      let issue = IssueMaker({ data: err.code, from: "Enter" })
      settxData({
        isPending: false,
        result: false,
        issue
      })
      if (!isConnected) {
        setneedWallet(true)
      }
    }
  }
  const [k, setk] = useState(0)

  const Play = async () => {
    listenEvent()
    try {
      settxData({
        isPending: true,
        result: null
      })
      const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
      const tx = await contract.Play()
      await tx.wait()

      settxData({
        isPending: false,
        result: true
      })

    } catch (err) {
      console.log(err)
      let issue = IssueMaker({ data: err.code, from: "Enter" })
      settxData({
        isPending: false,
        result: false,
        issue
      })
      if (!isConnected) {
        setneedWallet(true)
      }
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
        {/* <div className='Timer'>
          <div class="circle">
            <div class="circle-content">
              <div className='timer' id="hours"  ></div>
            </div>
          </div>
          <div class="circle">
            <div class="circle-content">
              <div className='timer' id="minutes"  ></div>
            </div>
          </div>
          <div class="circle">
            <div class="circle-content">
              <div className='timer' id="seconds"  ></div>
            </div>
          </div>
        </div> */}


        <div className='Timer'>
          <div className='timer' id="hours"  ></div>
          <div className='timer dots'>:</div>
          <div className='timer' id="minutes"  ></div>
          <div className='timer'>:</div>
          <div className='timer' id="seconds"  ></div>
        </div>
        <div className='index'>
          <div className={k >= 10 && isneedShadow ? "MINUSMINUS snebes" : isneedShadow ? "MINUSMINUS shadow" : 'MINUSMINUS '}>
            <Image src={Images.lotteryIdMINUSMINUS} className="tttt" width={150} height={150} />
          </div>
          <div className={k >= 100 && isneedShadow ? "PLUS snebes" : isneedShadow ? "PLUS shadow" : 'PLUS '}>
            <Image src={Images.lotteryIdMINUS} className="tttt" width={225} height={225} />
          </div>
          <div className={k >= 1000 && isneedShadow ? "newnft snebes" : isneedShadow ? "newnft shadow" : 'newnft '}>

            <Image src={Images.lotteryId} className="tttt" width={300} height={300} />
            <div className='enterNftPlay'>
              {!amIn && <button onClick={Enter} className="mybutton tobottom">Am In!</button>}
              {amIn && <button className="nftmintbuttonactive">You're In!</button>}
            </div>
          </div>

          <div className={k >= 100 && isneedShadow ? "PLUS snebes" : isneedShadow ? "PLUS shadow" : 'PLUS '}>
            <Image src={Images.lotteryIdPLUS} className="tttt" width={225} height={225} />
          </div>
          <div className={k >= 10 && isneedShadow ? "PLUSPLUS snebes" : isneedShadow ? "PLUSPLUS shadow" : 'PLUSPLUS '}>
            <Image src={Images.lotteryIdPLUSPLUS} className="tttt" width={150} height={150} />
          </div>
        </div>
        {/* <button onClick={Play}>Play</button> */}

      </div>
    </div >
  )
}

/*

*/