const Test = require('../models/Test');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt'); 


// Create test with questions
exports.createTest = async (req, res) => {
  try {
    const { title, description, duration, scheduledAt, questions } = req.body;
    
    const test = await Test.create({
      title,
      description,
      duration,
      scheduledAt,
      createdBy: req.userId,
      status: 'draft'
    });

    
    const questionPromises = questions.map(q => 
      Question.create({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        test: test._id
      })
    );

    const createdQuestions = await Promise.all(questionPromises);
    test.questions = createdQuestions.map(q => q._id);
    await test.save();

    res.status(201).json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tests for teacher
exports.getTeacherTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate('questions')
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get test details
exports.getTestDetails = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId)
      .populate('questions')
      .populate('createdBy', 'name');

    if (!test) throw new Error('Test not found');
    
    res.json(test);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update test
exports.updateTest = async (req, res) => {
  try {
    const { title, description, status, duration } = req.body;

    const test = await Test.findById(req.params.testId);
    if (!test) throw new Error('Test not found');


    if (test.createdBy.toString() !== req.userId) {
      throw new Error('Not authorized');
    }


    if (title !== undefined) test.title = title;
    if (description !== undefined) test.description = description;
    if (status !== undefined) test.status = status;
    if (duration !== undefined) test.duration = duration;

    await test.save();
    res.json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete test
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) throw new Error('Test not found');
    if (test.createdBy.toString() !== req.userId) throw new Error('Not authorized');

    await Question.deleteMany({ test: test._id });
    await test.remove();
    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Publish/unpublish test
exports.publishTest = async (req, res) => {
  try {
    const { publish } = req.body;
    const test = await Test.findById(req.params.testId);

    if (!test) throw new Error('Test not found');
    if (test.createdBy.toString() !== req.userId) throw new Error('Not authorized');

    test.status = publish ? 'published' : 'draft';
    await test.save();

    res.json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTestResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) throw new Error('Test not found');

    const results = await Attempt.find({ test: test._id })
      .populate('student', 'name email rollNumber')
      .sort({ score: -1 });

    const analytics = {
      totalStudents: results.length,
      averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length || 0,
      highestScore: results[0]?.score || 0,
      lowestScore: results[results.length - 1]?.score || 0
    };

    res.json({
      test: {
        title: test.title,
        description: test.description,
        duration: test.duration
      },
      analytics,
      results
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Add more questions to a test
exports.addQuestionsToTest = async (req, res) => {
  try {
    const { questions } = req.body; 
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) throw new Error("Test not found");

    if (test.createdBy.toString() !== req.userId) {
      throw new Error("Not authorized");
    }

    const newQuestions = await Promise.all(
      questions.map(q =>
        Question.create({
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          test: test._id,
        })
      )
    );

    test.questions.push(...newQuestions.map(q => q._id));
    await test.save();

    res.json({
      message: "Questions added successfully",
      newQuestions,
      updatedTest: test
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
