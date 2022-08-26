import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB } from 'C:/Lottery/lottery-dapp/components/Constants.js';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")


export async function getServerSideProps() {
  let id = 0
  try {
    let provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
    const contract = new ethers.Contract(chain.chainId === 4 ? LotteryAddressETH : chain.chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
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

export default function Home({ id }) {

  const [lotteryIdPLUSPLUS, setlotteryIdPLUSPLUS] = useState(`/images/${id + 2 < 1001 ? id + 2 : 0}.png`)
  const [lotteryIdMINUSMINUS, setlotteryIdMINUSMINUS] = useState(`/images/${id - 2 > 0 ? id - 2 : 0}.png`)
  const [lotteryIdPLUS, setlotteryIdPLUS] = useState(`/images/${id + 1 < 1001 ? id + 1 : 0}.png`)
  const [lotteryIdMINUS, setlotteryIdMINUS] = useState(`/images/${id - 1 > 0 ? id - 1 : 0}.png`)
  const [lotteryId, setlotteryId] = useState(`/images/${id}.png`)

  const [chainId, setchainId] = useState(0)
  const [user, setuser] = useState('')
  const [AutoEnter, setAutoEnter] = useState([])

  useEffect(() => {
    window.ethereum.on("accountsChanged", () => {
      checkAmIn()
    });
  }, [])

  const setUser = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const _user = await signer.getAddress()
      setuser(_user)
    } catch (err) {
      console.log(err)
    }
  }
  setUser()

  useEffect(() => {
    if (chainId > 0)
      checkAmIn()
  }, [chainId, user])


  const checkChain = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const chain = await provider.getNetwork()

    if (chain.chainId == 31337) {
      setchainId(31337)
    }
    else if (chain.chainId == 4) {
      setchainId(4)
    }
    else {
      setchainId(0)
    }
    try {
      const contract = new ethers.Contract(chain.chainId === 4 ? LotteryAddressETH : chain.chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
      const _id = parseInt(await contract.getLotteryCount(), 10)
      setlotteryId(`/images/${_id}.png`)
      setlotteryIdPLUSPLUS(`/images/${_id + 2 < 1001 ? _id + 2 : 0}.png`)
      setlotteryIdMINUSMINUS(`/images/${_id - 2 > 0 ? _id - 2 : 0}.png`)
      setlotteryIdPLUS(`/images/${_id + 1 < 1001 ? _id + 1 : 0}.png`)
      setlotteryIdMINUS(`/images/${_id - 1 > 0 ? _id - 1 : 0}.png`)
    } catch (err) {

    }
  }

  const [AutoEnterMAS, setAutoEnterMAS] = useState([])
  const [clicked, setclicked] = useState(false)
  const [Invalid, setInvalid] = useState(false)

  const addToAutoEnter = async () => {
    if (clicked) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const singer = provider.getSigner()
        const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, singer)
        const tx = await contract.addToAutoEnter(AutoEnterMAS)
        await tx.wait()
        setclicked(false)
        setAutoEnterMAS([])
        document.getElementById("AutoEnter").value = "";
      } catch (err) {
        console.log(err)
      }
    }
    else {
      const mas = AutoEnter.split(",")
      let data = []
      let flag = true
      for (let i = 0; i < mas.length; i++) {
        let _flag = true
        data.forEach(element => {
          if (element == mas[i])
            _flag = false
        });
        if (parseInt(mas[i]) == mas[i] && mas[i] > id && _flag) {
          data.push(parseInt(mas[i]))
        } else {
          flag = false
          break
        }
      }
      if (flag) {
        setclicked(true)
        setAutoEnterMAS(data)
        setInvalid(false)
      } else {
        setInvalid(true)
      }

    }

  }

  // console.log(AutoEnter)

  useEffect(() => {
    checkChain()
  }, [])

  useEffect(() => {
    window.ethereum.on('chainChanged', () => {
      checkChain()
    });
  }, [])


  const [amIn, setamIn] = useState(false)

  const checkAmIn = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const singer = provider.getSigner()
      const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
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
      const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, singer)
      const tx = await contract.Enter()
      await tx.wait()
      setamIn(true)
      contract.once("enter", async () => {
        console.log("Welcome!", await singer.getAddress())
      })
    } catch (err) {

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
      <input className='input' id='AutoEnter' placeholder='NFT ids: 4,7,3,9,100,444' onChange={e => { setAutoEnter(e.target.value); setclicked(false); setInvalid(false) }} />

      <button onClick={addToAutoEnter} className="mybutton">{clicked ? "Yes" : "Auto In"}</button>
      {clicked && <div className='controlautoenter'>
        {AutoEnterMAS && AutoEnterMAS.map((element, index) => <div>{index === 0 ? `Is correct: ${element}` : (index !== AutoEnterMAS.length - 1 ? `,${element}` : `,${element} ?`)}</div>)}
      </div>}
      {Invalid && <div>INVALID</div>}
    </div >
  )
}

/*

*/