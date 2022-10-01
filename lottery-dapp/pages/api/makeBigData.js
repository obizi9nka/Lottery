import prisma from './prisma.js';



export default async function handler(req, res) {
    for (let i = 99; i < 899; i++) {
        let { user, token, countOfPlayers, deposit } = JSON.parse(req.body)

        countOfPlayers = parseInt(countOfPlayers, 10)

        let id = await prisma.user.findUnique({
            where: {
                address: user
            }
        })

        id = 1 + id.countOfLobbys

        const result = await prisma.lobby.create({
            data: {
                id: i,
                creator: user,
                IERC20: token,
                countOfPlayers,
                players: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266_0x70997970C51812dc3A010C7d01b50e0d17dc79C8_0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC_",
                deposit: `0`,
                nowInLobby: 0
            }
        })

        await prisma.user.update({
            where: {
                address: user
            },
            data: {
                countOfLobbys: id
            }
        })
    }



}
