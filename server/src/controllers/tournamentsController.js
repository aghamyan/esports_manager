const prisma = require('../config/prisma');

async function getTournaments(req, res, next) {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        tournamentPlayers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tournaments);
  } catch (error) {
    next(error);
  }
}

async function createTournament(req, res, next) {
  try {
    const { name, format, startsAt } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const newTournament = await prisma.tournament.create({
      data: {
        name,
        format,
        startsAt: startsAt ? new Date(startsAt) : null,
      },
    });

    res.status(201).json(newTournament);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTournaments,
  createTournament,
};
