import { PrismaClient } from '@prisma/client';
const { ethers } = require("ethers");
import Lottery from "C:/Lottery/lottery/artifacts/contracts/Lottery.sol/Lottery.json"

const LotteryAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

const prisma = new PrismaClient();

export default async function handler(req, res) {

    const { creator, id, newPlayer } = JSON.parse(req.body)

    const loby = await prisma.lobby.findUnique({
        where: {
            creator_id: {
                creator,
                id
            }
        }
    })

    const result = await prisma.lobby.update({
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
        const provider = new ethers.providers.JsonRpcProvider
        const contract = new ethers.Contract(LotteryAddress, Lottery.abi, provider)
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
                    news
                }
            })
        };


    }

    res.json(result)
}
