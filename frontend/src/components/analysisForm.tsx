import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Divider, message, Spin, Row, Col, Typography, Switch, InputNumber, Select } from 'antd';
import { useSubmitAnalysisMutation } from '../api/analysisApi';

const { Title } = Typography;
const { Option } = Select;

interface AnalysisFormProps {
  onAnalysisComplete: (id: string) => void;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalysisComplete }) => {
  const [form] = Form.useForm();
  const [submitAnalysis, { isLoading, isSuccess, data, error }] = useSubmitAnalysisMutation();

  useEffect(() => {
    if (isSuccess && data) {
      message.success('Analysis submitted successfully!');
      onAnalysisComplete(data._id);
    }
    if (error) {
      message.error('An error occurred during analysis.');
    }
  }, [isSuccess, data, error, onAnalysisComplete]);

  // Handle data prefilling logic here (mock data)
  useEffect(() => {
    const mockPrefilledData = {
      monthlyRevenue: 150000,
      lastMonthExpense: 50000,
      installmentObligation: 50000,
      payablePeriod: 'monthly',
      dbr: 35,
      currentLiabilityRatio: 55,
      profitabilityRatio: 12,
      businessType: 'retailer',
      leverageRatio: 40,
      loanTenor: 6,
      rentDeedPeriod: 12,
      blacklistedIndustry: false,
      verifiedTradeLicense: true,
      collateralDisputes: false,
      weakGuarantor: false,
      yearsOfOperation: 3,
      tradeLicenseAge: 3,
      customerConcentration: 60,
      supplierConcentration: 80,
      seasonalRevenue: 30,
      highPersonalExpenses: false,
      frequentRelocation: false,
      overstatedSales: false,
      informalBorrowing: false,
      reputationIssues: false,
      pendingLegalDisputes: false,
      noDigitalFootprint: false,
      poorRecordKeeping: true,
      lowTransactionFrequency: false,
      industryExternalShocks: false,
    };
    form.setFieldsValue(mockPrefilledData);
  }, [form]);

  const onFinish = (values: any) => {
    submitAnalysis(values);
  };

  return (
    <Card bordered>
      <Title level={4}>Red Flag Analysis Form</Title>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          {/* Financials & Ratios */}
            <Col span={8}>
            <Title level={5}>Financials & Ratios</Title>
                <Form.Item name="monthlyRevenue" label="Monthly Revenue ($)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="lastMonthExpense" label="Last Month Expense ($)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="installmentObligation" label="Installment Obligation ($)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="payablePeriod" label="Payable Period" rules={[{ required: true }]}>
                    <Select>
                        <Option value="monthly">Monthly</Option>
                        <Option value="weekly">Weekly</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="dbr" label="DBR (%)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="currentLiabilityRatio" label="Current Liability Ratio (%)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="profitabilityRatio" label="Profitability Ratio (%)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="businessType" label="Business Type" rules={[{ required: true }]}>
                    <Select>
                        <Option value="wholesaler">Wholesaler</Option>
                        <Option value="retailer">Retailer</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="leverageRatio" label="Leverage Ratio (%)" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
            </Col>

          {/* Business & Compliance */}
            <Col span={8}>
            <Title level={5}>Business & Compliance</Title>
                <Form.Item name="yearsOfOperation" label="Years of Operation">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="tradeLicenseAge" label="Trade License Age (Years)">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="loanTenor" label="Loan Tenor (Months)">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="rentDeedPeriod" label="Rent Deed Period (Months)">
                <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="customerConcentration" label="Customer Concentration (%)">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="supplierConcentration" label="Supplier Concentration (%)">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="seasonalRevenue" label="Seasonal Revenue (%)">
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
            </Col>

        {/* Other Flags */}
            <Col span={8}>
            <Title level={5}>Other Flags</Title>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Form.Item name="activeDefault" label="Active Default / NPL" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="blacklistedIndustry" label="Blacklisted Industry" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="collateralDisputes" label="Collateral Disputes" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="weakGuarantor" label="Weak Guarantor" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="frequentRelocation" label="Frequent Relocation" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="overstatedSales" label="Overstated Sales" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="reputationIssues" label="Reputation Issues" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="noDigitalFootprint" label="No Digital Footprint" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="lowTransactionFrequency" label="Low Transaction Frequency" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="verifiedTradeLicense" label="Verified Trade License" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="highPersonalExpenses" label="High Personal Expenses" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="informalBorrowing" label="Informal Borrowing Dependence" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="pendingLegalDisputes" label="Pending Legal Disputes" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="poorRecordKeeping" label="Poor Record-Keeping" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="industryExternalShocks" label="Industry External Shocks" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Row>

        <Divider />
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
                Analyze Business
            </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AnalysisForm;