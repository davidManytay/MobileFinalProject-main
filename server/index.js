require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { pool, initializeDatabase } = require('./database');
const OpenAI = require('openai'); // Import OpenAI library

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Lesson Plan Generator Backend is running!');
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ success: true, message: 'Database connection successful!', result: rows[0].solution });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ success: false, message: 'Database connection failed.' });
  }
});

// Auth Routes
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, passwordHash]
    );

    res.status(201).json({ success: true, message: 'User registered successfully.', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already in use.' });
    }
    console.error('Registration failed:', error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      // In a real app, you'd generate and return a JWT here
      // For now, we return userId directly for simplicity (NOT SECURE FOR PRODUCTION)
      res.json({ success: true, message: 'Login successful!', userId: user.id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// Lesson Plan Generation and History Routes
app.post('/api/generate-plan', async (req, res) => {
  const { userId, grade, subject, topic } = req.body;

  if (!userId || !grade || !subject || !topic) {
    return res.status(400).json({ success: false, message: 'Missing required fields for plan generation.' });
  }

  try {
    const prompt = `Generate a detailed Daily Lesson Log (DLL) for a ${grade} grade class, covering the subject of ${subject}, with the main topic being "${topic}". The lesson plan should follow the Philippine Department of Education format, including:
- Objectives (Content Standard, Performance Standard, Learning Competencies)
- Content
- Learning Resources
- Procedures (Review, Motivation, Activity, Analysis, Abstraction, Application, Assessment, Assignment, Concluding Activity)
- Remarks
- Reflection

Ensure the output is a complete, ready-to-use lesson plan.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106", // Using the model identified in the initial analysis
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    const planContent = completion.choices[0].message.content;

    // Save to database
    await pool.query(
      'INSERT INTO lesson_plans (user_id, grade, subject, topic, plan_content) VALUES (?, ?, ?, ?, ?)',
      [userId, grade, subject, topic, planContent]
    );

    res.json({ success: true, plan: planContent });
  } catch (error) {
    console.error('Error generating or saving lesson plan:', error);
    res.status(500).json({ success: false, message: 'Failed to generate lesson plan.' });
  }
});

app.get('/api/plans/history', async (req, res) => {
  const { userId } = req.query; // Assuming userId is passed as a query parameter for now (NOT SECURE FOR PRODUCTION)

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, grade, subject, topic, created_at FROM lesson_plans WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, history: rows });
  } catch (error) {
    console.error('Error fetching lesson plan history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lesson plan history.' });
  }
});

app.get('/api/templates', (req, res) => {
  const templates = [
    {
      id: 1,
      name: "Basic Math Lesson (Grade 3)",
      grade: "3",
      subject: "Mathematics",
      topic: "Addition of Whole Numbers",
      description: "A foundational lesson plan for teaching basic addition concepts."
    },
    {
      id: 2,
      name: "Science Experiment (Grade 7)",
      grade: "7",
      subject: "Science",
      topic: "States of Matter",
      description: "An interactive lesson plan focusing on the three states of matter through experiments."
    },
    {
      id: 3,
      name: "English Literature (Grade 10)",
      grade: "10",
      subject: "English",
      topic: "Analyzing Literary Devices in Poetry",
      description: "A comprehensive plan for understanding and identifying literary devices in selected poems."
    },
  ];
  res.json({ success: true, templates });
});

app.get('/api/plans/:planId', async (req, res) => {
  const { planId } = req.params;
  // For security, you might want to also check userId here if passed from client
  // const { userId } = req.query;

  try {
    const [rows] = await pool.query(
      'SELECT plan_content, grade, subject, topic FROM lesson_plans WHERE id = ?',
      [planId]
    );
    const plan = rows[0];

    if (plan) {
      res.json({ success: true, plan });
    } else {
      res.status(404).json({ success: false, message: 'Lesson plan not found.' });
    }
  } catch (error) {
    console.error('Error fetching single lesson plan:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lesson plan.' });
  }
});


// Start Server
const startServer = async () => {
  await initializeDatabase();
  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server and DB pool');
    server.close(() => {
      pool.end();
      console.log('HTTP server and DB pool closed');
      process.exit(0);
    });
  });
};

startServer();
