const prisma = require('../config/prisma');

async function getMatches(req, res, next) {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homePlayer: true,
        awayPlayer: true,
        tournament: true,
      },
      orderBy: { playedAt: 'desc' },
    });

    res.json(matches);
  } catch (error) {
    next(error);
  }
}

async function createMatch(req, res, next) {
  try {
    const {
      homePlayerId,
      awayPlayerId,
      tournamentId,
      homeScore,
      awayScore,
      playedAt,
      platform,
    } = req.body;

    if (!homePlayerId || !awayPlayerId) {
      return res.status(400).json({ message: 'homePlayerId and awayPlayerId are required' });
    }

    const newMatch = await prisma.match.create({
      data: {
        homePlayerId,
        awayPlayerId,
        tournamentId,
        homeScore: homeScore ?? null,
        awayScore: awayScore ?? null,
        playedAt: playedAt ? new Date(playedAt) : new Date(),
        platform: platform || 'PS5',
      },
    });

    res.status(201).json(newMatch);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMatches,
  createMatch,
};
