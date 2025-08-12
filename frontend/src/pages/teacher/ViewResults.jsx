import React, { useEffect, useState } from "react";
import { Table, message, Spin, Row, Col } from "antd";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"]; // Correct, Incorrect
const apiBase = import.meta.env.VITE_API_BASE_URL;
const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${apiBase}/api/results/all-tests`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const flattened = data.flatMap((test) =>
        test.results.map((r) => ({
          ...r,
          testTitle: test.title,
          testId: test.testId ?? test._id,
          detailedAnswers: r.detailedAnswers ?? []
        }))
      );

      setResults(flattened);
    } catch {
      message.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, []);

  const expandedRowRender = (record) => {
    const data = record.detailedAnswers;

    if (!data || data.length === 0) {
      return <p style={{ margin: 0 }}>No detailed answers available.</p>;
    }

    // Chart data: count correct vs incorrect
    const correctCount = data.filter((q) => q.isCorrect).length;
    const incorrectCount = data.length - correctCount;
    const chartData = [
      { name: "Correct", value: correctCount },
      { name: "Incorrect", value: incorrectCount }
    ];

    const columns = [
      { title: "Question", dataIndex: "question" },
      { title: "Selected Option", dataIndex: "selectedOption" },
      { title: "Correct Option", dataIndex: "correctOption" },
      {
        title: "Result",
        dataIndex: "isCorrect",
        render: (val) => (val ? "✔️ Correct" : "❌ Incorrect")
      },
      { title: "Marks", dataIndex: "marks" }
    ];

    return (
      <>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col span={8}>
            <h4>Answer Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={(r, i) => i}
          size="small"
        />
      </>
    );
  };

  const mainColumns = [
    { title: "Student Name", dataIndex: "studentName" },
    { title: "Roll Number", dataIndex: "rollNumber" },
    { title: "Test Title", dataIndex: "testTitle" },
    { title: "Score", dataIndex: "score" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Percentage",
      dataIndex: "percentage",
      render: (v) => `${v}%`
    },
    {
      title: "Date",
      dataIndex: "attemptedAt",
      render: (v) => new Date(v).toLocaleString()
    }
  ];

  return (
    <Table
      columns={mainColumns}
      dataSource={results}
      rowKey={(r) => r.studentId + r.testId}
      expandable={{ expandedRowRender }}
      loading={loading}
    />
  );
};

export default ViewResults;
