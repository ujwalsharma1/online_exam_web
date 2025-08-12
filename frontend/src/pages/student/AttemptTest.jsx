import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Card, Radio, Button, message, Progress } from 'antd';
import axios from 'axios';
const apiBase = import.meta.env.VITE_API_BASE_URL;
const AttemptTest = () => {
  const { state } = useLocation();
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const testData = state?.testData;

  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!testData) {
      message.error("No test data found.");
      return;
    }

    const expiry = new Date(testData.expiresAt).getTime();
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - new Date().getTime()) / 1000));
      setTimer(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        handleSubmit(); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testData]);

  const handleChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers)
        .filter(([questionId]) => questionId !== "undefined")
        .map(([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        }));

      console.log("Submitting attempt:", { attemptId, answers: formattedAnswers });
      console.log(testData)

      const res = await axios.post(
        `${apiBase}/api/attempts/${attemptId}/submit`,
        { answers: formattedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success('Test submitted successfully!');
      navigate('/student/results', { state: { result: res.data } });
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  if (!testData) return null;

  const totalTime =
    (new Date(testData.expiresAt) - new Date(testData.startedAt)) / 1000;

  return (
    <div style={{ padding: '24px' }}>
      <h2>Test in Progress</h2>

      <Progress
        percent={(timer / (totalTime || 1)) * 100}
        status={timer > 0 ? "active" : "exception"}
        format={() => `${Math.floor(timer / 60)}m ${timer % 60}s`}
        showInfo
      />

      {testData.questions.map((q, idx) => {
        if (!q.id) {
          console.warn(`Missing id in question at index ${idx}`, q);
          return null;
        }

        return (
          <Card
            key={q.id}
            title={`Q${idx + 1}: ${q.text}`}
            style={{ marginTop: 16 }}
          >
            <Radio.Group
              name={`question-${q.id}`} 
              onChange={(e) => handleChange(q.id, e.target.value)}
              value={answers[q.id]}
            >
              {q.options.map((opt, i) => (
                <Radio key={i} value={i}>
                  {opt}
                </Radio>
              ))}
            </Radio.Group>
          </Card>
        );
      })}

      <Button
        type="primary"
        onClick={handleSubmit}
        loading={submitting}
        style={{ marginTop: 24 }}
      >
        Submit Test
      </Button>
    </div>
  );
};

export default AttemptTest;
