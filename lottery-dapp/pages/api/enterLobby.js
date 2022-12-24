const { ethers } = require("ethers");
import Lottery from "/blockchain/Lottery.json"

import { LotteryAddressETH, LotteryAddressLocalhost, LotteryAddressBNB } from '../../components/Constants';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

import prisma from './prisma.js';

export default async function handler(req, res) {

    const { creator, id, newPlayer, chainId, winer, players, nowInLobby, IERC20, countOfPlayers, deposit } = JSON.parse(req.body)
    const decimals = await prisma.tokens.findUnique({
        where: {
            address: IERC20
        },
        select: {
            decimals: true
        }
    })

    let Deposit = (deposit / (10 ** decimals.decimals)).toString()


    let result

    if (chainId == ETHid) {
        result = await prisma.lobbyETH.update({
            where: {
                creator_id: {
                    creator,
                    id
                }
            },
            data: {
                nowInLobby
            }
        });

        if (players != null) {
            await prisma.lobbyETH.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })

            await prisma.lobbyHistoryETH.create({
                data: {
                    id,
                    creator,
                }
            })
            const newNews = creator + "_" + id + "_" + IERC20 + "_" + Deposit + "_" + `${countOfPlayers}`;
            for (let i = 0; i < players.length; i++) {
                let AlredyNews = await prisma.user.findUnique({
                    where: {
                        address: players[i]
                    },
                    select: {
                        newsETH: true,
                        LobbiesETH: true
                    }
                })
                const index = AlredyNews.LobbiesETH?.indexOf(`${creator}&${id}_`)
                if (index != -1) {
                    AlredyNews.LobbiesETH = AlredyNews.LobbiesETH.substring(0, index) + AlredyNews.LobbiesETH.substring(index + `${creator}&${id}_`.length, AlredyNews.LobbiesETH.length)
                }

                let news = ((AlredyNews.newsETH && AlredyNews.newsETH.length > 0) ? AlredyNews.newsETH : "") + newNews;
                if (winer == players[i]) { news += "_1&" }
                else { news += "_0&" };

                await prisma.user.update({
                    where:
                    {
                        address: players[i]
                    },
                    data: {
                        newsETH: news,
                        LobbiesETH: AlredyNews.LobbiesETH
                    }
                })
            };
        }
        else {
            let lobbbies = await prisma.user.findUnique({
                where: {
                    address: newPlayer
                },
                select: {
                    LobbiesETH: true
                }
            })
            lobbbies = lobbbies.LobbiesETH != null ? (lobbbies.LobbiesETH + `${creator}&${id}_`) : `${creator}&${id}_`

            await prisma.user.update({
                where: {
                    address: newPlayer
                },
                data: {
                    LobbiesETH: lobbbies
                }
            })
        }
    } else {
        result = await prisma.lobbyBNB.update({
            where: {
                creator_id: {
                    creator,
                    id
                }
            },
            data: {
                nowInLobby
            }
        });

        if (players != null) {
            await prisma.lobbyBNB.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })
            await prisma.lobbyHistoryBNB.create({
                data: {
                    id,
                    creator,
                }
            })
            const newNews = creator + "_" + id + "_" + IERC20 + "_" + Deposit + "_" + `${countOfPlayers}`;
            for (let i = 0; i < players.length; i++) {
                let AlredyNews = await prisma.user.findUnique({
                    where: {
                        address: players[i]
                    },
                    select: {
                        newsBNB: true,
                        LobbiesBNB: true
                    }
                })
                const index = AlredyNews.LobbiesBNB?.indexOf(`${creator}&${id}_`)
                if (index != -1) {
                    AlredyNews.LobbiesBNB = AlredyNews.LobbiesBNB.substring(0, index) + AlredyNews.LobbiesBNB.substring(index + `${creator}&${id}_`.length, AlredyNews.LobbiesBNB.length)
                }

                let news = ((AlredyNews.newsBNB && AlredyNews.newsBNB.length > 0) ? AlredyNews.newsBNB : "") + newNews;
                if (winer == players[i]) { news += "_1&" }
                else { news += "_0&" };

                await prisma.user.update({
                    where:
                    {
                        address: players[i]
                    },
                    data: {
                        newsBNB: news,
                        LobbiesBNB: AlredyNews.LobbiesBNB
                    }
                })
            };
        }
        else {
            let lobbbies = await prisma.user.findUnique({
                where: {
                    address: newPlayer
                },
                select: {
                    LobbiesBNB: true,
                }
            })
            lobbbies = lobbbies.LobbiesBNB != null ? (lobbbies.LobbiesBNB + `${creator}&${id}_`) : `${creator}&${id}_`

            await prisma.user.update({
                where: {
                    address: newPlayer
                },
                data: {
                    LobbiesBNB: lobbbies
                }
            })
        }
    }



    res.json(result)
}
