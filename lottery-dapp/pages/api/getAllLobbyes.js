import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps() {
    ;
    return {
        props: {
            allLobbyes: lobbyess
        }
    }
}

export default async function handler(req, res) {

    const lobbyess = await prisma.lobby.findMany()

    res.json(lobbyess)
}
