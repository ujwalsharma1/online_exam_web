import React, { useEffect, useState } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
const apiBase = import.meta.env.VITE_API_BASE_URL;
const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/auth/students`);
      const formatted = res.data.map((s) => ({
        key: s._id,
        name: s.name,
        email: s.email,
        roll: s.rollNumber,
        dept: s.department,
      }));
      setStudents(formatted);
    } catch (err) {
      console.error(err);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Roll Number', dataIndex: 'roll' },
    { title: 'Department', dataIndex: 'dept' },
  ];

  return <Table columns={columns} dataSource={students} loading={loading} />;
};

export default ViewStudents;
