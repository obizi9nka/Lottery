import { PrismaClient } from '@prisma/client';
const { ethers } = require("ethers");
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"

import { LotteryAddressETH, LotteryAddressLocalhost, LotteryAddressBNB } from './Constants';
const notForYourEyesBitch = require("/C:/Lottery/lottery-dapp/notForYourEyesBitch")

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const { creator, id, newPlayer, chainId } = JSON.parse(req.body)

    let result

    if (chainId == 4) {
        const loby = await prisma.lobbyETH.findUnique({
            where: {
                creator_id: {
                    creator,
                    id
                }
            }
        })

        result = await prisma.lobbyETH.update({
            where: {
                creator_id: {
                    creator,
                    id
                }
            },
            data: {
                nowInLobby: loby.nowInLobby + 1,
                players: loby.players + newPlayer + "_"
            }
        });

        if (loby.countOfPlayers === loby.nowInLobby + 1) {
            await prisma.lobby.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })
            let provider
            if (chainId != 31337)
                provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            else
                provider = new ethers.providers.JsonRpcProvider
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const lobyWithWinner = await contract.getLobby(creator, id)
            await prisma.lobbyHistory.create({
                data: {
                    id,
                    creator,
                    countOfPlayers: loby.countOfPlayers,
                    IERC20: loby.IERC20,
                    winner: lobyWithWinner.winer,
                    deposit: loby.deposit,
                    players: loby.players + lobyWithWinner.players[loby.countOfPlayers - 1] + "_"
                }
            })
            const players = lobyWithWinner.players
            const newNews = creator + "_" + id + "_" + loby.IERC20 + "_" + `${loby.deposit}` + "_" + `${loby.countOfPlayers}`;
            for (let i = 0; i < players.length; i++) {
                let AlredyNews = await prisma.user.findUnique({
                    where: {
                        address: players[i]
                    },
                    select: {
                        news: true
                    }
                })

                let news = ((AlredyNews.news && AlredyNews.news.length > 0) ? AlredyNews.news : "") + newNews;
                if (lobyWithWinner.winer == players[i]) { news += "_1&" }
                else { news += "_0&" };

                await prisma.user.update({
                    where:
                    {
                        address: players[i]
                    },
                    data: {
                        newsETH: news
                    }
                })
            };
        }
    } else {
        const loby = await prisma.lobbyBNB.findUnique({
            where: {
                creator_id: {
                    creator,
                    id
                }
            }
        })

        result = await prisma.lobbyBNB.update({
            where: {
                creator_id: {
                    creator,
                    id
                }
            },
            data: {
                nowInLobby: loby.nowInLobby + 1,
                players: loby.players + newPlayer + "_"
            }
        });

        if (loby.countOfPlayers === loby.nowInLobby + 1) {
            await prisma.lobby.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })
            let provider
            if (chainId != 31337)
                provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            else
                provider = new ethers.providers.JsonRpcProvider
            const contract = new ethers.Contract(chainId === 4 ? LotteryAddressETH : chainId === 31337 ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const lobyWithWinner = await contract.getLobby(creator, id)
            await prisma.lobbyHistory.create({
                data: {
                    id,
                    creator,
                    countOfPlayers: loby.countOfPlayers,
                    IERC20: loby.IERC20,
                    winner: lobyWithWinner.winer,
                    deposit: loby.deposit,
                    players: loby.players + lobyWithWinner.players[loby.countOfPlayers - 1] + "_"
                }
            })
            const players = lobyWithWinner.players
            const newNews = creator + "_" + id + "_" + loby.IERC20 + "_" + `${loby.deposit}` + "_" + `${loby.countOfPlayers}`;
            for (let i = 0; i < players.length; i++) {
                let AlredyNews = await prisma.user.findUnique({
                    where: {
                        address: players[i]
                    },
                    select: {
                        news: true
                    }
                })

                let news = ((AlredyNews.news && AlredyNews.news.length > 0) ? AlredyNews.news : "") + newNews;
                if (lobyWithWinner.winer == players[i]) { news += "_1&" }
                else { news += "_0&" };

                await prisma.user.update({
                    where:
                    {
                        address: players[i]
                    },
                    data: {
                        newsBNB: news
                    }
                })
            };
        }
    }



    res.json(result)
}
