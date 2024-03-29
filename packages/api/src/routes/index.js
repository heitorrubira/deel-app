const { Router } = require('express');
const { getProfile } = require('../middleware');

const contractRoutes = require('./contracts');

const router = new Router();

router.use('/contracts', getProfile, contractRoutes);

module.exports = router;
