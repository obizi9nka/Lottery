const { ethers } = require("ethers");
import Lottery from "/blockchain/Lottery.json"

import { LotteryAddressETH, LotteryAddressLocalhost, LotteryAddressBNB } from '../../components/Constants';
import notForYourEyesBitch from "../../notForYourEyesBitch.json"
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

import prisma from './prisma.js';

export default async function handler(req, res) {

    const { creator, id, newPlayer, chainId } = JSON.parse(req.body)

    let result

    if (chainId == ETHid) {
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
            await prisma.lobbyETH.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })
            let lobyWithWinner
            try {
                let provider
                if (chainId != BNBid)
                    provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
                else
                    provider = new ethers.providers.JsonRpcProvider
                const contract = new ethers.Contract(chainId === ETHid ? LotteryAddressETH : LotteryAddressBNB, Lottery.abi, provider)
                lobyWithWinner = await contract.getLobby(creator, id)
            } catch (err) {
                lobyWithWinner = {
                    winer: "error",
                    players: ["error"]
                }
            }

            await prisma.lobbyHistoryETH.create({
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
                        newsETH: true
                    }
                })

                let news = ((AlredyNews.newsETH && AlredyNews.newsETH.length > 0) ? AlredyNews.newsETH : "") + newNews;
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
            await prisma.lobbyBNB.delete({
                where: {
                    creator_id: {
                        creator,
                        id
                    }
                }
            })
            let provider
            if (chainId != BNBid)
                provider = new ethers.providers.InfuraProvider("rinkeby", notForYourEyesBitch.infuraKey)
            else
                provider = new ethers.providers.JsonRpcProvider
            const contract = new ethers.Contract(chainId === ETHid ? LotteryAddressETH : chainId === BNBid ? LotteryAddressLocalhost : LotteryAddressBNB, Lottery.abi, provider)
            const lobyWithWinner = await contract.getLobby(creator, id)
            await prisma.lobbyHistoryBNB.create({
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
                        newsBNB: true
                    }
                })

                let news = ((AlredyNews.newsBNB && AlredyNews.newsBNB.length > 0) ? AlredyNews.newsBNB : "") + newNews;
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
