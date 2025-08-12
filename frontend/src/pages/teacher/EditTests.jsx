import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Typography,
  List,
  Space,
  Tag,
  Select,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;
const apiBase = import.meta.env.VITE_API_BASE_URL;
const EditTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/tests/teacher`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setTests(data);
    } catch (err) {
      message.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = async (testId) => {
    try {
      await axios.delete(`${apiBase}/api/tests/${testId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      message.success("Test deleted");
      fetchTests();
    } catch {
      message.error("Delete failed");
    }
  };

  const updateStatus = async (testId, newStatus) => {
    try {
      await axios.patch(
        `${apiBase}/api/tests/${testId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Status updated");
      fetchTests();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    { title: "Duration (min)", dataIndex: "duration" },
    {
      title: "Total Questions",
      render: (_, record) => record.questions?.length || 0,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 120 }}
          onChange={(value) => updateStatus(record._id, value)}
        >
          <Option value="draft">Draft</Option>
          <Option value="published">Published</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              navigate(`/teacher-dashboard/edit-test/${record._id}`)
            }
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this test?"
            onConfirm={() => deleteTest(record._id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <List
      bordered
      dataSource={record.questions}
      renderItem={(question, index) => (
        <List.Item key={question._id || index}>
          <div>
            <Text strong>Q{index + 1}:</Text> {question.text}
            <ul style={{ marginTop: "4px", marginLeft: "20px" }}>
              {question.options.map((opt, i) => (
                <li key={i}>
                  {String.fromCharCode(65 + i)}. {opt}{" "}
                  {i === question.correctAnswer && (
                    <Text type="success">(Correct)</Text>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <Table
      columns={columns}
      dataSource={tests}
      rowKey="_id"
      expandable={{ expandedRowRender }}
      loading={loading}
    />
  );
};

export default EditTests;
