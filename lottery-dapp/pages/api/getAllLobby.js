import prisma from './prisma.js';
import { LotteryAddressBNB, LotteryAddressETH, ETHid, BNBid, PRODACTION } from '../../components/Constants.js';
import Lottery from "../../blockchain/Lottery.json"


export default async function handler(req, res) {

    const { user, isConnected } = JSON.parse(req.body)

    let lobbysETH = await prisma.lobbyETH.findMany()
    let lobbysBNB = await prisma.lobbyBNB.findMany()

    let UserData = {
        LobbiesETH: null,
        LobbiesBNB: null
    }
    if (isConnected) {
        UserData = await prisma.user.findUnique({
            where: {
                address: user
            },
            select: {
                LobbiesETH: true,
                LobbiesBNB: true
            }
        })
    }


    let lobbysETHActive = []
    let lobbysBNBActive = []

    let i = 0

    if (lobbysETH != []) {
        let _lobbysETHActive = UserData.LobbiesETH == null ? [] : UserData.LobbiesETH.split("_")
        let lobbyData = []
        if (_lobbysETHActive.length > 0) {
            _lobbysETHActive.pop()
            lobbyData = _lobbysETHActive.map((element) => {
                const _lobbyData = element.split("&")
                const obj = {
                    creator: _lobbyData[0],
                    id: _lobbyData[1]
                }
                return obj
            })
        }
        lobbysETH.forEach(async (element, index) => {
            const isEntered = element.creator == lobbyData[i]?.creator && element.id == lobbyData[i]?.id
            lobbysETH[index] = {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                IERC20: element.IERC20,
                countOfPlayers: element.countOfPlayers,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2)),
                isEntered
            }
            if (isEntered) {
                lobbysETHActive.push(lobbysETH[index])
                i++
            }
        });
    }
    if (lobbysBNB != []) {
        let _lobbysBNBActive = UserData.LobbiesBNB == null ? [] : UserData.LobbiesBNB.split("_")
        let lobbyData = []
        if (_lobbysBNBActive.length > 0) {
            _lobbysBNBActive.pop()
            lobbyData = _lobbysBNBActive.map((element) => {
                const _lobbyData = element.split("&")
                const obj = {
                    creator: _lobbyData[0],
                    id: _lobbyData[1]
                }
                return obj
            })
        }
        lobbysBNB.forEach(async (element, index) => {
            const isEntered = element.creator == lobbyData[i]?.creator && element.id == lobbyData[i]?.id
            lobbysBNB[index] = {
                deposit: element.deposit,
                nowInLobby: element.nowInLobby,
                IERC20: element.IERC20,
                countOfPlayers: element.countOfPlayers,
                creator: element.creator,
                id: element.id,
                percent: parseInt(`${element.nowInLobby / element.countOfPlayers * 100}`.substring(0, 2)),
                isEntered
            }
            if (isEntered) {
                lobbysBNBActive.push(lobbysBNB[index])
                i++
            }
        });
    }

    let result = {
        lobbysETH,
        lobbysBNB,
        lobbysETHActive,
        lobbysBNBActive
    }

    console.log(result)

    res.json(result)
}
