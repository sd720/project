const express = require('express');
const router = express.Router();

// Mock data for loan schemes
const loanSchemes = [
  {
    id: 'PLAN_BULLET_01',
    name: 'Bullet Repayment Plan',
    description: 'Pay interest and principal at the end of the tenure.',
    baseInterestRate: 11.5, // 11.5% p.a.
    maxLtvCap: 0.75, // 75%
  },
  {
    id: 'PLAN_EMI_01',
    name: 'Monthly EMI Plan',
    description: 'Pay interest and principal in equal monthly installments.',
    baseInterestRate: 10.9, // 10.9% p.a.
    maxLtvCap: 0.75, // 75%
  }
];

// GET /api/v1/loan-schemes
router.get('/', (req, res) => {
  res.json(loanSchemes);
});

module.exports = router;
