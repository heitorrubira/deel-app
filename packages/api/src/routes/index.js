const { Router } = require('express');
const { getProfile } = require('../middleware');

const contractRoutes = require('./contracts');
const adminRoutes = require('./admin');
const balanceRoutes = require('./balances');
const profileRoutes = require('./profiles');
const jobRoutes = require('./jobs');

const router = new Router();

router.use('/contracts', getProfile, contractRoutes);
router.use('/admin', adminRoutes);
router.use('/balances', balanceRoutes);
router.use('/profiles', profileRoutes);
router.use('/jobs', getProfile, jobRoutes);

module.exports = router;
