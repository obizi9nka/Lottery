import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { compileFunction } from 'vm';


export async function getServerSideProps() {
  let id
  try {
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const provider = new ethers.providers.JsonRpcProvider
    const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
    id = await contract.getLotteryCount()
    console.log(id)
  } catch (err) {
    console.log(err)
  }
  return {
    props: {
      id: parseInt(id, 10)
    }
  }
}

export default function Home({ id }) {





  const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  const MudeBzNFT = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

  const [lotteryIdPLUSPLUS, setlotteryIdPLUSPLUS] = useState(`/images/${id + 2 < 1001 ? id + 2 : 0}.png`)
  const [lotteryIdMINUSMINUS, setlotteryIdMINUSMINUS] = useState(`/images/${id - 2 > 0 ? id - 2 : 0}.png`)
  const [lotteryIdPLUS, setlotteryIdPLUS] = useState(`/images/${id + 1 < 1001 ? id + 1 : 0}.png`)
  const [lotteryIdMINUS, setlotteryIdMINUS] = useState(`/images/${id - 1 > 0 ? id - 1 : 0}.png`)
  const [lotteryId, setlotteryId] = useState(`/images/${id}.png`)

  useEffect(() => {
    window.ethereum.on("accountsChanged", () => {
      console.log("f")
      checkAmIn()
    });
  }, [])

  // useEffect(() => {
  //   checkAmIn()
  // }, [])


  const [amIn, setamIn] = useState(false)

  const checkAmIn = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
      const players = (await contract.getLotteryShablonByIndex(id)).players
      const length = players.length
      let flag = false
      for (let i = 0; i < length; i++) {
        if (players[i] == await singer.getAddress()) {
          flag = true
          break
        }
      }
      setamIn(flag)
    } catch (err) {
      console.log(err)
    }
  }


  const Enter = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(LotteryAddress, Lottery.abi, singer)
      const tx = await contract.Enter()
      await tx.wait()
      setamIn(true)
      contract.once("enter", async () => {
        console.log("Welcome!", await singer.getAddress())
      })
    } catch (err) {

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
            <Image src={lotteryIdMINUSMINUS} width={150} height={150} />
          </div>
          <div className='PLUS'>
            <Image src={lotteryIdMINUS} width={225} height={225} />
          </div>
          <div className='newnft'>
            <h2 className='aou'>New</h2>
            <Image src={lotteryId} width={300} height={300} />
            <div className='enterNftPlay'>
              {!amIn && <button onClick={Enter} className="mybutton tobottom">Am In!</button>}
              {amIn && <button className="nftmintbuttonactive">Your In!</button>}
            </div>
          </div>
          <div className='PLUS'>
            <Image src={lotteryIdPLUS} width={225} height={225} />
          </div>
          <div className='PLUSPLUS'>
            <Image src={lotteryIdPLUSPLUS} width={150} height={150} />
          </div>
        </div>
      </div>
    </div >
  )
}

/*

*/