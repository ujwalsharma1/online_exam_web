import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Divider,
} from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const apiBase = import.meta.env.VITE_API_BASE_URL;
const { TextArea } = Input;
const { Title, Text } = Typography;

const EditTestForm = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${apiBase}/api/tests/${testId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const { title, description, duration, questions } = res.data;
        form.setFieldsValue({ title, description, duration });
        setExistingQuestions(questions);
      } catch (err) {
        message.error("Failed to load test");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId, form]);

  const handleTestUpdate = async (values) => {
    try {
      await axios.put(
        `${apiBase}/api/tests/${testId}`,
        values,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success("Test updated");
    } catch (err) {
      message.error("Failed to update test");
    }
  };

  const handleAddQuestions = async () => {
    try {
      await axios.post(
        `${apiBase}/api/tests/${testId}/questions`,
        { questions: newQuestions },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      message.success("New questions added");
      navigate("/teacher-dashboard/edit-tests");
    } catch (err) {
      message.error("Failed to add questions");
    }
  };

  const onFinish = async (values) => {
    await handleTestUpdate(values);
    if (newQuestions.some((q) => q.text.trim() !== "")) {
      await handleAddQuestions();
    } else {
      navigate("/teacher-dashboard/edit-tests");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...newQuestions];
    if (field === "text" || field === "correctAnswer") {
      updated[index][field] = value;
    } else {
      updated[index].options[field] = value;
    }
    setNewQuestions(updated);
  };

  const addNewQuestionBlock = () => {
    setNewQuestions([
      ...newQuestions,
      { text: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Title level={3}>Edit Test Details</Title>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea />
        </Form.Item>
        <Form.Item name="duration" label="Duration (in minutes)">
          <Input type="number" />
        </Form.Item>

        <Divider />

        <Title level={4}>Existing Questions</Title>
        {existingQuestions.length === 0 ? (
          <Text>No questions yet</Text>
        ) : (
          existingQuestions.map((q, i) => (
            <div key={q._id} style={{ marginBottom: "16px" }}>
              <Text strong>{`Q${i + 1}: ${q.text}`}</Text>
              <ul>
                {q.options.map((opt, j) => (
                  <li key={j}>
                    {String.fromCharCode(65 + j)}. {opt}
                    {j === q.correctAnswer && (
                      <Text type="success"> (Correct)</Text>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        <Divider />

        <Title level={4}>Add New Questions</Title>
        {newQuestions.map((q, i) => (
          <div
            key={i}
            style={{ marginBottom: "24px", padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
          >
            <Form.Item label={`Question ${i + 1}`}>
              <Input
                value={q.text}
                onChange={(e) =>
                  handleQuestionChange(i, "text", e.target.value)
                }
              />
            </Form.Item>
            {q.options.map((opt, j) => (
              <Form.Item key={j} label={`Option ${String.fromCharCode(65 + j)}`}>
                <Input
                  value={opt}
                  onChange={(e) =>
                    handleQuestionChange(i, j, e.target.value)
                  }
                />
              </Form.Item>
            ))}
            <Form.Item label="Correct Answer (Index 0–3)">
              <Input
                type="number"
                min={0}
                max={3}
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(i, "correctAnswer", parseInt(e.target.value))
                }
              />
            </Form.Item>
          </div>
        ))}
        <Button onClick={addNewQuestionBlock} style={{ marginBottom: "16px" }}>
          Add Another Question
        </Button>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default EditTestForm;
