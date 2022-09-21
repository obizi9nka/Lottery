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

import '@rainbow-me/rainbowkit/styles.css';



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


import { infuraProvider } from 'wagmi/providers/infura'
import { ConnectButton, connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import InfoPopUp from '../components/InfoPopUp';



const { chains, provider } = configureChains(
  [chain.rinkeby, chain.localhost, chain.mainnet],
  [
    publicProvider()
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


  const [logo, setlogo] = useState('/star-big.png')
  const [needRender, setNeedRender] = useState(false)

  const [isSession, setIsSession] = useState(false)

  const [tymblerNaNetwork, settymblerNaNetwork] = useState(true)

  const [needWallet, setneedWallet] = useState(false)

  const { chain } = useNetwork()

  const [txData, settxData] = useState({
    isPending: null,
    result: null
  })


  useEffect(() => {
    settymblerNaNetwork(chain == undefined ? tymblerNaNetwork : (chain.id == 4 ? true : false))
  }, [chain])


  // if (needRender) {
  //   console.log("was", needRender)
  //   setNeedRender(false)
  // }


  const [chainId, setchainId] = useState(0)

  const checkChain = async () => {
    if (chainId == 31337) {
      setlogo('/logos/black.png')
    }
    else if (chainId == 4) {
      setlogo('/logos/orange.png')
    }
    else {
      setlogo('/logos/purple.png')
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
            <div className='navigation' onClick={() => setIsSession(true)}>
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
            <div className='image' onClick={() => {
              if (chain == undefined)
                settymblerNaNetwork(!tymblerNaNetwork)
              else {
                console.log("sended")
              }
            }} >
              <Image src={logo} width="280px" height="130px" />
            </div>
            <Wallet settxData={settxData} needWallet={needWallet} setchainId={setchainId} setNeedRender={setNeedRender} tymblerNaNetwork={tymblerNaNetwork} />
          </div>
        </div >
        <Component {...pageProps} setneedWallet={setneedWallet} settxData={settxData} tymblerNaNetwork={tymblerNaNetwork} isSession={isSession} setIsSession={setIsSession} />

        <footer>
        </footer>
      </WagmiConfig>

    </div >
  )
}

export default MyApp