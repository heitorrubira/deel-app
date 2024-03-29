const { Router } = require('express');
const { DateTime } = require('luxon');
const Sequelize = require('sequelize');
const TransactionError = require('../transaction-error');

const router = new Router();

/**
 * GET /jobs/unpaid
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 */
router.get('/unpaid', async (req, res) => {
  const userProfile = req.profile;
  const { Job, Contract } = req.app.get('models');

  const result = await Job.findAll({
    include: [{
      model: Contract,
      required: true,
      attributes: [],
      where: {
        [Sequelize.Op.or]: [{ ClientId: userProfile.id }, { ContractorId: userProfile.id } ],
        status: {
          [Sequelize.Op.eq]: Contract.IN_PROGRESS_STATUS,
        },
      },
    }],
    where: {
      paid: { [Sequelize.Op.not]: true }
    },
  });

  return res.json(result);
});

/**
 * POST /jobs/:jobId/pay
 * Pay for a job, a client can only pay if his balance >= the amount to pay.
 * The amount should be moved from the client's balance to the contractor balance.
 */
router.post('/:jobId/pay', async (req, res) => {
  const jobId = parseInt(req.params.jobId);
  if (isNaN(jobId)) {
    return res.status(400).json('Invalid jobId!');
  }
  const userProfile = req.profile;
  const { Job, Contract, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  
  const transaction = await sequelize.transaction();
  try {
    const job = await Job.findOne({
      where: {
        id: jobId,
        paid: { [Sequelize.Op.not]: true },
      },
      include: [{
        model: Contract,
        required: true,
        where: {
          ClientId: userProfile.id,
          status: { [Sequelize.Op.eq]: Contract.IN_PROGRESS_STATUS },
        },
      }],
    }, { transaction });
    if (!job) {
      throw new TransactionError(404, 'Job with given id not found!');
    }

    const client = await Profile.findOne({
      where: { id: userProfile.id }
    }, { transaction });
    if (client.balance < job.price) {
      throw new TransactionError(400, 'User with not enough balcance!');
    }

    const contractor = await Profile.findOne({
      where: { id: job.Contract.ContractorId },
    }, { transaction });

    await contractor.update({ balance: contractor.balance + job.price }, { transaction });
    await client.update({ balance: client.balance - job.price }, { transaction });
    
    const updatedJob = await job.update({
      paid: true,
      paymentDate: DateTime.local().toJSDate(),
    }, { transaction, returning: true });
  
    await transaction.commit();

    return res.json(updatedJob);
  } catch (err) {
    await transaction.rollback();
    console.error('Error on execute the pay transation!', { err });
    return res
      .status(err.statusCode || 500)
      .json(err.message || 'Unknow error!');
  }
});


module.exports = router;