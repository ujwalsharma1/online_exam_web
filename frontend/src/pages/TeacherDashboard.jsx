import React from 'react';
import { Layout, Menu, Card, Typography, Row, Col } from 'antd';
import {
  TeamOutlined,
  FileAddOutlined,
  EditOutlined,
  BarChartOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Link, Outlet,useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Title } = Typography;
const TeacherDashboard = () => {
const navigate = useNavigate();
  const location = useLocation();
const cardData = [
    {
      title: 'View Students',
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      path: '/teacher-dashboard/students',
    },
    {
      title: 'Create Test',
      icon: <FileAddOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      path: '/teacher-dashboard/create-test',
    },
    {
      title: 'Edit Tests',
      icon: <EditOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      path: '/teacher-dashboard/edit-tests',
    },
    {
      title: 'View Results',
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      path: '/teacher-dashboard/results',
    },
    {
      title: 'Profile',
      icon: <ProfileOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      path: '/teacher-dashboard/profile',
    },
  ];


const isDashboardHome = location.pathname === '/teacher-dashboard';









  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to="/teacher-dashboard/students">View Students</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />}>
            <Link to="/teacher-dashboard/create-test">Create Test</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<EditOutlined />}>
            <Link to="/teacher-dashboard/edit-tests">Edit Tests</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>
            <Link to="/teacher-dashboard/results">View Results</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ProfileOutlined />}>
            <Link to="/teacher-dashboard/profile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '20px' }}>
          {isDashboardHome ? (
            <div>
              <Title level={2}>Welcome to the Teacher Dashboard</Title>
              <p>Select an option below to get started.</p>
              <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
                {cardData.map((item, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card
                      hoverable
                      style={{ textAlign: 'center', minHeight: '140px' }}
                      onClick={() => navigate(item.path)}
                    >
                      {item.icon}
                      <Title level={4} style={{ marginTop: '10px' }}>{item.title}</Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherDashboard;
