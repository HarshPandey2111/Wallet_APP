const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/auth'); // JWT Middleware

const router = express.Router();
const prisma = new PrismaClient();

// Utility function to handle errors
const handleError = (res, message, error = null) => {
  console.error(message, error?.message || error);
  return res.status(500).json({ error: message });
};

// Middleware to validate wallet input
const validateWalletInput = [
  body('balance')
    .optional()
    .isNumeric()
    .withMessage('Balance must be a valid number'),
];

// Create Wallet
router.post(
  '/create',
  authenticateToken,
  validateWalletInput,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { balance } = req.body;

    try {
      const wallet = await prisma.wallet.create({
        data: {
          userId: req.user.userId, // Extracted from JWT
          balance: balance || 0, // Default balance to 0
        },
      });

      res.status(201).json({ message: 'Wallet created successfully', wallet });
    } catch (err) {
      handleError(res, 'Failed to create wallet', err);
    }
  }
);

// Get Wallets for a User
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wallets);
  } catch (err) {
    handleError(res, 'Failed to fetch wallets', err);
  }
});

// Update Wallet Balance
router.put(
  '/:walletId',
  authenticateToken,
  validateWalletInput,
  async (req, res) => {
    const { walletId } = req.params;
    const { balance } = req.body;

    if (!balance) {
      return res
        .status(400)
        .json({ error: 'Balance field is required for update.' });
    }

    try {
      // Verify the wallet belongs to the authenticated user
      const wallet = await prisma.wallet.findFirst({
        where: { id: walletId, userId: req.user.userId },
      });

      if (!wallet) {
        return res
          .status(404)
          .json({ error: 'Wallet not found or access denied' });
      }

      const updatedWallet = await prisma.wallet.update({
        where: { id: walletId },
        data: { balance },
      });

      res.json({
        message: 'Wallet updated successfully',
        wallet: updatedWallet,
      });
    } catch (err) {
      handleError(res, 'Failed to update wallet', err);
    }
  }
);

// Delete Wallet
router.delete('/:walletId', authenticateToken, async (req, res) => {
  const { walletId } = req.params;

  try {
    // Verify the wallet belongs to the authenticated user
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId: req.user.userId },
    });

    if (!wallet) {
      return res
        .status(404)
        .json({ error: 'Wallet not found or access denied' });
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    res.json({ message: 'Wallet deleted successfully' });
  } catch (err) {
    handleError(res, 'Failed to delete wallet', err);
  }
});

module.exports = router;
