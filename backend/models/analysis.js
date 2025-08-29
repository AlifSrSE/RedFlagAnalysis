const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  // Input Data Fields
  borrowerData: {
    // Financials & Credit Ratios
    activeDefault: { type: Boolean, default: false },
    monthlyRevenue: { type: Number },
    lastMonthExpense: { type: Number },
    installmentObligation: { type: Number },
    payablePeriod: { type: String, enum: ['monthly', 'weekly'] },
    dbr: { type: Number },
    currentLiabilityRatio: { type: Number },
    profitabilityRatio: { type: Number },
    businessType: { type: String, enum: ['wholesaler', 'retailer'] },
    leverageRatio: { type: Number },
    
    // Compliance & Other Hard Flags
    loanTenor: { type: Number },
    rentDeedPeriod: { type: Number },
    blacklistedIndustry: { type: Boolean, default: false },
    verifiedTradeLicense: { type: Boolean, default: false },
    collateralDisputes: { type: Boolean, default: false },
    
    // Soft Flags
    weakGuarantor: { type: Boolean, default: false },
    yearsOfOperation: { type: Number },
    tradeLicenseAge: { type: Number },
    customerConcentration: { type: Number },
    supplierConcentration: { type: Number },
    seasonalRevenue: { type: Number },
    highPersonalExpenses: { type: Boolean, default: false },
    frequentRelocation: { type: Boolean, default: false },
    overstatedSales: { type: Boolean, default: false },
    informalBorrowing: { type: Boolean, default: false },
    reputationIssues: { type: Boolean, default: false },
    pendingLegalDisputes: { type: Boolean, default: false },
    noDigitalFootprint: { type: Boolean, default: false },
    poorRecordKeeping: { type: Boolean, default: false },
    lowTransactionFrequency: { type: Boolean, default: false },
    industryExternalShocks: { type: Boolean, default: false },
  },
  
  // Analysis Results
  hardFlags: [{ type: String }],
  softFlags: [{ type: String }],
  finalResult: { type: String, enum: ['Hard', 'Soft'], required: true },
  
  // Verifier Override
  verifierOverride: {
    overridden: { type: Boolean, default: false },
    overriddenResult: { type: String, enum: ['Hard', 'Soft'] },
    reason: { type: String },
    timestamp: { type: Date }
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', analysisSchema);