const { Router } = require('express');
const { getProfile } = require('../middleware');

const contractRoutes = require('./contracts');
const adminRoutes = require('./admin');

const router = new Router();

router.use('/contracts', getProfile, contractRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
