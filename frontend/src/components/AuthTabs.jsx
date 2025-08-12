import React, { useState } from 'react';
import { Tabs, Input, Button, Form, message, Space } from 'antd';
import { studentSignup, teacherSignup } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const AuthTabs = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: '', email: '', password: '', rollNumber: '', department: ''
  });
  const [teacher, setTeacher] = useState({
    name: '', email: '', password: '', teacherId: '', department: ''
  });

  const handleSignup = async (role) => {
    try {
      const res = role === 'student'
        ? await studentSignup(student)
        : await teacherSignup(teacher);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('Signup successful');
      navigate('/login');
    } catch (err) {
      message.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Student" key="1">
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={student.email} onChange={e => setStudent({ ...student, email: e.target.value })} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password value={student.password} onChange={e => setStudent({ ...student, password: e.target.value })} />
          </Form.Item>
          <Form.Item label="Roll Number">
            <Input value={student.rollNumber} onChange={e => setStudent({ ...student, rollNumber: e.target.value })} />
          </Form.Item>
          <Form.Item label="Department">
            <Input value={student.department} onChange={e => setStudent({ ...student, department: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => handleSignup('student')} block>
              Sign Up as Student
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Teacher" key="2">
        <Form layout="vertical">
          <Form.Item label="Name">
            <Input value={teacher.name} onChange={e => setTeacher({ ...teacher, name: e.target.value })} />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={teacher.email} onChange={e => setTeacher({ ...teacher, email: e.target.value })} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password value={teacher.password} onChange={e => setTeacher({ ...teacher, password: e.target.value })} />
          </Form.Item>
          <Form.Item label="Teacher ID">
            <Input value={teacher.teacherId} onChange={e => setTeacher({ ...teacher, teacherId: e.target.value })} />
          </Form.Item>
          <Form.Item label="Department">
            <Input value={teacher.department} onChange={e => setTeacher({ ...teacher, department: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => handleSignup('teacher')} block>
              Sign Up as Teacher
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  );
};

export default AuthTabs;
