// src/pages/student/StudentDashboard.js
import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const StudentDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'available-tests', label: 'Available Tests' },
    { key: 'past-results', label: 'Past Results' },
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout' },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.clear();
      navigate('/');
    } else {
      navigate(`/student-dashboard/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline" items={menuItems} onClick={handleMenuClick} />
      </Sider>
      <Layout>
        <Header style={{ color: 'white' }}>Student Dashboard</Header>
        <Content style={{ margin: '1rem', background: '#fff', padding: '1rem' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentDashboard;
