import React, { useState } from 'react';
import { Form, Input, Button, message, DatePicker, TimePicker, Space, Card } from 'antd';
import axios from 'axios';
import moment from 'moment';
const apiBase = import.meta.env.VITE_API_BASE_URL;
const CreateTest = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const scheduledAt = moment(values.scheduledDate).set({
        hour: values.scheduledTime.hour(),
        minute: values.scheduledTime.minute()
      }).toISOString();

      const payload = {
        title: values.title,
        description: values.description,
        duration: values.duration,
        scheduledAt,
        questions
      };

      await axios.post(`${apiBase}/api/tests`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      message.success('Test created successfully');
      form.resetFields();
      setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input placeholder="Enter test title" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea placeholder="Optional test description" />
      </Form.Item>

      <Form.Item label="Duration (in minutes)" name="duration" rules={[{ required: true }]}>
        <Input type="number" placeholder="e.g. 60" />
      </Form.Item>

      <Space>
        <Form.Item label="Scheduled Date" name="scheduledDate" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Scheduled Time" name="scheduledTime" rules={[{ required: true }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
      </Space>

      <h3>Questions</h3>
      {questions.map((q, qIndex) => (
        <Card key={qIndex} style={{ marginBottom: 16 }} title={`Question ${qIndex + 1}`}>
          <Input
            placeholder="Question text"
            value={q.text}
            onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
            style={{ marginBottom: 8 }}
          />
          {q.options.map((opt, oIndex) => (
            <Input
              key={oIndex}
              placeholder={`Option ${oIndex + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
              style={{ marginBottom: 8 }}
            />
          ))}
          <Input
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
          />
        </Card>
      ))}

      <Button onClick={addQuestion} style={{ marginBottom: 16 }}>
        + Add Question
      </Button>

      <Button type="primary" htmlType="submit" loading={loading}>
        Create Test
      </Button>
    </Form>
  );
};

export default CreateTest;
