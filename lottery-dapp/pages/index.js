import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "/blockchain/A.json"
import Lottery from "/blockchain/Lottery.json"
import { LotteryAddressETH, LotteryAddressBNB, ETHid, BNBid, PRODACTION, ALCHEMY_KEY, INFURA_KEY } from '/components/Constants.js';


import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  defaultChains,
  useAccount,
  useContractWrite,
  usePrepareContractWritde,
  useConnect,
  useDisconnect,
  useSigner,
  useNetwork,
  useSwitchNetwork,
  useProvider
} from 'wagmi';
export default function Home({ LOTTERY_ADDRESS, VERSION, setVERSION, chainId, setneedCheckNFT, tymblerNaNetwork, settxData, setneedWallet }) {

  const { address, isConnected } = useAccount()

  const [IsNEWS, setIsNEWS] = useState(false)

  // const [addTokenAddress, setaddTokenAddress] = useState('')
  // const [isvalid, setvalid] = useState(false)

  // const [rokens, setTokens] = useState(() => {
  //   try {
  //     const f = localStorage.getItem("tokensCount")
  //     const g = []
  //     for (let i = 0; i < f; i++) {
  //       g.push({
  //         address: 0
  //       })
  //     }
  //     return g
  //   } catch (err) {
  //     console.log(err)
  //   }

  // })
  // const [PromSet, setPromSet] = useState(null)
  // const [PromInput, setPromInput] = useState(null)


  // const provider = useProvider()
  // const { data } = useSigner()

  // const { switchNetwork } = useSwitchNetwork()

  // const [Mode, setMode] = useState(true)
  // const [ModeMistery, setModeMistery] = useState(false)
  // const [Mistery, setMistery] = useState("")

  // const [TokenSelected, setTokenSelected] = useState()

  // const [tokenTransfered, settokenTransfered] = useState(false)


  // const [AutoEnter, setAutoEnter] = useState([])
  // const [ImageInAutoEnter, setImageInAutoEnter] = useState(0)

  // const [shouldrevard, setshouldrevard] = useState({})
  // const { disconnect } = useDisconnect()


  // useEffect(() => {
  //   getTokens()
  // }, [address, chainId, active])


  // useEffect(() => {
  //   checkValidAddress()
  // }, [addTokenAddress])


  // const tryMistery = async () => {
  //   settxData({
  //     isPending: true,
  //     result: null
  //   })
  //   try {
  //     const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
  //     const tx = await contract.tryMistery(Mistery)
  //     await tx.wait()
  //     const revard = await contract.getRevardGenius()
  //     if (revard == 0) {
  //       settxData({
  //         isPending: false,
  //         result: true
  //       })
  //       setshouldrevard(shouldrevard + 10 ** 7)
  //     }
  //     else {
  //       settxData({
  //         isPending: false,
  //         result: false,
  //         issue: "No this time"
  //       })
  //     }
  //     document.getElementById("Mistery").value = "";
  //     setMistery("")
  //   } catch (err) {
  //     console.log(err.reason)
  //     let issue
  //     if (err.reason == "execution reverted: Time") {
  //       issue = "An hour must elapse between attempts"
  //     }
  //     if (err.reason == "execution reverted: prize lost") {
  //       issue = "Mistery solved"
  //     }
  //     settxData({
  //       isPending: false,
  //       result: false,
  //       issue
  //     })
  //   }
  // }

  // const checkValidAddress = async () => {
  //   let flag = true
  //   rokens.forEach(element => {
  //     if (element.address == addTokenAddress)
  //       flag = false
  //   });
  //   let sup, dec, symb
  //   if (flag) {
  //     try {
  //       const contract = new ethers.Contract(addTokenAddress, A.abi, provider)
  //       sup = await contract.totalSupply()//проверка на валидность
  //       try {
  //         dec = await contract.decimals()
  //       } catch {
  //         dec = 18
  //       }

  //       try {
  //         symb = await contract.symbol()
  //       } catch {
  //         symb = "000"
  //       }

  //       console.log("valid")
  //     } catch (err) {
  //       console.log(err, "no valid")
  //     }
  //   }

  //   sup != undefined ? setvalid(true) : setvalid(false)

  //   let _flag = false
  //   if (sup != undefined)
  //     _flag = true
  //   const data = {
  //     flag: _flag,
  //     symbol: symb,
  //     decimals: dec
  //   }
  //   return data
  // }

  // const getTokens = async () => {
  //   try {
  //     const body = { address, chainId }
  //     await fetch('/api/getUserTokens', {
  //       method: "POST",
  //       body: JSON.stringify(body)
  //     }).then(async (data) => {
  //       const temp = await data.json()
  //       const objects = []
  //       temp.forEach((element) => {
  //         objects.push({
  //           address: element.address,
  //           symbol: element.symbol,
  //           decimals: element.decimals,
  //           balance: undefined,
  //           isImageAdded: element.isImageAdded
  //         })
  //       })
  //       setTokens(objects)
  //       console.log("tokensCount")
  //       localStorage.setItem("tokensCount", objects.length)
  //     })
  //   } catch (err) {
  //     console.log("getUserTokens", err)
  //   }
  //   ////////////////////////////////////////////////
  //   try {
  //     const body = { user: address, chainId }
  //     await fetch('/api/getUserData', {
  //       method: "POST",
  //       body: JSON.stringify(body)
  //     })
  //       .then(async (data) => {
  //         const temp = await data.json()
  //         let set, In, Auto
  //         if (chainId === ETHid) {
  //           set = temp.PromSetETH
  //           In = temp.PromInputETH
  //           Auto = temp.AutoEnterETH
  //         }
  //         else {
  //           set = temp.PromSetBNB
  //           In = temp.PromInputBNB
  //           Auto = temp.AutoEnterBNB
  //         }
  //         const contractLottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)

  //         try {
  //           const temp = parseInt(await contractLottery.getshouldRevard(address))
  //           const r = parseInt(await contractLottery.getcountOfLotteryEnter(address))
  //           const tyy = {
  //             count: temp,
  //             isEnteredOnce: r
  //           }
  //           setshouldrevard(tyy)
  //         } catch (err) {
  //           console.log("dich", err)
  //           setshouldrevard({
  //             count: 0,
  //             isEnteredOnce: undefined
  //           })
  //         }


  //         if (Auto != null) {
  //           Auto = Auto.split("_")
  //           Auto.pop()
  //           Auto.sort((a, b) => {
  //             return a - b
  //           })
  //           let id = 1001
  //           try {
  //             id = parseInt(await contractLottery.getLotteryCount())

  //           } catch (err) {
  //             console.log(err)
  //           }

  //           Auto.forEach(async element => {
  //             if (element < id) {
  //               const body = { address, chainId, tokenId: element }
  //               Auto.splice(Auto.indexOf(element), 1)
  //               await fetch('/api/deleteFromAutoEnter', {
  //                 method: "POST",
  //                 body: JSON.stringify(body)
  //               })
  //             }
  //           })
  //         }
  //         setPromSet(set)
  //         setPromInput(In)
  //         setAutoEnter(Auto)
  //       })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  // function deleteTokenFromFronend(address) {
  //   const temp = []
  //   rokens.map(element => {
  //     if (element.address != address)
  //       temp.push(element)
  //   });
  //   setTokens(temp)
  // }

  // const addToAutoEnter = async () => {
  //   settxData({
  //     isPending: true,
  //     result: null
  //   })
  //   try {
  //     const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
  //     console.log("AutoEnter", AutoEnter)
  //     const tx = await contract.addToAutoEnter(AutoEnter)
  //     await tx.wait()
  //     const body = { address, chainId, tokenId: -1 }
  //     await fetch('/api/deleteFromAutoEnter', {
  //       method: "POST",
  //       body: JSON.stringify(body)
  //     })
  //     setAutoEnter([])
  //     settxData({
  //       isPending: false,
  //       result: true
  //     })
  //     setENTERED(true)
  //     setTokens()
  //   } catch (err) {
  //     console.log(err)
  //     settxData({
  //       isPending: false,
  //       result: false
  //     })
  //   }
  // }

  // const addToken = async () => {
  //   const n = new Promise((res) => {
  //     res(checkValidAddress())
  //   })
  //   n.then(async (result) => {
  //     if (result.flag) {
  //       const _addTokenAddress = addTokenAddress
  //       const body = { address, addTokenAddress: _addTokenAddress, chainId, symbol: result.symbol, decimals: result.decimals }
  //       const data = {
  //         address: _addTokenAddress,
  //         symbol: result.symbol,
  //         decimals: result.decimals,
  //         balance: 0
  //       }
  //       setTokens([...rokens, data])
  //       try {
  //         await fetch('/api/addToken', {
  //           method: "PUT",
  //           body: JSON.stringify(body)
  //         }).then(() => {
  //           getTokens()
  //         })

  //         document.getElementById("inputToken").value = "";
  //         setaddTokenAddress()
  //       } catch (err) {
  //         console.log(err)
  //       }

  //       try {
  //         await fetch('/api/addTokenGlobal', {
  //           method: "POST",
  //           body: JSON.stringify(body)
  //         })

  //       } catch {
  //         console.log(err)
  //       }
  //       setTokenSelected()
  //     }
  //     localStorage.setItem("addToken", "true")
  //   })


  // }

  // const makePDF = async () => {
  //   let data
  //   try {
  //     const body = { user: address, chainId }
  //     await fetch("/api/pdf", {
  //       method: "POST",
  //       body: JSON.stringify(body)
  //     }).then(async (_data) => {
  //       data = await _data.json()
  //       console.log(data)
  //       pdfMake.createPdf(data).open();
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }



  // }

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
  const { chain } = useNetwork()

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
      _provider = new ethers.providers.InfuraProvider("goerli", INFURA_KEY)
    else
      _provider = new ethers.providers.InfuraProvider("sepolia", INFURA_KEY)
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
          document.getElementById("hours").innerHTML = (hours > 9 ? "" : "0") + hours + ":"
          document.getElementById("minutes").innerHTML = (minutes > 9 ? "" : "0") + minutes + ":"
          document.getElementById("seconds").innerHTML = (seconds > 9 ? "" : "0") + seconds
        } catch (err) {
          // clearInterval(x)
        }

    }, 1000);
  }

  const listenEvent = async (ID) => {
    console.log("###", ID, chain?.id)
    let _provider
    if (tymblerNaNetwork)
      _provider = new ethers.providers.InfuraProvider("goerli", INFURA_KEY)
    else
      _provider = new ethers.providers.InfuraProvider("sepolia", INFURA_KEY)
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
            setneedCheckNFT(true)
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
        _provider = new ethers.providers.InfuraProvider("goerli", INFURA_KEY)
      else
        _provider = new ethers.providers.InfuraProvider("sepolia", INFURA_KEY)
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
      const tx = await contract.addToAutoEnter([parseInt(await contract.getLotteryCount())])
      await tx.wait()
      setamIn(true)
      // contract.once("enter", async () => {
      //   console.log("Welcome!", address)
      // })
      settxData({
        isPending: false,
        result: true
      })
    } catch (err) {
      console.log(err)
      let issue
      if (isConnected)
        issue = IssueMaker({ data: err.code, from: "Enter" })
      else
        issue = "Connect wallet"
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
    <div className=''>
      <Head>
        <title>!Mudebz</title>
        <meta name="description" content="An Ethereum Lottery dApp" />
      </Head>
      <div className=''>

        <div className='Timer'>
          <div className='timer' id="hours"  ></div>
          <div className='timer' id="minutes"  ></div>
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
        {isneedShadow &&
          <div className='chooseWinner chooseWinnerText'>
            Choose winner
          </div>
        }
        {isneedShadow &&
          <div className='chooseWinner chooseWinnerLoader'>
            <Loader />
          </div>
        }
      </div>
      {/* <Image src="/persons.png" width={30} height={30} /> */}


    </div >
  )
}