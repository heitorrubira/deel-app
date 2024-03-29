const Sequelize = require('sequelize');
const { Router } = require('express');

const router = new Router();

/**
 * GET /contracts/:id
 * It should return the contract only if it belongs to the profile calling.
 */
router.get('/:id', async (req, res) => {
  const contractId = parseInt(req.params.id);
  if (isNaN(contractId)) {
    return res.status(400).json('Invalid id!');
  }
  const userProfile = req.profile;
  const { Contract } = req.app.get('models');

  const result = await Contract.findOne({
    where: {
      id: contractId,
      [Sequelize.Op.or]: [
        { ClientId: userProfile.id },
        { ContractorId: userProfile.id },
      ],
    },
  });

  if (!result) {
    return res.status(404).json(`Contract with id=${contractId}, not found!`);
  }

  return res.json(result);
});

module.exports = router;
