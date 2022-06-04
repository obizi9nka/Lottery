import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function pdf(req, res) {

    const user = req.body

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
    const allLobbyes = await prisma.lobbyHistory.findMany()
    allLobbyes.map((element, index) => {
        if (element.players.indexOf(user) !== -1) {
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
                { text: `${index + 1}`, fillColor: color },
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
