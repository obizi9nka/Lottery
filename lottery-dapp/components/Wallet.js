import Image from 'next/image'
import Link from 'next/link'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MintNftButton from '../components/MintNftButton';
import Lottery from "/blockchain/Lottery.json"
import MudebzNFT from "/blockchain/MudebzNFT.json"
import WalletAlert from './WalletAlert';
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressLocalhost, MudeBzNFTLocalhost, LotteryAddressBNB, MudeBzNFTBNB, ETHid } from './Constants';
import News from './News';

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
    defaultChains,
    useAccount,
    useContractWrite,
    usePrepareContractWritde,
    useConnect,
    useNetwork, useProvider, chainId
} from 'wagmi';


import { infuraProvider } from 'wagmi/providers/infura'
import { ConnectButton, connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

export default function Wallet({ chains, LOTTERY_ADDRESS, setENTERED, isWalletAlert, setisWalletAlert, NFT_ADDRESS, BNBChain, setdaloynavigationSmartfon, setchainId, tymblerNaNetwork, daloyNFTbutton, setdaloyNFTbutton, settxData, needWallet, txData }) {


    const [NftButton, setNftButton] = useState(false)
    const [isWalletConnect, setisWalletConnect] = useState(false)


    const { chain } = useNetwork()
    const provider = useProvider()


    useEffect(() => {
        console.log(chain)
        setchainId(chain != undefined ? chain.id : 0)
    }, [chain])


    const { address, isConnected, isConnecting } = useAccount()

    useEffect(() => {
        checkNftButton()
        getAllNews()
    }, [address, chain, LOTTERY_ADDRESS, NFT_ADDRESS])

    useEffect(() => {
        if (isConnected) {
            console.log('Connected', chain.id)
            localStorage.setItem("WalletConnect", "true")
            setNewUSer()
            setisWalletConnect(true)
            setchainId(chain.id)
        }
        else {
            console.log('Disconnected')
            setisWalletConnect(false)
            localStorage.removeItem("WalletConnect")
            setchainId(0)
        }
    }, [isConnected, chain])


    async function setNewUSer() {
        try {
            const body = { address, chainId: chain.id }

            await fetch('/api/user', {
                method: "POST",
                body: JSON.stringify(body)
            }).then((data) => {
                if (data.status == 200) {
                    // window.location = "http://localhost:3000/About"
                }
            })
        } catch (err) {

        }

    }

    const checkNftButton = async () => {
        try {
            const lottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)
            const nft = new ethers.Contract(NFT_ADDRESS, MudebzNFT.abi, provider)
            const wins = await lottery._allowToNFT(address)
            let flag = false
            for (let i = 0; i < parseInt(wins.lotteryes.length, 10); i++) {
                if (!await nft.istokenMints(parseInt(wins.lotteryes[i], 10))) {
                    flag = true
                    break
                }
            }
            setNftButton(flag)
        } catch (err) {
            setNftButton(false)
            console.log(err)
        }
    }

    const [news, setnews] = useState([])
    const [now, setnow] = useState()

    const getAllNews = async () => {
        try {
            const user = address
            const constructorNews = []
            const body = { user, chainId: chain.id }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(async (data) => {
                    const tr = await data.json()
                    let temp
                    if (chain.id == ETHid)
                        temp = tr.newsETH
                    else
                        temp = tr.newsBNB
                    if (temp == null)
                        return
                    const t = temp.split("&")
                    t.pop()
                    t.map(element => {
                        let data = element.split("_")
                        let winOrLose = "Lose"
                        if (data[5] == "1") {
                            winOrLose = "Win"
                        }
                        constructorNews.push(Object({
                            creator: data[0],
                            id: data[1],
                            token: data[2],
                            deposit: data[3],
                            countOfPlayers: data[4],
                            isWin: winOrLose
                        }
                        ))
                    });

                })
            const _now = new Date();
            setnow(_now)
            constructorNews.reverse()
            setnews(constructorNews)
        } catch (err) {
            setnews()
            console.log(err)
        }
    }

    const deleteNews = async () => {
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = provider.getSigner()
        const u = address//await signer.getAddress()
        try {
            await fetch("/api/deleteAllNews", {
                method: "POST",
                body: u
            })
        } catch (err) {
            console.log(err)
        }
        setnews([])
    }


    if (isWalletConnect)
        return (
            <div className='wallet'>
                <div className="dropdown" onClick={getAllNews}>
                    <Image src="/news.png" width={25} height={25} />
                    <News news={news} now={now} deleteNews={deleteNews} />
                </div>
                <div className='otstup'>{NftButton && <MintNftButton LOTTERY_ADDRESS={LOTTERY_ADDRESS} NFT_ADDRESS={NFT_ADDRESS} settxData={settxData} daloyNFTbutton={daloyNFTbutton} setdaloyNFTbutton={setdaloyNFTbutton} tymblerNaNetwork={tymblerNaNetwork} chainId={chain != undefined ? chain.id : 0} address={address} />}</div>
                {address && <div className='otstup'><button onClick={() => {
                    if (!isWalletAlert)
                        document.body.style.overflow = ('overflow', 'hidden')
                    setisWalletAlert(!isWalletAlert)
                    setdaloynavigationSmartfon(isWalletAlert)
                }} className="mybutton size" > {"0x..." + address.substring(38, 42)}</button></div>}
                <WalletAlert LOTTERY_ADDRESS={LOTTERY_ADDRESS} setENTERED={setENTERED} txData={txData} NFT_ADDRESS={NFT_ADDRESS} settxData={settxData} tymblerNaNetwork={tymblerNaNetwork} active={isWalletAlert} setActive={setisWalletAlert} chainId={chain != undefined ? chain.id : 0} address={address} />
            </div >

        )
    else {
        return (
            <div className='wallet' >
                <RainbowKitProvider chains={chains} theme={darkTheme()} >
                    {/* <ConnectButton></ConnectButton> */}
                    <ConnectButton.Custom  >
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            // Note: If your app doesn't use authentication, you
                            // can remove all 'authenticationStatus' checks
                            const ready = mounted && authenticationStatus !== 'loading';
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                BNBChain &&
                                (!authenticationStatus ||
                                    authenticationStatus === 'authenticated');

                            return (
                                <div
                                    {...(!ready && {
                                        'aria-hidden': true,
                                        'style': {
                                            opacity: 0,
                                            pointerEvents: 'none',
                                            userSelect: 'none',
                                        },
                                    })}                                    >
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <div>
                                                    <div className={needWallet ? "ConnectWallet" : ""}>
                                                        <button onClick={openConnectModal} className={needWallet ? "needWallet" : "mybutton"}>
                                                            Connect Wallet
                                                        </button>
                                                    </div>
                                                    <div className='noConnectWallet'>
                                                        <button onClick={openConnectModal} className={"mybutton"}>
                                                            Wallet
                                                        </button>
                                                    </div>
                                                </div>


                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <button onClick={openChainModal} type="button">
                                                    Wrong network
                                                </button>
                                            );
                                        }

                                        return (
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <button
                                                    onClick={openChainModal}
                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                    type="button"
                                                >
                                                    {chain.hasIcon && (
                                                        <div
                                                            style={{
                                                                background: chain.iconBackground,
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: 999,
                                                                overflow: 'hidden',
                                                                marginRight: 4,
                                                            }}
                                                        >
                                                            {chain.iconUrl && (
                                                                <img
                                                                    alt={chain.name ?? 'Chain icon'}
                                                                    src={chain.iconUrl}
                                                                    style={{ width: 12, height: 12 }}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    {chain.name}
                                                </button>

                                                <button onClick={openAccountModal} type="button">
                                                    {account.displayName}
                                                    {account.displayBalance
                                                        ? ` (${account.displayBalance})`
                                                        : ''}
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            );
                        }}
                    </ConnectButton.Custom>
                </RainbowKitProvider>
            </div>
        )
    }
}
