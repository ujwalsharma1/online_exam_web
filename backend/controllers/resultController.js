const Attempt = require("../models/Attempt");
const Test = require("../models/Test");
const User = require("../models/User");

// Get student's results
exports.getStudentResults = async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.userId })
      .populate("test", "title description duration")
      .sort({ completedAt: -1 });

    const results = attempts.map((attempt) => ({
      attemptId: attempt._id,
      testId: attempt.test._id,
      title: attempt.test.title,
      score: attempt.score,
      total: attempt.total,
      attemptedAt: attempt.completedAt,
      percentage: Math.round((attempt.score / attempt.total) * 100),
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get test results for teacher
exports.getTestResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) throw new Error("Test not found");

    const attempts = await Attempt.find({ test: req.params.testId })
      .populate("student", "name rollNumber")
      .sort({ score: -1 });

    const totalStudents = await User.countDocuments({ role: "student" });
    const attemptedCount = attempts.length;
    const averageScore =
      attemptedCount > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attemptedCount
        : 0;

    const results = attempts.map((attempt) => ({
      studentId: attempt.student._id,
      studentName: attempt.student.name,
      rollNumber: attempt.student.rollNumber,
      score: attempt.score,
      total: attempt.total,
      percentage: Math.round((attempt.score / attempt.total) * 100),
      attemptedAt: attempt.completedAt,
    }));

    res.json({
      test: {
        title: test.title,
        averageScore,
        totalStudents,
        attemptedCount,
      },
      results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get detailed attempt result
exports.getDetailedResult = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate("test", "title description duration")
      .populate("student", "name rollNumber")
      .populate({
        path: "answers.question",
        select: "text options correctAnswer",
      });

    if (!attempt) throw new Error("Attempt not found");
    if (
      attempt.student._id.toString() !== req.userId &&
      attempt.test.createdBy.toString() !== req.userId
    ) {
      throw new Error("Not authorized");
    }

    const detailedResults = attempt.answers.map((answer) => ({
      questionId: answer.question._id,
      text: answer.question.text,
      correctAnswer: answer.question.correctAnswer,
      selectedAnswer: answer.selectedOption,
      isCorrect: answer.question.correctAnswer === answer.selectedOption,
    }));

    res.json({
      test: {
        title: attempt.test.title,
        description: attempt.test.description,
        duration: attempt.test.duration,
      },
      student: {
        name: attempt.student.name,
        rollNumber: attempt.student.rollNumber,
      },
      score: attempt.score,
      total: attempt.total,
      percentage: Math.round((attempt.score / attempt.total) * 100),
      detailedResults,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTestResults = async (req, res) => {
  try {
    const tests = await Test.find();

    const allResults = [];

    for (const test of tests) {
      const attempts = await Attempt.find({ test: test._id })
        .populate("student", "name rollNumber")
        .populate("answers.question") 
        .sort({ score: -1 });

      const totalStudents = await User.countDocuments({ role: "student" });

      const validAttempts = attempts.filter((a) => {
        if (!a.student) {
          console.warn(`⚠️ Skipping attempt ${a._id} — student is null`);
        }
        return a.student;
      });

      const averageScore =
        validAttempts.length > 0
          ? validAttempts.reduce((sum, a) => sum + a.score, 0) / validAttempts.length
          : 0;

      const testResults = validAttempts.map((attempt) => {
        const detailedAnswers = attempt.answers.map((ans) => ({
          question: ans.question.text,
          selectedOption: ans.selectedAnswer,
          correctOption: ans.question.correctAnswer,
          isCorrect: ans.selectedAnswer === ans.question.correctAnswer,
          marks: ans.selectedAnswer === ans.question.correctAnswer ? 1 : 0
        }));

        return {
          attemptId: attempt._id,
          studentId: attempt.student._id,
          studentName: attempt.student.name,
          rollNumber: attempt.student.rollNumber,
          score: attempt.score,
          total: attempt.total,
          percentage: Math.round((attempt.score / attempt.total) * 100),
          attemptedAt: attempt.completedAt,
          detailedAnswers // ✅ Added here
        };
      });

      allResults.push({
        testId: test._id,
        title: test.title,
        averageScore,
        totalStudents,
        attemptedCount: validAttempts.length,
        results: testResults,
      });
    }

    res.json(allResults);
  } catch (err) {
    console.error("❌ Error in getAllTestResults:", err);
    res.status(500).json({ message: err.message });
  }
};
