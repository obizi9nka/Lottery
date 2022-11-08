import '../styles/globals.css'
import '../styles/index.css'
import '../styles/galary.css'
import '../styles/lobby.css'
import '../styles/about.css'
import '../styles/app.css'

import "../styles/wallet.css"
import "../styles/walletAlert.css"
import "../styles/news.css"
import "../styles/lobbyShablon.css"
import "../styles/nftShablon.css"


import '@rainbow-me/rainbowkit/styles.css';

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Wallet from '../components/Wallet';
import Head from 'next/head';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressBNB, MudeBzNFTBNB, ETHid, BNBid, } from '/components/Constants.js';
import notForYourEyesBitch from "../notForYourEyesBitch.json"

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
  useNetwork,
  defaultChains,
  useAccount,
  useContractWrite,
  usePrepareContractWritde
} from 'wagmi';


import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import InfoPopUp from '../components/InfoPopUp';


const BNBChain = {
  id: 56,
  name: 'Binance',
  network: 'BNB',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: 'https://bsc-dataseed.binance.org/',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://bscscan.com' },
  },
  testnet: false,
};


const { chains, provider } = configureChains(
  [chain.goerli, chain.sepolia, chain.hardhat, BNBChain, chain.mainnet],
  [
    alchemyProvider({ apiKey: notForYourEyesBitch.alchemykey }),
    infuraProvider({ apiKey: notForYourEyesBitch.infuraKey }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== BNBChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets(
  {
    appName: 'e',
    chains
  },
);
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


function MyApp({ Component, pageProps }) {



  const [logo, setlogo] = useState('/Logos/purple.png')

  const [isSession, setIsSession] = useState(false)

  const [tymblerNaNetwork, settymblerNaNetwork] = useState(true)

  const [needWallet, setneedWallet] = useState(false)

  const [daloyNFTbutton, setdaloyNFTbutton] = useState(false)
  const [daloynavigationSmartfon, setdaloynavigationSmartfon] = useState(false)


  const [LOTTERY_ADDRESS, setlotteryAddress] = useState("")
  const [NFT_ADDRESS, setnftAddress] = useState("")

  const [isWalletAlert, setisWalletAlert] = useState(false)

  const { chain } = useNetwork()

  const [txData, settxData] = useState({
    isPending: null,
    result: null
  })

  const [chainId, setchainId] = useState(0)

  const [ENTERED, setENTERED] = useState(false)


  useEffect(() => {
    settymblerNaNetwork(chain == undefined ? tymblerNaNetwork : (chain.id == ETHid ? true : false))
  }, [chain])

  console.log(chainId, LOTTERY_ADDRESS)

  useEffect(() => {
    setchainId(chain != undefined ? chain.id : 0)
    if (chain != undefined) {
      setlotteryAddress(chain.id === ETHid ? LotteryAddressETH : LotteryAddressBNB)
      setnftAddress(chain.id === ETHid ? MudeBzNFTETH : MudeBzNFTBNB)
    }
    else {
      setlotteryAddress(tymblerNaNetwork ? LotteryAddressETH : LotteryAddressBNB)
      setnftAddress(tymblerNaNetwork ? MudeBzNFTETH : MudeBzNFTBNB)
    }
  }, [chain, tymblerNaNetwork])

  const checkChain = async () => {
    if (chain?.id == ETHid) {
      setlogo('/Logos/black.png')
    }
    else if (chain?.id == BNBid) {
      setlogo('/Logos/orange.png')
    }
    else {
      setlogo('/Logos/purple.png')
    }
  }

  useEffect(() => {
    checkChain()
  }, [chainId])



  return (

    <div className='main'>

      <Head>
        <meta name="viewport" content='width=device-width' />

      </Head>
      <InfoPopUp data={txData} settxData={settxData} />
      <WagmiConfig client={wagmiClient}>
        <div className="nav">
          <div className='content'>
            <div className='navigation' onClick={() => { setIsSession(true); setdaloyNFTbutton(true) }}>
              <Link href="/" >
                <a className='menu'> Lottery </a>
              </Link>
              <Link href="/Lobbyes">
                <a className='menu'> Lobby </a>
              </Link>
              <Link href="/Galary">
                <a className='menu'> Gallery </a>
              </Link>
              <Link href="/About">
                <a className='menu'> About </a>
              </Link>
            </div>

            <div className='image' onClick={() => {
              if (chain == undefined)
                settymblerNaNetwork(!tymblerNaNetwork)
              else {
                console.log("sended")
              }
            }} >
              <div >
                <Image src={logo} width="280px" height="75px" />
              </div>
              <div className='beta'>
                <Image src={"/beta.png"} width={50} height={50} />
              </div>

            </div>
            <Wallet isWalletAlert={isWalletAlert} setENTERED={setENTERED} setisWalletAlert={setisWalletAlert} chains={chains} LOTTERY_ADDRESS={LOTTERY_ADDRESS} BNBChain={BNBChain} txData={txData} NFT_ADDRESS={NFT_ADDRESS} setdaloynavigationSmartfon={setdaloynavigationSmartfon} daloyNFTbutton={daloyNFTbutton} setdaloyNFTbutton={setdaloyNFTbutton} settxData={settxData} needWallet={needWallet} setchainId={setchainId} tymblerNaNetwork={tymblerNaNetwork} />
          </div>
        </div >
        <Component {...pageProps} ENTERED={ENTERED} setENTERED={setENTERED} LOTTERY_ADDRESS={LOTTERY_ADDRESS} NFT_ADDRESS={NFT_ADDRESS} setneedWallet={setneedWallet} settxData={settxData} tymblerNaNetwork={tymblerNaNetwork} isSession={isSession} setIsSession={setIsSession} chainId={chainId} />

        <footer>
        </footer>
      </WagmiConfig>
      <div className='prenavigationSmartfon' />
      <div className='navigationSmartfon' style={{ opacity: daloynavigationSmartfon || isWalletAlert ? "0" : "1", pointerEvents: daloynavigationSmartfon || isWalletAlert ? "none" : "all" }} onClick={() => { setIsSession(true); setdaloyNFTbutton(true) }}>
        <Link href="/" >
          <a className='menuSmartfon'> Lottery </a>
        </Link>
        <Link href="/Lobbyes">
          <a className='menuSmartfon'> Lobby </a>
        </Link>
        <Link href="/Galary">
          <a className='menuSmartfon'> Gallery </a>
        </Link>
        <Link href="/About">
          <a className='menuSmartfon'> About </a>
        </Link>
      </div>

    </div >

  )
}

export default MyApp