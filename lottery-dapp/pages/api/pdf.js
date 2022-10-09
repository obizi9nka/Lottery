import prisma from './prisma.js';
import { ETHid, BNBid, PRODACTION } from '../../components/Constants.js';

export default async function pdf(req, res) {

    const { user, chainId } = JSON.parse(req.body)

    let Header = [
        { text: "№", style: "tableHeader" },
        { text: "creator", style: "tableHeader" },
        { text: "token", style: "tableHeader" },
        { text: "players", style: "tableHeader" },
        { text: "winner", style: "tableHeader" },
        { text: "deposit", style: "tableHeader" },
        { text: "countOfPlayers", style: "tableHeader" },
    ]

    let body = []

    body.push(Header)
    let allLobbyes
    if (chainId == ETHid)
        allLobbyes = await prisma.lobbyHistoryETH.findMany()
    else
        allLobbyes = await prisma.lobbyHistoryBNB.findMany()
    let i = 0
    allLobbyes.map((element) => {
        if (element.players.indexOf(user) !== -1) {
            i++
            let cutPlayers = ''
            let players = element.players.split("_")
            players.pop()
            players = players.map((element) => {
                return (`${element.substr(37, 5)}`)
            })
            players.forEach((element, index) => {
                cutPlayers += element + ((index !== players.length - 1) ? ", " : " ")
            })
            const color = (element.winner === user) ? "#8fbe6b" : null
            const temp = [
                { text: `${i}`, fillColor: color },
                { text: element.creator, fillColor: color },
                { text: element.IERC20, fillColor: color },
                { text: cutPlayers, fillColor: color },
                { text: element.winner, fillColor: color },
                { text: element.deposit, fillColor: color },
                { text: `${element.countOfPlayers}`, fillColor: color },
            ]
            body.push(temp)
        }
    })
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 0]
        },
        subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 0]
        },
        tableExample: {
            fontSize: 7
        },
        tableHeader: {
            bold: true,
            fontSize: 10,
            fillColor: '#403e3f',
            color: 'white',
            alignment: 'center'
        }
    }
    const data = { body, styles }
    res.json(data)
}
