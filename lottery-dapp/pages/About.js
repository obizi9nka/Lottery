import Head from 'next/head'
import Image from 'next/image'
const { ethers } = require("ethers");
import { useState, useEffect } from 'react'
import MudebzNFT from "C:/Lottery/lottery/artifacts/contracts/MudebzNFT.sol/MudebzNFT.json"
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"
import A from "C:/Lottery/lottery/artifacts/contracts/A.sol/A.json"


export default function Home({ tymblerNaNetwork }) {



    const BAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    const AAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
    const MudeBzNFTAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [TokenId, setTokenId] = useState()
    const [freeTokens, setFreeTokens] = useState(0)
    const [deposit, setdeposit] = useState(0)
    const [lotteryPlayers, setPlayers] = useState([])

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
            //const tx = await contract.allowToNFT(1)
            const tx = await contract._allowToNFT("0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc")
            // const contract = new ethers.Contract(MudeBzNFTAddress, MudeBzNFT.abi, provider)
            // const tx = contract.istokenMints(1)
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
            const contract = new ethers.Contract(BAddress, A.abi, provider)
            const address = await signer.getAddress()
            try {
                const balance = await contract.balanceOf(address)
                console.log('data :', parseInt(balance * 10 ** 18), parseInt(balance))
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
                const balance = await contract.getBalance(BAddress, address)
                console.log('balance contract :', parseFloat(balance / 10 ** 18), parseInt(balance))
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
                console.log("Winer:", (await contract.getLotteryShablonByIndex(parseInt(await contract.getLotteryCount() - 1, 10))).winer)
            })
        }
    }


    const createNewLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.createNewLobby(AAddress, deposit, countOfPlayers)
        await tx.wait()
        console.log(`creator: ${await signer.getAddress()}, deposit: ${deposit}, countOfPlayers: ${countOfPlayers}`)
    }

    const EnterLobby = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, signer)
        const tx = await contract.EnterLobby(LobbyCreator, LobbyId)
        await tx.wait()
        console.log(await contract.lobby(LobbyCreator, LobbyId))
    }

    const MintMarten = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.MintMarten(2, {
                value: 32
            })
            await tx.wait()
        }
    }

    const balanceNFT = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.balanceOf(singer.getAddress())
            console.log("balance: ", parseInt(tx))
        }
    }

    const [to, setto] = useState("")

    const getTokensForAddress = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.getTokensForAddress(singer.getAddress())
            console.log(tx)
        }
    }

    const transfer = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(MudeBzNFTAddress, MudebzNFT.abi, singer)
            const tx = await contract.transferFrom(singer.getAddress(), to, 1)
            console.log("transfer: ", tx)
        }
    }

    const transferTokens = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const singer = provider.getSigner()
            const contract = new ethers.Contract(AAddress, A.abi, singer)
            const tx = await contract.transfer(to, BigInt(100 * 10 ** 18))
            console.log("transfer: ", tx)
        }
    }


    return (
        <div>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="about">
                <div className='syka'>
                    <div>
                        <div className='colorWHITE'>
                            <h2 >
                                1. Lottery
                            </h2>
                            <div className='obzach'>
                                Every day there is a chance to buy NFT.
                            </div>
                            <div className='obzach'>
                                In order to take part in the draw, you need to replenish the balance of the internal wallet by
                                <strong className="colorPURPLE"> 5 USDT</strong> <br />
                                and with the help of these funds, by clicking on the <strong className="colorPURPLE">
                                    Am In!</strong>  button, you become a participant in the draw.
                            </div>
                            <div className='obzach'>
                                <strong className="colorPURPLE">The winner takes everything</strong>,
                                absolutely everything .
                                <br /> All collected <strong className="colorPURPLE">coins </strong>
                                during the day and the opportunity* to purchase
                                <strong className="colorPURPLE"> NFT</strong>.
                            </div>
                            <div className='PS'>
                                *50 days are given to redeem the NFT,
                                if on the fiftieth day the NFT is not minted,
                                then the winner loses the opportunity to purchase this NFT.
                            </div>
                        </div>



                        <div className='colorWHITE'>
                            <h2 >
                                2. Galary
                            </h2>
                            <div className='obzach'>
                                In the gallery you can see the entire nft collection<br />
                                and find out which nft has already been minted<div className='Agreendot' ></div>
                                and which has not yet <div className='Areddot' ></div>.
                            </div>
                            <div className='obzach'>
                                Also, the gallery is a marketplace. The owner of NFT can put it up for sale,<br /> and anyone can buy* it for the price indicated by the seller.
                            </div>
                            <div className='PS'>
                                * For the purchase, the necessary funds must be in<strong className="colorPURPLE"> your personal wallet</strong>, and not on the internal one.
                            </div>
                        </div>


                        <div className='colorWHITE'>
                            <h2 >
                                3. Lobby
                            </h2>
                            <div className='obzach'>
                                Lobby is a game of <strong className="colorPURPLE"> heads and tails</strong>  with extensive customization.
                            </div>
                            <div className='obzach'>
                                <li>
                                    Choose any erc20 standard <strong className="colorPURPLE"> coin</strong>.
                                </li>
                                <li>
                                    Select the <strong className="colorPURPLE"> number of players</strong> between 2 and 1000.
                                </li>
                                <li>
                                    And specify any <strong className="colorPURPLE"> deposit</strong>.
                                </li>
                                <div className='obzach'>
                                    That's it - you've created a lobby. Now anyone can join your lobby.<br />
                                    As soon as the required number of players is reached, the collected coins will be drawn instantly.
                                </div>
                                <div className='obzach'>
                                    The only limitation is that you can't have more than 10 active lobbies per wallet.<br />
                                    That's all.  <strong className="colorPURPLE">No commissions</strong>, just random.
                                </div>
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                4. NFTS
                            </h2>
                            <div className='obzach'>
                                So, what is included with NFT?
                            </div>
                            <li>
                                <strong className="colorPURPLE">Day</strong>. Well, yes, it's your day, congratulations, clap clap.
                            </li>
                            <li>
                                The ability to join a <strong className="colorPURPLE">discord channel</strong> and communicate directly with the creator.
                            </li>
                            <li>
                                <strong className="colorPURPLE">Merch</strong>.
                            </li>
                            <li>
                                Mudebz token <strong className="colorPURPLE">airdrop</strong>.
                            </li>
                            <div className='obzach'>
                                Then you can come up with something else.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                5. MUD
                            </h2>
                            <div className='obzach'>
                                So, mudebz token airdrop. It will happen <strong className="colorPURPLE">on 1050 lottery</strong>.
                            </div>
                            <div className='obzach'>
                                Who will receive the tokens?
                            </div>
                            <li>
                                <strong className="colorPURPLE">Holders nft</strong>.
                            </li>
                            <li>
                                <strong className="colorPURPLE">Wallets that have ever owned any NFT</strong>.
                            </li>
                            <li>
                                <strong className="colorPURPLE">Members of the referral program</strong>.
                            </li>
                            <div className='obzach'>
                                Emission of tokens: <strong className="colorPURPLE">1,000,000,000</strong>.
                            </div>
                            <li>
                                NFT holders will share <strong className="colorPURPLE">8%</strong>.
                            </li>
                            <li>
                                Wallets ever owning NFTs will share <strong className="colorPURPLE">19%</strong>.
                            </li>
                            <li>
                                <strong className="colorPURPLE">21%</strong> of tokens allocated for the referral program.
                            </li>
                            <div className='obzach'>
                                Further, <strong className="colorPURPLE">from 1051 to 2050 lottery</strong>, the remaining tokens will be drawn.
                            </div>
                            <div className='obzach'>
                                Every day 300,000 will be drawn in the <strong className="colorPURPLE">lobby</strong>.<br />
                                Also, all <strong className="colorPURPLE">lottery </strong>players will share 90,000 tokens per day.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                6. Referral
                            </h2>
                            <div className='obzach'>
                                Refer a friend and you both get <strong className="colorPURPLE">100 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                Create your promo code and share it.<br />
                                When someone enters your promo code before their <strong className="colorPURPLE">first participation in the draw</strong>,<br /> you will both receive 100 MUD.
                            </div>

                            <div className='obzach'>
                                If you have ever participated in the NFT draw,<br />
                                then you no longer have the opportunity to use someone else's promotional code.
                            </div>

                            <div className='obzach'>
                                You can create your promo code at <strong className="colorPURPLE">any time</strong>.
                            </div>
                            <div className='obzach'>
                                You can create and enter a promotional code <strong className="colorPURPLE">only once!</strong>
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                7. Important
                            </h2>
                            <div className='obzach'>
                                1. In order <strong className="colorPURPLE">to receive tokens in the lobby</strong>, you need to:
                            </div>
                            <li>
                                Play with a <strong className="colorPURPLE">MUD token</strong>.
                            </li>
                            <li>
                                Deposit must be at least <strong className="colorPURPLE">10 </strong>.
                            </li>
                            <div className='obzach'>
                                After the lobby draw, <strong className="colorPURPLE">all</strong> participants will receive <strong className="colorPURPLE">10 MUD</strong>.
                            </div>
                            <div className='obzach'>
                                2. At 1051 lottery, the lottery coin will be changed to <strong className="colorPURPLE">MUD</strong>.
                            </div>
                            <div className='obzach'>
                                3. The maximum number of people who can share 19% is  <strong className="colorPURPLE">100,000</strong>.<br />
                                That is, only unique wallets from the first each NFT 100  transfers.
                            </div>

                        </div>
                    </div>
                </div>






            </div>



































            <nav className="navbar mt-4 mb-4">
                <div className='container'>
                    <div>
                        <button onClick={getTokens} className="button is-link"> Free tokens</button>
                        <input
                            onChange={e => setFreeTokens(e.target.value)}
                        />
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={balanceOf} className="button is-link">balanceOf</button>
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={Enter} className="button is-link" >Enter</button>
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={addTokensToBalance} className="button is-link" >Add</button>
                        <input
                            onChange={e => setdeposit(e.target.value)}
                        />
                    </div>
                </div>
            </nav>
            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={balanceInTokenForAccount} className="button is-link">Check balance</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={getLotteryShablonByIndex} className="button is-link">Players</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={Play} className="button is-link">Play</button>
                    </div>
                </div>
            </nav>

            <nav className="navbar mt-4 mb-4">
                <div className="container">
                    <div className="navbar">
                        <button onClick={allowToNFT} className="button is-link">allowToNFT</button>
                    </div>
                </div>
            </nav>



            <div>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={createNewLobby} className="button is-link">createNewLobby</button>
                            <input
                                onChange={e => setdeposit(e.target.value)}
                            />
                            <input
                                onChange={e => setcountOfPlayers(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>

                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={EnterLobby} className="button is-link">EnterLobby</button>
                            <input
                                onChange={e => setLobbyCreator(e.target.value)}
                            />
                            <input
                                onChange={e => setLobbyId(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>

                <nav className="navbar mt-4 mb-4">
                    <div className="container">
                        <div className="navbar">
                            <button onClick={balanceInTokenForAccount} className="button is-link">chek balance</button>
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className="container">
                        <div className="navbar">
                            <button onClick={addTokensToBalance} className="button is-link" >Add</button>
                            <input
                                onChange={e => setdeposit(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>

                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={MintMarten} className="button is-link">MintMarten</button>
                            <input
                                onChange={e => setTokenId(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>

                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={balanceNFT} className="button is-link">balanceOf</button>
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={getTokensForAddress} className="button is-link">getTokensForAddress</button>
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={transfer} className="button is-link">transfer</button>
                            <input
                                onChange={e => setto(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>
                <nav className="navbar mt-4 mb-4">
                    <div className='container'>
                        <div>
                            <button onClick={transferTokens} className="button is-link">transferTOKENS</button>
                            <input
                                onChange={e => setto(e.target.value)}
                            />
                        </div>
                    </div>
                </nav>


            </div>

        </div >
    )
}