import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileAddOutlined,
  EditOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const TeacherLayout = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ color: 'white', padding: '20px', fontSize: '20px' }}>
          Teacher Panel
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<TeamOutlined />} onClick={() => navigate('students')}>
            View Students
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />} onClick={() => navigate('create-test')}>
            Create Test
          </Menu.Item>
          <Menu.Item key="3" icon={<EditOutlined />} onClick={() => navigate('edit-tests')}>
            Edit Tests
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />} onClick={() => navigate('results')}>
            View Results
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />} onClick={() => navigate('profile')}>
            Profile
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: 20 }}>
          <h3>Welcome, Teacher</h3>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeacherLayout;
