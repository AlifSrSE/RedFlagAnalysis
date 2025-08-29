import React, { useState } from 'react';
import { Card, Result, Tag, Typography, Button, message, Modal, Radio, Form, Input, Spin, Row, Col, Divider } from 'antd';
import { CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useGetAnalysisResultQuery, useOverrideAnalysisResultMutation } from '../api/analysisApi';

const { Title, Paragraph } = Typography;

interface AnalysisResultProps {
  analysisId: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysisId }) => {
  const { data, isLoading, error, refetch } = useGetAnalysisResultQuery(analysisId);
  const [overrideDecision, { isLoading: isOverriding }] = useOverrideAnalysisResultMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  if (isLoading) return <Spin tip="Analyzing..." size="large" />;
  if (error) return <Result status="error" title="Analysis Failed" subTitle="Unable to fetch analysis data." />;
  if (!data) return null;

  const showOverrideModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      newResult: data.finalResult
    });
  };

  const handleOverride = async (values: any) => {
    try {
      await overrideDecision({ id: analysisId, newResult: values.newResult, reason: values.reason });
      message.success('Decision overridden successfully!');
      setIsModalVisible(false);
      refetch(); // Refetch to show the new overridden state
    } catch (err) {
      message.error('Failed to override decision.');
    }
  };

  const currentResult = data.verifierOverride.overridden ? data.verifierOverride.overriddenResult : data.finalResult;
  const isHardResult = currentResult === 'Hard';

  return (
    <Card bordered>
      <Result
        icon={isHardResult ? <ExclamationCircleOutlined /> : <WarningOutlined />}
        status={isHardResult ? "error" : "warning"}
        title={isHardResult ? "Hard Red Flag Found" : "Soft Red Flag Detected"}
        subTitle={isHardResult ? "This loan is auto-rejected based on hard red flags." : "Review and mitigate risks. Loan grade may be capped."}
      />
      <Divider orientation="left">Detailed Analysis</Divider>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Title level={5}>Hard Red Flags</Title>
          {data.hardFlags.length > 0 ? (
            data.hardFlags.map((flag: string) => <Tag color="red" key={flag}>{flag}</Tag>)
          ) : (
            <Paragraph>No hard red flags found. </Paragraph>
          )}
        </Col>
        <Col span={12}>
          <Title level={5}>Soft Red Flags</Title>
          {data.softFlags.length > 0 ? (
            data.softFlags.map((flag: string) => <Tag color="orange" key={flag}>{flag}</Tag>)
          ) : (
            <Paragraph>No soft red flags found. </Paragraph>
          )}
        </Col>
      </Row>
      <Divider orientation="left">Final Decision</Divider>
      <Paragraph>
        Current System Result: <Tag color={isHardResult ? "red" : "orange"}>{currentResult}</Tag>
      </Paragraph>
      {data.verifierOverride.overridden && (
        <Paragraph>
          <CheckCircleOutlined style={{ color: 'green' }} /> Overridden by Verifier. New Result: <Tag color={data.verifierOverride.overriddenResult === 'Hard' ? "red" : "orange"}>{data.verifierOverride.overriddenResult}</Tag>
          <br />Reason: {data.verifierOverride.reason}
        </Paragraph>
      )}
      <Button type="primary" onClick={showOverrideModal} loading={isOverriding}>
        Override Decision
      </Button>

      <Modal
        title="Override Analysis Result"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={form.submit}
        confirmLoading={isOverriding}
      >
        <Form form={form} layout="vertical" onFinish={handleOverride}>
          <Form.Item
            name="newResult"
            label="New Result"
            rules={[{ required: true, message: 'Please select a new result' }]}
          >
            <Radio.Group>
              <Radio value="Hard">Hard Red Flag</Radio>
              <Radio value="Soft">Soft Red Flag</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason for Override"
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AnalysisResult;