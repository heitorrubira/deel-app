const { Router } = require('express');
const Sequelize = require('sequelize');
const config = require('../config');
const TransactionError = require('../transaction-error');

const router = new Router();

/**
 * POST /balances/deposit/:userId 
 * Deposits money into the the the balance of a client, a client can't
 * deposit more than 25% his total of jobs to pay. (at the deposit moment)
 */
router.post('/deposit/:userId', async (req, res) => {
  // TODO: We must use decimal or any other lib to handle money!
  const amount = parseFloat(req.body.amount);
  const userId = parseInt(req.params.userId);
  if (isNaN(amount) || amount < 0.0) {
    return res.status(400).json('Invalid amount to deposit!');
  } else if (isNaN(userId)) {
    return res.status(400).json('Invalid userId!');
  }

  const sequelize = req.app.get('sequelize');
  const { Profile, Job, Contract } = req.app.get('models');

  const transaction = await sequelize.transaction();
  try {
    const client = await Profile.findOne({
      where: { id: userId },
    }, { transaction });
    if (!client) {
      throw new TransactionError(404, 'Client profile not founded!');
    }
  
    const jobs = await Job.findAll({
      include: [{
        model: Contract,
        reuired: true,
        where: {
          ClientId: userId,
          status: { [Sequelize.Op.ne]: Contract.TERMINATED_STATUS },
        },
      }],
      where: {
        paid: { [Sequelize.Op.not]: true },
      },
    }, { transaction });
    if (!jobs.length) {
      throw new TransactionError(400, 'No jobs to be payed!');
    }

    const sumToPay = jobs.reduce((acc, curr) => {
      acc += curr.price;
      return acc;
    }, 0.0);
    const allowedToDeposit = sumToPay * config.maxDepositPercentage;
    if (amount > allowedToDeposit) {
      throw new TransactionError(400, `The max amount allowed to deposit is ${allowedToDeposit}.`);
    }
  
    const updatedClient = await client.update({
      balance: client.balance + amount,
    }, { returning: true });
    
    await transaction.commit();

    return res.json(updatedClient);
  } catch (err) {
    await transaction.rollback();
    console.error('Error on execute the pay transation!', { err });
    return res
      .status(err.statusCode || 500)
      .json(err.message || 'Unknow error!');
  }
});

module.exports = router;