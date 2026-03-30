const prisma = require('../config/prisma');

const CUID_REGEX = /^c[a-z0-9]{24}$/;

function isValidPlayerId(id) {
  return typeof id === 'string' && CUID_REGEX.test(id);
}

function normalizePlayerPayload(body) {
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const nickname = typeof body.nickname === 'string' ? body.nickname.trim() : '';

  let psnId;
  if (body.psnId === undefined || body.psnId === null) {
    psnId = null;
  } else if (typeof body.psnId === 'string') {
    const trimmedPsnId = body.psnId.trim();
    psnId = trimmedPsnId ? trimmedPsnId : null;
  } else {
    psnId = body.psnId;
  }

  return { fullName, nickname, psnId };
}

function validatePlayerPayload(payload) {
  if (!payload.fullName) {
    return 'fullName is required';
  }

  if (!payload.nickname) {
    return 'nickname is required';
  }

  if (payload.psnId !== null && typeof payload.psnId !== 'string') {
    return 'psnId must be a string when provided';
  }

  return null;
}

function handlePlayerError(error, next) {
  if (error?.code === 'P2002') {
    error.statusCode = 409;
    error.message = 'nickname already exists';
  }

  next(error);
}

async function getPlayers(req, res, next) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: players });
  } catch (error) {
    next(error);
  }
}

async function getPlayerById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidPlayerId(id)) {
      return res.status(400).json({ message: 'invalid player id' });
    }

    const player = await prisma.player.findUnique({ where: { id } });

    if (!player) {
      return res.status(404).json({ message: 'player not found' });
    }

    res.json({ data: player });
  } catch (error) {
    next(error);
  }
}

async function createPlayer(req, res, next) {
  try {
    const payload = normalizePlayerPayload(req.body ?? {});
    const validationError = validatePlayerPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newPlayer = await prisma.player.create({
      data: payload,
    });

    res.status(201).json({ message: 'player created', data: newPlayer });
  } catch (error) {
    handlePlayerError(error, next);
  }
}

async function updatePlayer(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidPlayerId(id)) {
      return res.status(400).json({ message: 'invalid player id' });
    }

    const payload = normalizePlayerPayload(req.body ?? {});
    const validationError = validatePlayerPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingPlayer = await prisma.player.findUnique({ where: { id } });

    if (!existingPlayer) {
      return res.status(404).json({ message: 'player not found' });
    }

    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: payload,
    });

    res.json({ message: 'player updated', data: updatedPlayer });
  } catch (error) {
    handlePlayerError(error, next);
  }
}

async function deletePlayer(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidPlayerId(id)) {
      return res.status(400).json({ message: 'invalid player id' });
    }

    const existingPlayer = await prisma.player.findUnique({ where: { id } });

    if (!existingPlayer) {
      return res.status(404).json({ message: 'player not found' });
    }

    await prisma.player.delete({ where: { id } });

    res.json({ message: 'player deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
