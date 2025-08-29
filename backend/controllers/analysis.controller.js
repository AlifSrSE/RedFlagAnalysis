const Analysis = require('../models/analysis');

const runDeepPatternAnalysis = (data) => {
  const deepPatternFlags = [];
  
  // 1. Repayment History Trends
  if (data.paymentHistory && data.paymentHistory.length > 2) {
    let increasingDelay = false;
    for (let i = 1; i < data.paymentHistory.length; i++) {
      if (data.paymentHistory[i].daysLate > data.paymentHistory[i-1].daysLate) {
        increasingDelay = true;
      }
    }
    if (increasingDelay) deepPatternFlags.push('LATE_REPAY_TREND');
    
    if (data.paymentHistory.some(p => p.skipped)) deepPatternFlags.push('SKIPPED_INSTALMENT');
    if (data.paymentHistory.some(p => p.partialPayment)) deepPatternFlags.push('PARTIAL_PAYMENTS');
  }

  // 2. Bank Transaction Patterns
  if (data.bankDeposits && data.bankDeposits.length > 0) {
    const totalDeposits = data.bankDeposits.reduce((sum, d) => sum + d.amount, 0);
    const avgDeposit = totalDeposits / data.bankDeposits.length;
    const seasonalSpike = data.bankDeposits.some(d => d.amount > avgDeposit * 2.5); // Example spike logic
    if (seasonalSpike) deepPatternFlags.push('SEASONAL_SPIKES');
  }
  if (data.cashHeavyFlow) deepPatternFlags.push('CASH_HEAVY_FLOW');
  if (data.reportedSalesMismatch) deepPatternFlags.push('INCONSISTENT_DEPOSITS');

  // 3. Inventory vs Purchase Mismatch
  if (data.inventoryHistory && data.purchaseHistory) {
    const latestInventory = data.inventoryHistory[data.inventoryHistory.length - 1];
    const latestPurchases = data.purchaseHistory[data.purchaseHistory.length - 1];
    
    // Simplified logic: Check if purchases don't match sales/inventory
    if (latestPurchases && latestPurchases.amount > latestInventory.stock * 1.5) { // Arbitrary check
      deepPatternFlags.push('HIGH_PURCHASE_LOW_STOCK');
    }

    // Simplified logic: inventory buildup
    if (latestInventory && latestInventory.stock > 1000 && (data.salesHistory[data.salesHistory.length-1].amount < data.salesHistory[data.salesHistory.length-2].amount)) {
      deepPatternFlags.push('INVENTORY_BUILDUP');
    }
    if (data.stockSalesGap) deepPatternFlags.push('STOCK_SALES_GAP');
  }

  // 4. Sales Trends (Last 6 Months)
  if (data.salesHistory && data.salesHistory.length >= 3) {
    const last3Sales = data.salesHistory.slice(-3).map(s => s.amount);
    if (last3Sales[0] > last3Sales[1] && last3Sales[1] > last3Sales[2]) {
      deepPatternFlags.push('DECLINING_SALES_3M');
    }
    const salesFluctuation = Math.abs(last3Sales[0] - last3Sales[1]) / last3Sales[1];
    if (salesFluctuation > 0.4) deepPatternFlags.push('VOLATILE_SALES');
    if (data.unreportedSales) deepPatternFlags.push('UNREPORTED_SALES');
  }

  // 5. Expense Monitoring
  if (data.expenseHistory && data.expenseHistory.length > 1) {
    const latestExpense = data.expenseHistory[data.expenseHistory.length - 1];
    const prevExpense = data.expenseHistory[data.expenseHistory.length - 2];
    if (latestExpense && prevExpense && latestExpense.amount > prevExpense.amount * 1.7) {
      deepPatternFlags.push('EXPENSE_SPIKE_UNEXPLAINED');
    }
  }
  if (data.highPersonalExpense) deepPatternFlags.push('HIGH_PERSONAL_EXPENSE');
  if (data.salaryBurdenHigh) deepPatternFlags.push('SALARY_BURDEN_HIGH');

  // 6. Data Integrity
  if (data.missingDataFields) deepPatternFlags.push('MISSING_DATA_FIELDS');
  if (data.inconsistentReporting) deepPatternFlags.push('INCONSISTENT_REPORTING');
  if (data.docMismatch) deepPatternFlags.push('DOC_MISMATCH');

  return deepPatternFlags;
};

