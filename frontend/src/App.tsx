import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Layout, Typography, Row, Col } from 'antd';
import AnalysisForm from './components/analysisForm';
import AnalysisResult from './pages/analysisResult';
import 'antd/dist/antd.css';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  return (
    <Provider store={store}>
      <Layout className="main-layout">
        <Header className="header">
          <Title level={2} style={{ color: 'white', margin: 0 }}>Red Flag Analysis System</Title>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <div className="site-layout-content">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <AnalysisForm onAnalysisComplete={(id: any) => setAnalysisId(id)} />
              </Col>
              {analysisId && (
                <Col span={24}>
                  <AnalysisResult analysisId={analysisId} />
                </Col>
              )}
            </Row>
          </div>
        </Content>
      </Layout>
    </Provider>
  );
};

export default App;