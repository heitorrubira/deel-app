const { Router } = require("express");
const { getProfile } = require('../middleware');

const router = new Router();

/**
 * FIX ME!
 * @returns contract by id
 */
router.get('/contracts/:id', getProfile, async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const contract = await Contract.findOne({ where: { id } });
  if (!contract) return res.status(404).end();
  res.json(contract);
});

module.exports = router;