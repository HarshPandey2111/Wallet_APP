const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth'); // JWT Middleware
const router = express.Router();
const prisma = new PrismaClient();

// Utility function to handle errors
const handleError = (res, message, error = null) => {
  console.error(message, error?.message || error);
  return res.status(500).json({ error: message });
};

// Middleware to validate transaction input
const validateTransactionInput = (req, res, next) => {
  const { walletId, type, amount, category } = req.body;

  if (!walletId || !type || !amount || !category) {
    return res.status(400).json({ error: 'All fields (walletId, type, amount, category) are required.' });
  }

  if (type !== 'credit' && type !== 'debit') {
    return res.status(400).json({ error: 'Transaction type must be either "credit" or "debit".' });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  next();
};

// Route: Create a Transaction
router.post('/add', authenticateToken, validateTransactionInput, async (req, res) => {
  const { walletId, type, amount, category } = req.body;

  try {
    // Check if the wallet exists
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId, userId: req.user.userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    // Update wallet balance based on transaction type
    const updatedBalance =
      type === 'credit' ? wallet.balance + amount : wallet.balance - amount;

    if (updatedBalance < 0) {
      return res.status(400).json({ error: 'Insufficient balance for this transaction.' });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        walletId,
        type,
        amount,
        category,
      },
    });

    // Update the wallet balance
    await prisma.wallet.update({
      where: { id: walletId },
      data: { balance: updatedBalance },
    });

    res.status(201).json({ message: 'Transaction added successfully.', transaction });
  } catch (error) {
    handleError(res, 'Failed to create transaction.', error);
  }
});

// Route: Get All Transactions for a Wallet
router.get('/:walletId', authenticateToken, async (req, res) => {
  const { walletId } = req.params;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId, userId: req.user.userId },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(transactions);
  } catch (error) {
    handleError(res, 'Failed to fetch transactions.', error);
  }
});

// Route: Delete a Transaction
router.delete('/:transactionId', authenticateToken, async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Check if transaction exists
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { wallet: true },
    });

    if (!transaction || transaction.wallet.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Adjust wallet balance before deleting the transaction
    const adjustment =
      transaction.type === 'credit' ? -transaction.amount : transaction.amount;

    await prisma.wallet.update({
      where: { id: transaction.walletId },
      data: { balance: transaction.wallet.balance + adjustment },
    });

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    handleError(res, 'Failed to delete transaction.', error);
  }
});

module.exports = router;
