import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Descriptions,
  Space,
  Avatar,
  Typography,
  Tag,
  Row,
  Col
} from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setProfile(user);
      form.setFieldsValue(user);
    } else {
      message.error('No user data found');
    }
  }, [form]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedUser = { ...profile, ...values };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(updatedUser);
      message.success('Profile updated locally');
      setEditing(false);
    } catch {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Card
      style={{
        maxWidth: 700,
        margin: '40px auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: 16,
        padding: 20
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col span={6} style={{ textAlign: 'center' }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <Tag color={profile.role === 'teacher' ? 'geekblue' : 'green'} style={{ marginTop: 10 }}>
            {profile.role.toUpperCase()}
          </Tag>
        </Col>
        <Col span={18}>
          <Title level={3} style={{ marginBottom: 0 }}>{profile.name}</Title>
          <Text type="secondary">{profile.email}</Text>
        </Col>
      </Row>

      <div style={{ marginTop: 30 }}>
        {editing ? (
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Input disabled />
            </Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<EditOutlined />}>
                Save
              </Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </Space>
          </Form>
        ) : (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{profile.role}</Descriptions.Item>
          </Descriptions>
        )}
      </div>

      <Space style={{ marginTop: 30 }}>
        {!editing && (
          <Button type="primary" icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Button>
      </Space>
    </Card>
  );
};

export default Profile;
