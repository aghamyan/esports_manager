const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const prisma = require('./config/prisma');
const playersRoutes = require('./routes/playersRoutes');
const tournamentsRoutes = require('./routes/tournamentsRoutes');
const matchesRoutes = require('./routes/matchesRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'fc26-manager-api' });
});

app.get('/api/health/db', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/players', playersRoutes);
app.use('/api/tournaments', tournamentsRoutes);
app.use('/api/matches', matchesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
