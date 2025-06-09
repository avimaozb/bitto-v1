import express from 'express';
import { Server, Networks, TransactionBuilder, Operation } from 'stellar-sdk';
import { validateJWT } from '../middleware/auth';
import { MoneyGramService } from '../services/moneygram';

const router = express.Router();
const moneygramService = new MoneyGramService();

// Get deposit quote
router.post('/deposit/quote', validateJWT, async (req, res) => {
  try {
    const { source_asset, destination_asset, amount } = req.body;
    const quote = await moneygramService.getDepositQuote(source_asset, destination_asset, amount);
    res.json(quote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update deposit with user info
router.put('/deposit/:id/update', validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = req.body;
    const result = await moneygramService.updateDeposit(id, userInfo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Commit deposit transaction
router.put('/deposit/:id/commit', validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await moneygramService.commitDeposit(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get withdrawal quote
router.post('/withdraw/quote', validateJWT, async (req, res) => {
  try {
    const { source_asset, destination_asset, amount } = req.body;
    const quote = await moneygramService.getWithdrawQuote(source_asset, destination_asset, amount);
    res.json(quote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update withdrawal with payout info
router.put('/withdraw/:id/update', validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const payoutInfo = req.body;
    const result = await moneygramService.updateWithdraw(id, payoutInfo);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Commit withdrawal transaction
router.put('/withdraw/:id/commit', validateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await moneygramService.commitWithdraw(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Webhook for transaction updates
router.post('/webhooks/transaction', async (req, res) => {
  try {
    const { transaction_id, status, message } = req.body;
    await moneygramService.handleTransactionUpdate(transaction_id, status, message);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 