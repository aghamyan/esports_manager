const prisma = require('../config/prisma');

async function getPlayers(req, res, next) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(players);
  } catch (error) {
    next(error);
  }
}

async function createPlayer(req, res, next) {
  try {
    const { psnId, displayName, favoriteTeam } = req.body;

    if (!psnId || !displayName) {
      return res.status(400).json({ message: 'psnId and displayName are required' });
    }

    const newPlayer = await prisma.player.create({
      data: {
        psnId,
        displayName,
        favoriteTeam,
      },
    });

    res.status(201).json(newPlayer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlayers,
  createPlayer,
};
