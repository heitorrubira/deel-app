const { DateTime } = require('luxon');
const { Router } = require('express');
const Sequelize = require('sequelize');

const router = new Router();

/**
 * GET /admin/best-profession?start=<date>&end=<date>
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range.
 */
router.get('/best-profession', async (req, res) => {
  const startDate = DateTime.fromISO(req.query.start);
  const endDate = DateTime.fromISO(req.query.end);
  if (!startDate.isValid || !endDate.isValid || startDate > endDate) {
    return res.status(400).json('Invalid query!');
  }

  const { Job, Contract, Profile } = req.app.get('models');

  const result = await Job.findAll({
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('price')), 'paid'],
      [Sequelize.col('Contract.Contractor.profession'), 'profession'],
    ],
    include: [{
      model: Contract,
      required: true,
      attributes: [],
      include: [{
        model: Profile,
        required: true,
        attributes: [],
        association: 'Contractor',
      }],
    }],
    where: {
      paymentDate: {
        [Sequelize.Op.between]: [startDate.toJSDate(), endDate.toJSDate()],
      },
    },
    group: ['Contract.Contractor.profession'],
    order: [[Sequelize.fn('sum', Sequelize.col('price')), 'desc']],
    limit: 1,
    raw: true,
  });

  if (!result) {
    return res.status(404)
      .json('Job not found for given date!');
  }

  res.json(result);
});


/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>
 * Returns the clients the paid the most for jobs in the query time period.
 * Limit query parameter should be applied, default limit is 2.
 */
router.get('/best-clients', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 2;
  const startDate = DateTime.fromISO(req.query.start);
  const endDate = DateTime.fromISO(req.query.end);

  if (isNaN(limit)) {
    return req.status(400).json('Invalid limit!');
  } else if (!startDate.isValid || !endDate.isValid || startDate > endDate) {
    return res.status(400).json('Invalid query!');
  }

  const { Job, Contract, Profile } = req.app.get('models');

  const result = await Job.findAll({
    attributes: [
      [Sequelize.col('Contract.Client.id'), 'id'],
      [
        Sequelize.fn(
          'concat',
          Sequelize.col('Contract.Client.firstName'),
          Sequelize.col('Contract.Client.lastName')
        ),
        'fullName'
      ],
      [Sequelize.fn('sum', Sequelize.col('price')), 'paid'],
    ],
    include: [{
      model: Contract,
      required: true,
      attributes: [],
      include: [{
        model: Profile,
        required: true,
        attributes: [],
        association: 'Client'
      }],
    }],
    where: {
      paymentDate: {
        [Sequelize.Op.between]: [startDate.toJSDate(), endDate.toJSDate()],
      },
    },
    group: ['Contract.Client.id'],
    order: [[Sequelize.fn('sum', Sequelize.col('price')), 'desc']],
    limit,
    raw: true,
  });

  res.json(result);
});

module.exports = router;