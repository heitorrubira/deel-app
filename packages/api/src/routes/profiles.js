const { Router } = require('express');

const router = new Router();

/**
 * GET /profiles
 * Returns a list of profiles, useful for your login
 */
router.get('/', async (req, res) => {
  const { Profile } = req.app.get('models');
  const allowedTypes = [Profile.CLIENT_TYPE, Profile.CONTRACTOR_TYPE];
  const profileType = req.query.profileType || 'client';
  if (!allowedTypes.includes(profileType)) {
    return res.status(400).json(`Invalid profile type=${profileType}!`);
  }
  const result = await Profile.findAll({
    where: {
      type: profileType,
    },
  });

  return res.json(result);
});

module.exports = router;
