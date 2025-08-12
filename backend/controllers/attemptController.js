const Test = require('../models/Test');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');

// Get available tests for student
exports.getStudentTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .select('-questions -createdBy')
      .sort({ createdAt: -1 });

    // Check which tests student has already attempted
    const attempts = await Attempt.find({ student: req.userId });
    const attemptedTestIds = attempts.map(a => a.test.toString());

    const testsWithAttemptStatus = tests.map(test => ({
      ...test.toObject(),
      attempted: attemptedTestIds.includes(test._id.toString())
    }));

    res.json(testsWithAttemptStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Start test attempt
exports.startAttempt = async (req, res) => {
  try {
    const { testId } = req.body;
    const test = await Test.findById(testId).populate('questions');

    if (!test) throw new Error('Test not found');

    const existingAttempt = await Attempt.findOne({
      test: testId,
      student: req.userId
    });

    if (existingAttempt) throw new Error('You have already attempted this test');

    const attempt = await Attempt.create({
      test: testId,
      student: req.userId,
      startedAt: new Date()
    });

    const questions = test.questions.map(q => ({
      id: q._id,
      text: q.text,
      options: q.options
    }));

    res.json({
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      expiresAt: new Date(attempt.startedAt.getTime() + test.duration * 60000),
      questions
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Submit test answers
exports.submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate({
        path: 'test',
        populate: { path: 'questions' }
      });

    if (!attempt) throw new Error('Attempt not found');
    if (attempt.student.toString() !== req.userId) throw new Error('Not authorized');
    if (attempt.completedAt) throw new Error('Attempt already submitted');

  
    const questionMap = {};
    attempt.test.questions.forEach(q => {
      questionMap[q._id.toString()] = q;
    });



    let score = 0;
    const detailedResults = answers.map(answer => {
      const question = questionMap[answer.questionId.toString()];
      if (!question) throw new Error(`Question ${answer.questionId} not found`);

      const isCorrect = question.correctAnswer === answer.selectedOption;
      if (isCorrect) score += 1;


      return {
        questionId: question._id,
        text: question.text,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer.selectedOption,
        isCorrect
      };
    });

    attempt.answers = answers.map(ans => ({
  question: ans.questionId,
  selectedOption: ans.selectedOption
}));
    attempt.score = score;
    attempt.total = attempt.test.questions.length;
    attempt.completedAt = new Date();
    
    await attempt.save();
    console.log(attempt)

    res.json({
      score,
      total: attempt.total,
      correctAnswers: score,
      totalQuestions: attempt.total,
      percentage: Math.round((score / attempt.total) * 100),
      detailedResults
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};