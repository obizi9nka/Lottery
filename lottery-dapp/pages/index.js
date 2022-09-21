import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")


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


export async function getServerSideProps() {
  let id = 0
  try {
    let provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
    const contract = new ethers.Contract(LotteryAddressETH, Lottery.abi, provider)
    id = await contract.getLotteryCount()
  } catch (err) {
    console.log(err)
  }
  return {
    props: {
      id: parseInt(id, 10)
    }
  }
}

export default function Home({ id, tymblerNaNetwork, settxData }) {




  const [lotteryIdPLUSPLUS, setlotteryIdPLUSPLUS] = useState(`/images/0.png`)
  const [lotteryIdMINUSMINUS, setlotteryIdMINUSMINUS] = useState(`/images/0.png`)
  const [lotteryIdPLUS, setlotteryIdPLUS] = useState(`/images/0.png`)
  const [lotteryIdMINUS, setlotteryIdMINUS] = useState(`/images/0.png`)
  const [lotteryId, setlotteryId] = useState(`/images/0.png`)


  const [AutoEnter, setAutoEnter] = useState([])

  const { chain } = useNetwork()
  const { data } = useSigner()
  const provider = useProvider()
  const { address, isConnected } = useAccount()

  const [chainId, setchainId] = useState(chain != undefined ? chain.id : 0)

  useEffect(() => {
    checkAmIn()
  }, [address])


  useEffect(() => {
    setchainId(chain?.id)
  }, [chain])

  useEffect(() => {
    if (chainId > 0)
      checkAmIn()
  }, [chainId, address])

  useEffect(() => {
    checkChain()
  }, [])

  useEffect(() => {
    checkChain()
  }, [chainId, tymblerNaNetwork])



  const checkChain = async () => {
    // try {
    //   await fetch('/api/add1000', {
    //     method: "POST",
    //     body: JSON.stringify(4)
    //   })
    // }
    // catch (err) {
    //   console.log(err)
    // }
    try {
      let provider
      if (tymblerNaNetwork)
        provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
      else
        provider = new ethers.providers.JsonRpcProvider
      const contract = new ethers.Contract(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressLocalhost, Lottery.abi, provider)
      console.log(tymblerNaNetwork ? MudeBzNFTETH : MudeBzNFTLocalhost, contract)
      const _id = parseInt(await contract.getLotteryCount(), 10)

      console.log(_id)

      setlotteryId(`/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${_id}.png`)
      setlotteryIdPLUSPLUS(`/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${_id + 2 < 1001 ? _id + 2 : 0}.png`)
      setlotteryIdMINUSMINUS(`/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${_id - 2 > 0 ? _id - 2 : 0}.png`)
      setlotteryIdPLUS(`/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${_id + 1 < 1001 ? _id + 1 : 0}.png`)
      setlotteryIdMINUS(`/${!tymblerNaNetwork ? "imagesETH" : "imagesBNB"}/${_id - 1 > 0 ? _id - 1 : 0}.png`)
    } catch (err) {
      console.log(err)
    }
  }

  const [AutoEnterMAS, setAutoEnterMAS] = useState([])
  const [clicked, setclicked] = useState(false)
  const [Invalid, setInvalid] = useState(false)



  // console.log(AutoEnter)




  const [amIn, setamIn] = useState(false)

  const checkAmIn = async () => {
    try {
      const providerLocal = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressLocalhost, Lottery.abi, chainId != 31337 ? provider : providerLocal)
      const players = (await contract.getLotteryShablonByIndex(await contract.getLotteryCount())).players
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
    } catch (err) {
      console.log(err)
    }
  }

  const Enter = async () => {
    try {
      settxData({
        isPending: true,
        result: null
      })
      const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, data)
      const tx = await contract.Enter()
      await tx.wait()
      setamIn(true)
      contract.once("enter", async () => {
        console.log("Welcome!", address)
      })
      settxData({
        isPending: true,
        result: true
      })
    } catch (err) {
      console.log(err)
      settxData({
        isPending: true,
        result: false
      })
    }
  }

  //console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("")))


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
            <Image src={lotteryIdMINUSMINUS} className="tttt" width={150} height={150} />
          </div>
          <div className='PLUS'>
            <Image src={lotteryIdMINUS} className="tttt" width={225} height={225} />
          </div>
          <div className='newnft'>
            <h2 className='aou'></h2>
            <Image src={lotteryId} className="tttt" width={300} height={300} />
            <div className='enterNftPlay'>
              {!amIn && <button onClick={Enter} className="mybutton tobottom">Am In!</button>}
              {amIn && <button className="nftmintbuttonactive">Your In!</button>}
            </div>
          </div>
          <div className='PLUS'>
            <Image src={lotteryIdPLUS} className="tttt" width={225} height={225} />
          </div>
          <div className='PLUSPLUS'>
            <Image src={lotteryIdPLUSPLUS} className="tttt" width={150} height={150} />
          </div>
        </div>
      </div>
    </div >
  )
}

/*

*/