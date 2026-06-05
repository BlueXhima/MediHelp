const express = require('express');
const router = express.Router();
const { getNearbyHospitals } = require('../controller/hospitalController');

router.get('/proxy-overpass', getNearbyHospitals);

module.exports = router;
