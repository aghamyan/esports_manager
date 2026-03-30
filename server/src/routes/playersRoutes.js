const express = require('express');
const { getPlayers, createPlayer } = require('../controllers/playersController');

const router = express.Router();

router.get('/', getPlayers);
router.post('/', createPlayer);

module.exports = router;
