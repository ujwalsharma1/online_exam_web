import React, { useEffect, useState } from "react";
import { Table, Spin, message, Modal, Progress } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const apiBase = import.meta.env.VITE_API_BASE_URL;
const PastResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailedResult, setDetailedResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${apiBase}/api/results/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const transformed = res.data.map((item) => ({
        attemptId: item.attemptId || item._id,
        testTitle: item.title,
        score: item.score,
        total: item.total,
        percentage: item.percentage + "%",
        date: dayjs(item.attemptedAt).format("YYYY-MM-DD"),
      }));

      setResults(transformed);
    } catch (err) {
      message.error("Failed to fetch results");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (attemptId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${apiBase}/api/results/${attemptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDetailedResult(res.data);
      setModalVisible(true);
    } catch (err) {
      message.error("Failed to fetch detailed result");
      console.error(err);
    }
  };

  const downloadAsPDF = () => {
    const input = document.getElementById("result-detail");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("detailed-result.pdf");
    });
  };

  const columns = [
    { title: "Test", dataIndex: "testTitle" },
    { title: "Score", dataIndex: "score" },
    { title: "Total", dataIndex: "total" },
    { title: "Percentage", dataIndex: "percentage" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Action",
      render: (_, record) => (
        <button onClick={() => handleViewDetails(record.attemptId)}>
          View Details
        </button>
      ),
    },
  ];

  useEffect(() => {
    fetchResults();
  }, []);

  const COLORS = ["#00C49F", "#FF8042"]; 

  return (
    <>
      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={results} columns={columns} rowKey="attemptId" />
      )}

      <Modal
        title="Detailed Result"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={750}
      >
        {detailedResult && (
          <div id="result-detail" style={{ maxHeight: 600, overflowY: "auto" }}>
            <button
              onClick={downloadAsPDF}
              style={{
                backgroundColor: "#1890ff",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                float: "right",
                marginBottom: "1rem",
              }}
            >
              Download as PDF
            </button>
            <div style={{ clear: "both" }}></div>

            <p>
              <strong>Test:</strong> {detailedResult.test.title}
            </p>
            <p>
              <strong>Student:</strong> {detailedResult.student.name} (
              {detailedResult.student.rollNumber})
            </p>
            <p>
              <strong>Score:</strong> {detailedResult.score}/
              {detailedResult.total}
            </p>
            <p>
              <strong>Percentage:</strong> {detailedResult.percentage}%
              <Progress
                type="circle"
                percent={parseFloat(detailedResult.percentage)}
                strokeColor="#1890ff"
                style={{ marginLeft: "1rem" }}
              />
            </p>
            <hr />
            {detailedResult.detailedResults.map((q, index) => (
              <div key={q.questionId} style={{ marginBottom: "1rem" }}>
                <strong>Q{index + 1}:</strong> {q.text}
                <br />
                <span>
                  <strong>✅ Correct Answer:</strong> {q.correctAnswer}
                </span>
                <br />
                <span style={{ color: "blue" }}>
                  <strong>🟡 Your Answer:</strong> {q.selectedAnswer}
                </span>
                <br />
                <span style={{ color: q.isCorrect ? "green" : "red" }}>
                  {q.isCorrect ? "✔️ Correct" : "❌ Incorrect"}
                </span>
              </div>
            ))}
            <hr />
            <h3>Visual Summary</h3>

            {/* Pie Chart for correct/incorrect */}
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Correct",
                      value: detailedResult.detailedResults.filter(
                        (q) => q.isCorrect
                      ).length,
                    },
                    {
                      name: "Incorrect",
                      value: detailedResult.detailedResults.filter(
                        (q) => !q.isCorrect
                      ).length,
                    },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <PieTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Bar Chart for question-wise correctness */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={detailedResult.detailedResults.map((q, i) => ({
                  name: `Q${i + 1}`,
                  Correct: q.isCorrect ? 1 : 0,
                  Incorrect: !q.isCorrect ? 1 : 0,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 1]} />
                <BarTooltip />
                <Legend />
                <Bar dataKey="Correct" stackId="a" fill="#00C49F" />
                <Bar dataKey="Incorrect" stackId="a" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PastResults;
