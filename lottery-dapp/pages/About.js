import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const { ethers } = require("ethers");
import TokensBalanceShablon from '../components/TokensBalanceShablon'
import A from "/blockchain/A.json"
import Lottery from "/blockchain/Lottery.json"
import { LotteryAddressETH, MudeBzNFTETH, LotteryAddressBNB, MudeBzNFTBNB, ETHid, BNBid } from '../components/Constants';


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
export default function Home({ LOTTERY_ADDRESS, NFT_ADDRESS, setENTERED, settxData, active, setActive, chainId, address, tymblerNaNetwork, txData }) {

    const [language, setLanguage] = useState("English")

    const [IsNEWS, setIsNEWS] = useState(false)

    const [addTokenAddress, setaddTokenAddress] = useState('')
    const [isvalid, setvalid] = useState(false)

    const [rokens, setTokens] = useState(() => {
        const f = localStorage.getItem("tokensCount")
        const g = []
        for (let i = 0; i < f; i++) {
            g.push({
                address: 0
            })
        }
        return g
    })

    const [PromSet, setPromSet] = useState(null)
    const [PromInput, setPromInput] = useState(null)


    const provider = useProvider()
    const { data } = useSigner()

    const { switchNetwork } = useSwitchNetwork()

    const [Mode, setMode] = useState(true)
    const [ModeMistery, setModeMistery] = useState(false)
    const [Mistery, setMistery] = useState("")

    const [TokenSelected, setTokenSelected] = useState()

    const [tokenTransfered, settokenTransfered] = useState(false)


    const [AutoEnter, setAutoEnter] = useState([])
    const [ImageInAutoEnter, setImageInAutoEnter] = useState(0)

    const [shouldrevard, setshouldrevard] = useState({})
    const { disconnect } = useDisconnect()


    useEffect(() => {
        getTokens()
    }, [address, chainId, active])


    useEffect(() => {
        checkValidAddress()
    }, [addTokenAddress])


    const tryMistery = async () => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
            const tx = await contract.tryMistery(Mistery)
            await tx.wait()
            const revard = await contract.getRevardGenius()
            if (revard == 0) {
                settxData({
                    isPending: false,
                    result: true
                })
                setshouldrevard(shouldrevard + 10 ** 7)
            }
            else {
                settxData({
                    isPending: false,
                    result: false,
                    issue: "No this time"
                })
            }
            document.getElementById("Mistery").value = "";
            setMistery("")
        } catch (err) {
            console.log(err.reason)
            let issue
            if (err.reason == "execution reverted: Time") {
                issue = "An hour must elapse between attempts"
            }
            if (err.reason == "execution reverted: prize lost") {
                issue = "Mistery solved"
            }
            settxData({
                isPending: false,
                result: false,
                issue
            })
        }
    }

    const checkValidAddress = async () => {
        let flag = true
        rokens.forEach(element => {
            if (element.address == addTokenAddress)
                flag = false
        });
        let sup, dec, symb
        if (flag) {
            try {
                const contract = new ethers.Contract(addTokenAddress, A.abi, provider)
                sup = await contract.totalSupply()//проверка на валидность
                try {
                    dec = await contract.decimals()
                } catch {
                    dec = 18
                }

                try {
                    symb = await contract.symbol()
                } catch {
                    symb = "000"
                }

                console.log("valid")
            } catch (err) {
                console.log(err, "no valid")
            }
        }

        sup != undefined ? setvalid(true) : setvalid(false)

        let _flag = false
        if (sup != undefined)
            _flag = true
        const data = {
            flag: _flag,
            symbol: symb,
            decimals: dec
        }
        return data
    }

    const getTokens = async () => {
        try {
            const body = { address, chainId }
            await fetch('/api/getUserTokens', {
                method: "POST",
                body: JSON.stringify(body)
            }).then(async (data) => {
                const temp = await data.json()
                const objects = []
                temp.forEach((element) => {
                    objects.push({
                        address: element.address,
                        symbol: element.symbol,
                        decimals: element.decimals,
                        balance: undefined,
                        isImageAdded: element.isImageAdded
                    })
                })
                setTokens(objects)
                console.log("tokensCount")
                localStorage.setItem("tokensCount", objects.length)
            })
        } catch (err) {
            console.log("getUserTokens", err)
        }
        ////////////////////////////////////////////////
        try {
            const body = { user: address, chainId }
            await fetch('/api/getUserData', {
                method: "POST",
                body: JSON.stringify(body)
            })
                .then(async (data) => {
                    const temp = await data.json()
                    let set, In, Auto
                    if (chainId === ETHid) {
                        set = temp.PromSetETH
                        In = temp.PromInputETH
                        Auto = temp.AutoEnterETH
                    }
                    else {
                        set = temp.PromSetBNB
                        In = temp.PromInputBNB
                        Auto = temp.AutoEnterBNB
                    }
                    const contractLottery = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, provider)

                    try {
                        const temp = parseInt(await contractLottery.getshouldRevard(address))
                        const r = parseInt(await contractLottery.getcountOfLotteryEnter(address))
                        const tyy = {
                            count: temp,
                            isEnteredOnce: r
                        }
                        setshouldrevard(tyy)
                    } catch (err) {
                        console.log("dich", err)
                        setshouldrevard({
                            count: 0,
                            isEnteredOnce: undefined
                        })
                    }


                    if (Auto != null) {
                        Auto = Auto.split("_")
                        Auto.pop()
                        Auto.sort((a, b) => {
                            return a - b
                        })
                        let id = 1001
                        try {
                            id = parseInt(await contractLottery.getLotteryCount())

                        } catch (err) {
                            console.log(err)
                        }

                        Auto.forEach(async element => {
                            if (element < id) {
                                const body = { address, chainId, tokenId: element }
                                Auto.splice(Auto.indexOf(element), 1)
                                await fetch('/api/deleteFromAutoEnter', {
                                    method: "POST",
                                    body: JSON.stringify(body)
                                })
                            }
                        })
                    }
                    setPromSet(set)
                    setPromInput(In)
                    setAutoEnter(Auto)
                })
        } catch (err) {
            console.log(err)
        }
    }

    function deleteTokenFromFronend(address) {
        const temp = []
        rokens.map(element => {
            if (element.address != address)
                temp.push(element)
        });
        setTokens(temp)
    }

    const addToAutoEnter = async () => {
        settxData({
            isPending: true,
            result: null
        })
        try {
            const contract = new ethers.Contract(LOTTERY_ADDRESS, Lottery.abi, data)
            console.log("AutoEnter", AutoEnter)
            const tx = await contract.addToAutoEnter(AutoEnter)
            await tx.wait()
            const body = { address, chainId, tokenId: -1 }
            await fetch('/api/deleteFromAutoEnter', {
                method: "POST",
                body: JSON.stringify(body)
            })
            setAutoEnter([])
            settxData({
                isPending: false,
                result: true
            })
            setENTERED(true)
            setTokens()
        } catch (err) {
            console.log(err)
            settxData({
                isPending: false,
                result: false
            })
        }
    }

    const addToken = async () => {
        const n = new Promise((res) => {
            res(checkValidAddress())
        })
        n.then(async (result) => {
            if (result.flag) {
                const _addTokenAddress = addTokenAddress
                const body = { address, addTokenAddress: _addTokenAddress, chainId, symbol: result.symbol, decimals: result.decimals }
                const data = {
                    address: _addTokenAddress,
                    symbol: result.symbol,
                    decimals: result.decimals,
                    balance: 0
                }
                setTokens([...rokens, data])
                try {
                    await fetch('/api/addToken', {
                        method: "PUT",
                        body: JSON.stringify(body)
                    }).then(() => {
                        getTokens()
                    })

                    document.getElementById("inputToken").value = "";
                    setaddTokenAddress()
                } catch (err) {
                    console.log(err)
                }

                try {
                    await fetch('/api/addTokenGlobal', {
                        method: "POST",
                        body: JSON.stringify(body)
                    })

                } catch {
                    console.log(err)
                }
                setTokenSelected()
            }
            localStorage.setItem("addToken", "true")
        })


    }

    const makePDF = async () => {
        let data
        try {
            const body = { user: address, chainId }
            await fetch("/api/pdf", {
                method: "POST",
                body: JSON.stringify(body)
            }).then(async (_data) => {
                data = await _data.json()
                console.log(data)
                pdfMake.createPdf(data).open();
            })
        } catch (err) {
            console.log(err)
        }



    }


    return (
        <div className=''>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
            </Head>
            {/* <div className='menuLobby menuHover pointer'>
                Lobby
            </div>
            <div className='menuGallery menuHover pointer'>
                Gallery
            </div>
            <div className='NewsButtonText menuHover pointer' onClick={() => { setIsNEWS(!IsNEWS) }}>
                News
            </div>
            {IsNEWS && <div className="" style={{ padding: "10px" }}>
                <div className="addToken">
                    {chainId == BNBid && <div className="misterySwitcher" onClick={() => { setModeMistery(!ModeMistery) }}></div>}
                    {!ModeMistery && <div>
                        <input className="input bigdinamic" id="inputToken" placeholder="Token Address" onChange={e => setaddTokenAddress(e.target.value)} style={{ color: isvalid ? "white" : "red" }} />
                    </div>}
                    {!ModeMistery && <div>
                        <button onClick={() => addToken()} className="mybutton" >Add new token</button>
                    </div>}
                    {ModeMistery && <div>
                        <input className="input bigdinamic" id="Mistery" placeholder="Your answer" onChange={e => setMistery(e.target.value)} />
                    </div>}
                    {ModeMistery && <div>
                        <button onClick={() => tryMistery()} className="mybutton" style={{ minWidth: "123.41px" }}>Try</button>
                    </div>}
                </div>
                <div className="areashablonbalance">

                    {rokens && rokens.map((element, index) =>
                        <TokensBalanceShablon LOTTERY_ADDRESS={LOTTERY_ADDRESS} txData={txData} NFT_ADDRESS={NFT_ADDRESS} settxData={settxData} rokens={rokens} tymblerNaNetwork={tymblerNaNetwork} tokenTransfered={tokenTransfered} setTokenSelected={setTokenSelected} TokenSelected={TokenSelected} user={address} element={element} chainId={chainId} settokenTransfered={settokenTransfered} index={{ index, last: rokens.length - 1 }} deleteTokenFromFronend={deleteTokenFromFronend} />
                    )}
                </div>
                <div className="relative">
                    <button className="disconnect" onClick={() => { disconnect(); setActive(false); document.body.style.overflow = ('overflow', 'auto'); }}>
                        <div></div>
                        <div>Disconnect</div>
                    </button>
                </div>

            </div>} */}
            <div className="about">
                <div className='syka'>
                    {language == "English" && <div>
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
                                absolutely everything.
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
                                2. Lobby
                            </h2>
                            <div className='obzach'>
                                Lobby is a game of <strong className="colorPURPLE"> heads and tails</strong>  with extensive customization.
                            </div>
                            <div className='obzach'>
                                {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                                <li className='Dot'>
                                    Choose any ERC20 standard <strong className="colorPURPLE"> coin</strong>.
                                </li>
                                <li className='Dot'>
                                    Select the <strong className="colorPURPLE"> number of players</strong> between 2 and 1000.
                                </li>
                                <li className='Dot'>
                                    Specify any <strong className="colorPURPLE"> deposit</strong>.
                                </li>
                                {/* </div> */}

                                <div className='obzach'>
                                    That's it - you've created a lobby. Now anyone can join your lobby.<br />
                                    As soon as the required number of players is reached, the collected coins will be drawn instantly.<br />
                                    Once a lobby has been created, it <strong className="colorPURPLE">cannot be deleted</strong>.
                                </div>
                                <div className='obzach'>
                                    The only limitation is that you can't have more than 10 active lobbies per wallet.<br />
                                    That's all.  <strong className="colorPURPLE">No commissions</strong>, just random.
                                </div>
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2 >
                                3. Gallery
                            </h2>
                            <div className='obzach'>
                                In the gallery you can see the entire nft collection<br />
                                and find out which nft has already been minted <div className='Agreendot' /> and which has not yet <div className='Areddot' ></div>.
                            </div>
                            <div className='obzach'>
                                The gallery is a <strong className="colorPURPLE">marketplace</strong>. The owner of NFT can put it up for sale,<br /> and anyone can buy* it for the price indicated by the seller.
                            </div>
                            <div className='obzach'>
                                Also, the owner can leave a <strong className="colorPURPLE">message</strong> under the picture, which will be visible to all users.
                            </div>
                            <div className='PS'>
                                *For the purchase, the necessary funds must be in<strong className="colorPURPLE"> your personal wallet</strong>, and not on the internal one.
                            </div>
                        </div>




                        <div className='colorWHITE'>
                            <h2>
                                4. MuDeBz NFT
                            </h2>
                            <div className='obzach'>
                                Mint price - 0.08 ETH.
                            </div>
                            <div className='obzach'>
                                So, what is included with NFT?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                <strong className="colorPURPLE">Day</strong>. Well, yes, it's your day, congratulations, clap clap.
                            </li>
                            <li className='Dot'>
                                Privileges in <strong className="colorPURPLE">discord channel</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Merch</strong>.
                            </li>
                            <li className='Dot'>
                                MuDeBz token <strong className="colorPURPLE">airdrop</strong>.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                The collection includes about <strong className="colorPURPLE">5% of unique NFTs</strong> that are timed to coincide with holidays and important events in history.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                5. MUD Token
                            </h2>
                            <div className='obzach'>
                                So, MuDeBz token airdrop. It will happen <strong className="colorPURPLE">on 1050 lottery</strong>.
                            </div>
                            <div className='obzach'>
                                Who will receive the tokens?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                <strong className="colorPURPLE">Holders NFT</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Wallets that have ever owned any NFT</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Members of the referral program</strong>.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                Emission of token: <strong className="colorPURPLE">1 000 000 000</strong> each blockchain.
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                NFT holders will share <strong className="colorPURPLE">8%</strong>.
                            </li>
                            <li className='Dot'>
                                Wallets ever owning NFTs will share <strong className="colorPURPLE">17%</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">21%</strong> allocated for the referral program.                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                Further, <strong className="colorPURPLE">from 1051 to 2050 lottery</strong>, the remaining tokens will be drawn.
                            </div>
                            <div className='obzach'>
                                Every day 300 000 MUD will be drawn in the <strong className="colorPURPLE">lobby</strong>.<br />
                                Also, all <strong className="colorPURPLE">lottery </strong>players will share 100 000 tokens per day.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                6. Referral
                            </h2>
                            <div className='obzach'>
                                Refer a friend and you both get <strong className="colorPURPLE">1000 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                Create your promo code and share it.<br />
                                When someone enters your promo code before their <strong className="colorPURPLE">first participation in the draw</strong>,<br /> you will both receive 1000 MUD.
                            </div>

                            <div className='obzach'>
                                If you have ever participated in the NFT draw,<br />
                                then you no longer have the opportunity to use someone else's promotional code.
                            </div>

                            <div className='obzach'>
                                You can create your promo code once in <strong className="colorPURPLE">anytime</strong>.                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                7. Important
                            </h2>
                            <div className='obzach'>
                                1. At 1051 lottery, the lottery coin will be changed to <strong className="colorPURPLE">MUD</strong>.
                            </div>
                            <div className='obzach'>
                                2. In order <strong className="colorPURPLE">to receive tokens in the lobby</strong>, you need to:
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "240px" }}> */}
                            <li className='Dot'>
                                Play with a <strong className="colorPURPLE">MUD token</strong>.
                            </li>
                            <li className='Dot'>
                                Deposit must be at least <strong className="colorPURPLE">50 MUD</strong>.
                            </li>
                            <li className='Точка'>
                                Lottery number should be above 1050.
                            </li>

                            {/* </div> */}

                            <div className='obzach'>
                                After the lobby draw, <strong className="colorPURPLE">all</strong> participants will receive <strong className="colorPURPLE">10 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                3. The maximum number of people who can share 17% is  <strong className="colorPURPLE">100 000</strong>.<br />
                                That is, only unique wallets from the first each NFT 100  transfers.
                            </div>
                            <div className='obzach' style={{ paddingBottom: "10px" }}>
                                4. MuDeBz runs on two <strong className="colorPURPLE">Ethereum mainnet</strong> and <strong className="colorPURPLE">Binance smartchain</strong> blockchain.
                            </div>
                        </div>
                    </div>}
                    {language == "Русский" && <div>
                        <div className='colorWHITE'>
                            <h2>
                                1. Lottery
                            </h2>
                            <div className='obzach'>
                                Каждый день есть шанс купить NFT.
                            </div>
                            <div className='obzach'>
                                Для того, чтобы принять участие в розыгрыше, вам необходимо пополнить баланс внутреннего кошелька на
                                <strong className="colorPURPLE"> 5 USDT</strong> и, нажав на кнопку <strong className="colorPURPLE">
                                    Принимаю участие!</strong> вы станите участником розыгрыша.
                            </div>
                            <div className='obzach'>
                                <strong className="colorPURPLE">Победитель получает все</strong>,
                                абсолютно все.
                                Возможность* приобрести<strong className="colorPURPLE"> NFT</strong> и все собранные <strong className="colorPURPLE">монеты </strong>
                                в течение дня.

                            </div>
                            <div className='PS'>
                                *На приобретение NFT дается 50 дней,
                                если на пятидесятый день он не создан,
                                то победитель теряет возможность приобрести этот NFT.
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                2. Lobby
                            </h2>
                            <div className='obzach'>
                                Лобби — это <strong className="colorPURPLE">орел и решка</strong> с обширными возможностями настройки.
                            </div>
                            <div className='obzach'>
                                {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                                <li className='Точка'>
                                    Выберите любую <strong className="colorPURPLE"> монету</strong> стандарта ERC20.
                                </li>
                                <li className='Точка'>
                                    Выберите <strong className="colorPURPLE"> количество игроков</strong> от 2 до 1000.
                                </li>
                                <li className='Точка'>
                                    Укажите любой <strong className="colorPURPLE"> депозит</strong>.
                                </li>
                                {/* </div> */}

                                <div className='obzach'>
                                    Теперь любой желающий может присоединиться к вашему лобби.<br />
                                    Как только будет достигнуто необходимое количество игроков, собранные монеты будут разыграны мгновенно.<br />
                                </div>
                                <div className='obzach'>
                                    После создания лобби его <strong className="colorPURPLE">нельзя удалить</strong>.
                                </div>
                                <div className='obzach'>
                                    Единственным ограничением является то, что у вас не может быть более 10 созданных лобби
                                </div>
                                <div className='obzach'>
                                    Это все. <strong className="colorPURPLE">Никаких комиссий</strong>, только рандом.
                                </div>
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                3. Gallery
                            </h2>
                            <div className='obzach'>
                                В галерее вы можете увидеть всю коллекцию NFT и узнать, какой NFT уже создан <div className='Agreendot' ></div>, a какой нет <div className='Areddot' ></div>.
                            </div>
                            <div className='obzach'>
                                Галерея является <strong className="colorPURPLE">торговой площадкой</strong>. Владелец NFT может выставить его на продажу,<br /> и любой желающий может купить* NFT по цене, указанной продавцом.
                            </div>
                            <div className='obzach'>
                                Также владелец может оставить под картинкой <strong className="colorPURPLE">любое сообщение</strong>, которое будет видно всем пользователям.
                            </div>
                            <div className='PS'>
                                *Для покупки необходимые средства должны быть на <strong className="colorPURPLE"> вашем личном кошельке</strong>, а не на внутреннем.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                4. MuDeBz NFT
                            </h2>
                            <div className='obzach'>
                                Цена минта NFT - 0.08 ETH.
                            </div>
                            <div className='obzach'>
                                Итак, что входит в NFT?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                <strong className="colorPURPLE">День</strong>. Ну да, это твой день, поздравляю, хлоп-хлоп.
                            </li>
                            <li className='Точка'>
                                Привилегии в <strong className="colorPURPLE">Discord</strong> канале.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">Мерч</strong>.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">Airdrop</strong> токенов MuDeBz.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                Коллекция включает в себя около <strong className="colorPURPLE">5% уникальных NFT</strong>, приуроченных к праздникам и важным историческим событиям.
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                5. Token MUD
                            </h2>
                            <div className='obzach'>
                                Итак, airdrop токена MuВeBz. Это произойдет <strong className="colorPURPLE">на 1050-ой лотерее</strong>.
                            </div>
                            <div className='obzach'>
                                Кто получит токены?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                <strong className="colorPURPLE">Держатели NFT</strong>.
                            </li>
                            <li className='Точка'>
                                Кошельки, которые <strong className="colorPURPLE">когда-либо владели NFT</strong>.
                            </li>
                            <li className='Точка'>
                                Участники <strong className="colorPURPLE">реферальной программы</strong>.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                Эмиссия токена: <strong className="colorPURPLE">1 000 000 000</strong> на каждом блокчейне.
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                Владельцы NFT разделят <strong className="colorPURPLE">8%</strong>.
                            </li>
                            <li className='Точка'>
                                Кошельки, когда-либо владевшие NFT, разделят <strong className="colorPURPLE">17%</strong>.
                            </li>
                            <li className='Точка'>
                                На реферальную программу выделен <strong className="colorPURPLE">21%</strong>.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                Далее, <strong className="colorPURPLE">с 1051 по 2050 лотерею </strong> будут разыграны оставшиеся токены.
                            </div>
                            <div className='obzach'>
                                Каждый день в <strong className="colorPURPLE">лобби</strong> будут разыгрываться 300 000 MUD.<br />
                                Кроме того, все <strong className="colorPURPLE">участники лотереи </strong> будут делить между собой 100 000 MUD в день.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                6. Реферальная программа
                            </h2>
                            <div className='obzach'>
                                Пригласите друга, и вы оба получите по <strong className="colorPURPLE">1000 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                Создайте свой промокод и поделитесь им.<br />
                                Если кто-то введет ваш промокод <strong className="colorPURPLE">до своего первого участия в лотерее</strong>,<br /> вы оба получите по 1000 MUD.
                            </div>

                            <div className='obzach'>
                                Если вы когда-либо участвовали в розыгрыше NFT,<br />
                                то у вас больше нет возможности использовать чужой промокод.
                            </div>

                            <div className='obzach'>
                                Вы можете создать свой промокод единожды в <strong className="colorPURPLE">любое время</strong>.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                7. Важно
                            </h2>
                            <div className='obzach'>
                                1. С 1051-ой лотереи монета USDT будет заменена на <strong className="colorPURPLE">MUD</strong>.
                            </div>
                            <div className='obzach'>
                                2. Чтобы <strong className="colorPURPLE">получать MUD в лобби</strong>, вам необходимо:
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "240px" }}> */}
                            <li className='Точка'>
                                Играть на токен <strong className="colorPURPLE">MUD</strong>.
                            </li>
                            <li className='Точка'>
                                Депозит лобби должен быть не менее <strong className="colorPURPLE">50 MUD</strong>.
                            </li>
                            <li className='Точка'>
                                Номер лотереи должен превышать <strong className="colorPURPLE">1050</strong>.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                После розыгрыша <strong className="colorPURPLE">все</strong> участники лобби  получат <strong className="colorPURPLE">10 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                3. Максимальное количество людей, которые могут разделить 17%, составляет <strong className="colorPURPLE">100 000</strong>.<br />
                                То есть, только уникальные кошельки из первых 100 переводов NFT.
                            </div>
                            <div className='obzach' style={{ paddingBottom: "10px" }}>
                                4. MuDeBz работает на двух блокчейнах: <strong className="colorPURPLE">Ethereum mainnet</strong> и <strong className="colorPURPLE">Binance smart chain</strong>.
                            </div>
                        </div>

                    </div>}
                </div>

                <div className='language' >
                    <div className='Userguide' style={{ position: "absolute", left: "-60px", top: "-8px", borderRadius: "12px", padding: "6px 5px 0px 5px" }} onClick={() => { window.open("https://vk.com/s/v1/doc/NvY5hQPTY2BqXWztuDukj4kS4ySky4tSV0ZoqvkA_icUn8UC1Zc") }}>
                        <Image src={"/Guide.png"} width={45} height={45} style={{}} />
                    </div>
                    <select style={{ minWidth: "90px", height: "38px" }} onClick={e => setLanguage(e.target.value)}>
                        <option>English</option>
                        <option>Русский</option>
                    </select>
                </div>
            </div>



        </div >
    )
}