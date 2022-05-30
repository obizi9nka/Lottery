import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function pdf(req, res) {

    let Header = ["id", "creator", "token", "players", "winner", "deposit", "countOfPlayers"]

    let body = []

    body.push(Header)
    const allLobbyes = await prisma.lobbyHistory.findMany()
    allLobbyes.map((element) => {
        if (element.players.indexOf(req.body) !== -1) {
            let cutPlayers = ''
            let players = element.players.split("_")
            players.pop()
            players = players.map((element) => {
                return (`...${element.substr(37, 5)}`)
            })
            players.forEach((element) => {
                cutPlayers += element + "|"
            })
            const temp = [`${element.id}`, element.creator, element.IERC20, cutPlayers, element.winner, element.deposit, `${element.countOfPlayers}`]
            body.push(temp)
            body.push(temp)
            body.push(temp)
            body.push(temp)
            body.push(temp)
        }
    })

    const pdf = {
        pageOrientation: "landscape",
        content: [
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body,
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#2196F3' : '#2196F3';
                    }
                }

            }
        ],
        styles: {
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
                margin: [0, 0, 0, 0],
                fontSize: 7
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black'
            }
        },
    }

    res.json(body)
}