const runComprehensiveAnalysis  = (data) => {
  const hardFlags = [];
  const softFlags = [];

  const getPayableRevenue = (revenue, period) => {
    return period === 'weekly' ? revenue / 4 : revenue;
  };

// --- Hard Red Flags (Auto-Reject) ---
  if (data.activeDefault) hardFlags.push('Active default/NPL with existing lender');
  
  // Revenue vs. Installment check
  if (data.payablePeriod && getPayableRevenue(data.monthlyRevenue, data.payablePeriod) < data.installmentObligation) {
    hardFlags.push('Revenue doesn’t meet installment obligation');
  }
  
  // Credit Ratios
  if (data.dbr >= 60) hardFlags.push('DBR ≥ 60%');
  if (data.currentLiabilityRatio >= 60) hardFlags.push('Current liability ratio ≥ 60%');
  if (data.profitabilityRatio <= 3 && data.businessType === 'wholesaler') {
    hardFlags.push('Profitability below minimum threshold (Wholesaler)');
  }
  if (data.profitabilityRatio <= 10 && data.businessType === 'retailer') {
    hardFlags.push('Profitability below minimum threshold (Retailer)');
  }
  if (data.leverageRatio >= 60) hardFlags.push('Leverage ratio ≥ 60%');
  
  // Compliance & Other Hard Flags
  if (data.rentDeedPeriod < data.loanTenor * 2 || data.rentDeedPeriod < 1) {
    hardFlags.push('Rent deed period < 2x loan tenor or < 1 year');
  }
  if (data.blacklistedIndustry) hardFlags.push('Business in blacklisted / prohibited industry');
  if (!data.verifiedTradeLicense) hardFlags.push('Unverified trade license / address');
  if (data.collateralDisputes) hardFlags.push('Collateral already encumbered / disputed');
  
// --- Soft Red Flags (Grade Limitation) ---
  if (data.weakGuarantor) softFlags.push('Weak guarantor');
  if (data.yearsOfOperation < 2) softFlags.push('Years of operation < 2 years');
  if (data.tradeLicenseAge < 2) softFlags.push('Trade license age < 2 years');
  if (data.lastMonthExpense > data.monthlyRevenue) softFlags.push('Expense > revenue (last month)');
  if (data.customerConcentration > 50) softFlags.push('High customer concentration (>50%)');
  if (data.supplierConcentration > 70) softFlags.push('High supplier concentration (>70%)');
  if (data.seasonalRevenue > 50) softFlags.push('High seasonality risk (≥50% sales in few months)');
  if (data.highPersonalExpenses) softFlags.push('High personal expense withdrawals');
  if (data.frequentRelocation) softFlags.push('Frequent shop relocation');
  if (data.overstatedSales) softFlags.push('Overstated sales vs verifiable deposits');
  if (data.informalBorrowing) softFlags.push('High informal borrowings dependence');
  if (data.reputationIssues) softFlags.push('Reputation issues reported locally');
  if (data.pendingLegalDisputes) softFlags.push('Pending legal disputes / cases');
  if (data.noDigitalFootprint) softFlags.push('No digital footprint / no MFS usage');
  if (data.poorRecordKeeping) softFlags.push('Poor record-keeping (no ledgers)');
  if (data.lowTransactionFrequency) softFlags.push('Low transaction frequency in bank/MFS');
  if (data.industryExternalShocks) softFlags.push('Industry facing external shocks');

  // The 5C red flag is a summary based on other flags
  if (hardFlags.length > 0 || softFlags.length > 0) {
      // Logic for 5C is more complex, but here we can flag it if any others are flagged.
  }
  
  const deepPatternFlags = runDeepPatternAnalysis(data);

  return { hardFlags, softFlags, deepPatternFlags };
};

exports.analyzeData = async (req, res) => {
    const data = req.body;
    const { hardFlags, softFlags, deepPatternFlags } = runComprehensiveAnalysis (data);
    const finalResult = hardFlags.length > 0 ? 'Hard' : 'Soft';

    const newAnalysis = new Analysis({
      borrowerData: data,
      hardFlags,
      softFlags,
      deepPaternFlags,
      finalResult
    });

    await newAnalysis.save();
    res.status(201).json(newAnalysis);
};

exports.getAnalysis = async (req, res) => {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json(analysis);
};

exports.overrideDecision = async (req, res) => {
    const { newResult, reason } = req.body;
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    analysis.verifierOverride.overridden = true;
    analysis.verifierOverride.overriddenResult = newResult;
    analysis.verifierOverride.reason = reason;
    analysis.verifierOverride.timestamp = new Date();

    await analysis.save();

    res.json(analysis);
};