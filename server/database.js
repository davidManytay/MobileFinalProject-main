const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'lesson_planner_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const createUsersTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table created or already exists.');
  } finally {
    connection.release();
  }
};

const createLessonPlansTable = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lesson_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        grade VARCHAR(255),
        subject VARCHAR(255),
        topic VARCHAR(255),
        plan_content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Lesson plans table created or already exists.');
  } finally {
    connection.release();
  }
};

const initializeDatabase = async () => {
  let connection;
  try {
    // Get a connection from the pool to ensure the database is reachable
    connection = await pool.getConnection();
    console.log('Database connection successful. Initializing tables...');
    await createUsersTable(connection);
    await createLessonPlansTable(connection);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit if database initialization fails
  } finally {
    if (connection) connection.release(); // Release the connection
  }
};

module.exports = { pool, initializeDatabase };
