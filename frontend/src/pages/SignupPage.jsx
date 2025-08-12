import React from 'react';
import { Typography } from 'antd';
import AuthTabs from '../components/AuthTabs';

const { Title } = Typography;

const SignupPage = () => {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>Sign Up</Title>
      <AuthTabs />
    </div>
  );
};

export default SignupPage;
