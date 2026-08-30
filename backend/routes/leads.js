const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// Mock market price: ₹7,000 per gram of 24K pure gold
const GOLD_PRICE_PER_GRAM_24K = 7000;
const LTV_CAP = 0.75;

// POST /api/v1/leads/submit
router.post('/submit', async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      grossWeightGrams,
      netWeightGrams,
      purityKarat,
      selectedPlanId,
    } = req.body;

    // 1. Validation
    if (!customerName || !mobileNumber || grossWeightGrams === undefined || netWeightGrams === undefined || !purityKarat || !selectedPlanId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits' });
    }

    if (netWeightGrams > grossWeightGrams) {
      return res.status(400).json({ error: 'Net weight cannot be greater than gross weight' });
    }

    if (![18, 22, 24].includes(purityKarat)) {
      return res.status(400).json({ error: 'Invalid purity karat. Must be 18, 22, or 24' });
    }

    // 2. Deduplication Check (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const duplicateLead = await Lead.findOne({
      mobileNumber,
      createdAt: { $gte: sevenDaysAgo },
    });

    if (duplicateLead) {
      return res.status(409).json({ error: 'A lead with this mobile number has already been submitted within the last 7 days.' });
    }

    // 3. Math & Business Logic
    // Compute pure gold weight based on Karat purity (e.g., 22K = 22/24)
    const purityMultiplier = purityKarat / 24;
    const calculatedPureGoldGrams = netWeightGrams * purityMultiplier;

    // Calculate Max Eligible Loan Amount using 75% LTV cap
    const marketValue = calculatedPureGoldGrams * GOLD_PRICE_PER_GRAM_24K;
    const calculatedMaxLoanAmount = marketValue * LTV_CAP;

    // 4. Save to Database
    const newLead = new Lead({
      customerName,
      mobileNumber,
      grossWeightGrams,
      netWeightGrams,
      purityKarat,
      selectedPlanId,
      calculatedPureGoldGrams,
      calculatedMaxLoanAmount,
      status: 'SUBMITTED',
    });

    await newLead.save();

    res.status(201).json({
      message: 'Lead submitted successfully',
      applicationId: newLead._id,
      calculatedPureGoldGrams,
      calculatedMaxLoanAmount,
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// GET /api/v1/leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
