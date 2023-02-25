import prisma from './prisma.js';

export default async function getUserLobbys(req, res) {
  const lobbyess = await prisma.user.findUnique({
    where: {
      address: req.body,
    },
    select: {
      userLobbyesHistory: true,
      userLobbyes: true,
    },
  });
  res.json(lobbyess);
}
