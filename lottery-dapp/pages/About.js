import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home({ tymblerNaNetwork }) {

    const [language, setLanguage] = useState("English")

    return (
        <div>
            <Head>
                <title>!Mudebz</title>
                <meta name="description" content="An Ethereum Lottery dApp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
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
                                2. Lobby
                            </h2>
                            <div className='obzach'>
                                Lobby is a game of <strong className="colorPURPLE"> heads and tails</strong>  with extensive customization.
                            </div>
                            <div className='obzach'>
                                {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                                <li className='Dot'>
                                    Choose any erc20 standard <strong className="colorPURPLE"> coin</strong>.
                                </li>
                                <li className='Dot'>
                                    Select the <strong className="colorPURPLE"> number of players</strong> between 2 and 1000.
                                </li>
                                <li className='Dot'>
                                    And specify any <strong className="colorPURPLE"> deposit</strong>.
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
                                3. Galary
                            </h2>
                            <div className='obzach'>
                                In the gallery you can see the entire nft collection<br />
                                and find out which nft has already been minted<div className='Agreendot' ></div>
                                and which has not yet <div className='Areddot' ></div>
                            </div>
                            <div className='obzach'>
                                The gallery is a <strong className="colorPURPLE">marketplace</strong>. The owner of NFT can put it up for sale,<br /> and anyone can buy* it for the price indicated by the seller.
                            </div>
                            <div className='obzach'>
                                Also, the owner can leave a <strong className="colorPURPLE">message</strong> under the picture, which will be visible to all users.
                            </div>
                            <div className='PS'>
                                * For the purchase, the necessary funds must be in<strong className="colorPURPLE"> your personal wallet</strong>, and not on the internal one.
                            </div>
                        </div>




                        <div className='colorWHITE'>
                            <h2>
                                4. Mubebz NFT
                            </h2>
                            <div className='obzach'>
                                So, what is included with NFT?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                <strong className="colorPURPLE">Day</strong>. Well, yes, it's your day, congratulations, clap clap.
                            </li>
                            <li className='Dot'>
                                The ability to join a <strong className="colorPURPLE">discord channel</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Merch</strong>.
                            </li>
                            <li className='Dot'>
                                Mudebz token <strong className="colorPURPLE">airdrop</strong>.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                The collection includes about <strong className="colorPURPLE">5% of unique NFTs</strong> that are timed to coincide with holidays and important events in history. You can see their in the gallery.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                5. MUD token
                            </h2>
                            <div className='obzach'>
                                So, mudebz token airdrop. It will happen <strong className="colorPURPLE">on 1050 lottery</strong>.
                            </div>
                            <div className='obzach'>
                                Who will receive the tokens?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                <strong className="colorPURPLE">Holders nft</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Wallets that have ever owned any NFT</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">Members of the referral program</strong>.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                Emission of tokens: <strong className="colorPURPLE">1,000,000,000</strong> each blockchain.
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Dot'>
                                NFT holders will share <strong className="colorPURPLE">8%</strong>.
                            </li>
                            <li className='Dot'>
                                Wallets ever owning NFTs will share <strong className="colorPURPLE">19%</strong>.
                            </li>
                            <li className='Dot'>
                                <strong className="colorPURPLE">21%</strong> of tokens allocated for the referral program.
                            </li>
                            {/* </div> */}

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
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                7. Important
                            </h2>
                            <div className='obzach'>
                                1. In order <strong className="colorPURPLE">to receive tokens in the lobby</strong>, you need to:
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "240px" }}> */}
                            <li className='Dot'>
                                Play with a <strong className="colorPURPLE">MUD token</strong>.
                            </li>
                            <li className='Dot'>
                                Deposit must be at least <strong className="colorPURPLE">10 </strong>.
                            </li>
                            <li className='Точка'>
                                Lottery number should be above 1050.
                            </li>

                            {/* </div> */}

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
                                <strong className="colorPURPLE"> 5 USDT</strong> и с помощью этих средств, нажав на кнопку <strong className="colorPURPLE">
                                    Принимаю участие!</strong> вы становитесь участником розыгрыша.
                            </div>
                            <div className='obzach'>
                                <strong className="colorPURPLE">Победитель получает все</strong>,
                                абсолютно все.
                                <br /> Все собранные <strong className="colorPURPLE">монеты </strong>
                                в течение дня и возможность* приобрести
                                <strong className="colorPURPLE"> NFT</strong>.
                            </div>
                            <div className='PS'>
                                *50 дней дается на приобретение NFT,
                                если на пятидесятый день NFT не отчеканен,
                                то победитель теряет возможность приобрести этот NFT.
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                2. Lobby
                            </h2>
                            <div className='obzach'>
                                Лобби — это игра в <strong className="colorPURPLE">орел и решка</strong> с обширными возможностями настройки.
                            </div>
                            <div className='obzach'>
                                {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                                <li className='Точка'>
                                    Выберите любую <strong className="colorPURPLE"> монету</strong> стандарта erc20.
                                </li>
                                <li className='Точка'>
                                    Выберите <strong className="colorPURPLE"> количество игроков</strong> от 2 до 1000.
                                </li>
                                <li className='Точка'>
                                    И укажите любой <strong className="colorPURPLE"> депозит</strong>.
                                </li>
                                {/* </div> */}

                                <div className='obzach'>
                                    Вот и все, вы создали лобби. Теперь любой может присоединиться к вашему лобби.<br />
                                    Как только будет достигнуто необходимое количество игроков, собранные монеты будут разыграны мгновенно.<br />
                                    После создания лобби его <strong className="colorPURPLE">нельзя удалить</strong>.
                                </div>
                                <div className='obzach'>
                                    Единственным ограничением является то, что у вас не может быть более 10 активных лобби на один кошелек.<br />
                                    Это все. <strong className="colorPURPLE">Никаких комиссий</strong>, только рандом.
                                </div>
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                3. Gallery
                            </h2>
                            <div className='obzach'>
                                В галерее вы можете увидеть всю коллекцию nft и узнать, какой nft уже создан <div className='Agreendot' ></div> и еще нет <div className='Areddot' ></div>
                            </div>
                            <div className='obzach'>
                                Галерея представляет собой <strong className="colorPURPLE">торговую площадку</strong>. Владелец NFT может выставить его на продажу,<br /> и любой желающий может купить* его по цене, указанной продавцом.
                            </div>
                            <div className='obzach'>
                                Также владелец может оставить под картинкой <strong className="colorPURPLE">сообщение</strong>, которое будет видно всем пользователям.
                            </div>
                            <div className='PS'>
                                * Для покупки необходимые средства должны быть на <strong className="colorPURPLE"> вашем личном кошельке</strong>, а не на внутреннем.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                4. MuDeBz NFT
                            </h2>
                            <div className='obzach'>
                                Итак, что входит в NFT?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                <strong className="colorPURPLE">День</strong>. Ну да, это твой день, поздравляю, хлоп-хлоп.
                            </li>
                            <li className='Точка'>
                                Привилегии в канале <strong className="colorPURPLE">Discord</strong>.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">Мерч</strong>.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">Аирдроп</strong> токенов Mudebz.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                Коллекция включает около <strong className="colorPURPLE">5% уникальных NFT</strong>, приуроченных к праздникам и важным историческим событиям. Вы можете посмотреть их в галерее.
                            </div>
                        </div>
                        <div className='colorWHITE'>
                            <h2>
                                5. Token MUD
                            </h2>
                            <div className='obzach'>
                                Итак, аирдроп токена Mudebz. Это произойдет <strong className="colorPURPLE">в лотерее 1050</strong>.
                            </div>
                            <div className='obzach'>
                                Кто получит токены?
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                <strong className="colorPURPLE">Держатели nft</strong>.
                            </li>
                            <li className='Точка'>
                                Кошельки, которые <strong className="colorPURPLE">когда-либо владели каким-либо NFT</strong>.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">Участники реферальной программы</strong>.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                Эмиссия токенов: <strong className="colorPURPLE">1 000 000 000</strong> на каждый блокчейн.
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "200px" }}> */}
                            <li className='Точка'>
                                Владельцы NFT получат <strong className="colorPURPLE">8%</strong>.
                            </li>
                            <li className='Точка'>
                                Кошельки, когда-либо владевшие NFT, разделят <strong className="colorPURPLE">19%</strong>.
                            </li>
                            <li className='Точка'>
                                <strong className="colorPURPLE">21%</strong> токенов, выделенных для реферальной программы.
                            </li>
                            {/* </div> */}

                            <div className='obzach'>
                                Далее, <strong className="colorPURPLE">от 1051 до 2050 лотереи</strong> будут разыграны оставшиеся токены.
                            </div>
                            <div className='obzach'>
                                Каждый день в <strong className="colorPURPLE">лобби</strong> будет разыгрываться 300 000 MUD.<br />
                                Кроме того, все <strong className="colorPURPLE">участники лотереи </strong> будут делить 90 000 MUD в день.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                6. Реферальная программа
                            </h2>
                            <div className='obzach'>
                                Пригласите друга, и вы оба получите <strong className="colorPURPLE">100 MUD</strong>.
                            </div>

                            <div className='obzach'>
                                Создайте свой промокод и поделитесь им.<br />
                                Если кто-то введет ваш промокод <strong className="colorPURPLE">до первого участия в розыгрыше</strong>,<br /> вы оба получите по 100 MUD.
                            </div>

                            <div className='obzach'>
                                Если вы когда-либо участвовали в розыгрыше NFT,<br />
                                то у вас больше нет возможности использовать чужой промокод.
                            </div>

                            <div className='obzach'>
                                Вы можете создать свой промокод в <strong className="colorPURPLE">в любое время</strong>.
                            </div>
                        </div>

                        <div className='colorWHITE'>
                            <h2>
                                7. Важно
                            </h2>
                            <div className='obzach'>
                                1. Чтобы <strong className="colorPURPLE">получать MUD в лобби</strong>, вам необходимо:
                            </div>
                            {/* <div className='grid' style={{ paddingLeft: "240px" }}> */}
                            <li className='Точка'>
                                Играйте с токеном <strong className="colorPURPLE">MUD</strong>.
                            </li>
                            <li className='Точка'>
                                Депозит должен быть не менее <strong className="colorPURPLE">10 </strong>.
                            </li>
                            <li className='Точка'>
                                Номер лотереи должен привышать 1050.
                            </li>

                            {/* </div> */}
                            <div className='obzach'>
                                После жеребьевки в лобби <strong className="colorPURPLE">все</strong> участники получат <strong className="colorPURPLE">10 MUD</strong>.
                            </div>
                            <div className='obzach'>
                                2. В лотерее 1051 лотерейная монета будет заменена на <strong className="colorPURPLE">MUD</strong>.
                            </div>
                            <div className='obzach'>
                                3. Максимальное количество людей, которые могут разделить 19%, составляет <strong className="colorPURPLE">100 000</strong>.<br />
                                То есть только уникальные кошельки из первых 100 переводов NFT.
                            </div>

                        </div>

                    </div>}
                </div>

                <div className='language' >
                    <select style={{ minWidth: "90px", height: "38px" }} onClick={e => setLanguage(e.target.value)}>
                        <option>English</option>
                        <option>Русский</option>
                    </select>
                </div>
            </div>



        </div >
    )
}