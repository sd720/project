# AI Usage Log

## AI Tools Used
- Gemini 3.1 Pro (High) via Antigravity IDE (Agentic Coding Assistant)

## Exact Prompts Used

**Prompt 1 (Backend Validation):**
> "Generate an Express POST route `/api/v1/leads/submit` that accepts customerName, mobileNumber, grossWeightGrams, netWeightGrams, purityKarat, and selectedPlanId. It needs strict validation: reject missing fields, ensure mobileNumber is exactly 10 digits, ensure netWeight is strictly less than or equal to grossWeight, and check purity is 18, 22, or 24. Also implement a deduplication check to return 409 Conflict if the same mobileNumber exists in the last 7 days."

**Prompt 2 (Frontend State Management):**
> "Create a React component `IntakePortal` using Vite. I need a multi-step form with 3 steps: 1) Details, 2) Calculator, 3) Confirmation. Use `useState` for the step index and a single `formData` state object. Use `useMemo` to dynamically calculate `pureGoldWeight = netWeight * (purity/24)` and `maxLoanAmount = pureGoldWeight * 7000 * 0.75`. Ensure Step 1 has a validation function before moving to Step 2."

## Manual Audit & Flaw Correction
**Instance of Flawed AI Code:**
During the generation of the backend validation logic, the AI initially produced the deduplication query like this:
```javascript
const duplicateLead = await Lead.findOne({ mobileNumber });
if (duplicateLead) return res.status(409).json({ error: "Duplicate found." });
```

**How it was manually audited and fixed:**
I audited the code and realized the assignment strictly requires rejecting duplicates *only within the last 7 days*, not indefinitely. The AI's generated code would permanently lock out a customer from ever applying again after their first submission. I manually updated the query to include a date range check using MongoDB's `$gte` operator:

```javascript
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const duplicateLead = await Lead.findOne({
  mobileNumber,
  createdAt: { $gte: sevenDaysAgo },
});
```
This ensured the logic adhered perfectly to the business requirements.
