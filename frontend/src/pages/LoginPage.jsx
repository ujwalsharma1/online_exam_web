import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title, Link } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('Login successful');
      
      const role = res.data.user.role;
      console.log(role); 
        if (role === 'student') {
        navigate('/student-dashboard');
        } else if (role === 'teacher') {
        navigate('/teacher-dashboard');
        }

    } catch (err) {
      message.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title level={2}>Login</Title>
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate('/signup')}>
            Don't have an account? Sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
