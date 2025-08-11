const express = require('express');
const router = express.Router();
const { fetchPlayerStats } = require('../controllers/playerStatsController');

router.get('/stats', fetchPlayerStats);

module.exports = router;
