const { Router } = require('express');
const { getProfile } = require('../middleware');

const contractRoutes = require('./contracts');
const adminRoutes = require('./admin');
const balanceRoutes = require('./balances');

const router = new Router();

router.use('/contracts', getProfile, contractRoutes);
router.use('/admin', adminRoutes);
router.use('/balances', balanceRoutes);

module.exports = router;
