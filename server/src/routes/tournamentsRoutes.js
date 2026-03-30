const express = require('express');
const { getTournaments, createTournament } = require('../controllers/tournamentsController');

const router = express.Router();

router.get('/', getTournaments);
router.post('/', createTournament);

module.exports = router;
