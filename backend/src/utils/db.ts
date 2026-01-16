import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'speech_training',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Create professionals table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS professionals (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create topics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS topics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        professional VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (professional) REFERENCES professionals(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Insert default professionals if they don't exist
    await connection.execute(`
      INSERT IGNORE INTO professionals (id, name, description) VALUES
      ('computer', '计算机科学与技术', '计算机科学与技术专业复试演讲题目'),
      ('medicine', '医学', '医学专业复试演讲题目'),
      ('economy', '经济学', '经济学专业复试演讲题目'),
      ('education', '教育学', '教育学专业复试演讲题目'),
      ('literature', '文学', '文学专业复试演讲题目');
    `);

    // Insert default topics if they don't exist
    await connection.execute(`
      INSERT IGNORE INTO topics (content, professional) VALUES
      ('请谈谈你对人工智能发展的看法', 'computer'),
      ('如何看待计算机科学与其他学科的交叉融合', 'computer'),
      ('你认为未来五年计算机技术的发展趋势是什么', 'computer'),
      ('请介绍一下你的毕业设计', 'computer'),
      ('如何解决软件开发中的技术难题', 'computer'),
      ('请谈谈你对大数据时代的理解', 'computer'),
      ('你认为计算机专业学生最重要的能力是什么', 'computer'),
      ('如何看待算法在现代社会中的作用', 'computer'),
      ('请介绍一下你最熟悉的编程语言及其应用场景', 'computer'),
      ('你对网络安全有什么认识', 'computer'),
      ('请谈谈你对医学伦理的理解', 'medicine'),
      ('如何看待人工智能在医学领域的应用', 'medicine'),
      ('请介绍一下你对某一医学领域的研究兴趣', 'medicine'),
      ('如何处理医患关系', 'medicine'),
      ('你认为现代医学面临的最大挑战是什么', 'medicine'),
      ('请谈谈你对循证医学的认识', 'medicine'),
      ('如何看待医学教育的改革', 'medicine'),
      ('你对公共卫生有什么认识', 'medicine'),
      ('请介绍一下你最感兴趣的医学研究方向', 'medicine'),
      ('如何看待精准医疗的发展前景', 'medicine'),
      ('请谈谈你对宏观经济学的理解', 'economy'),
      ('如何看待当前全球经济形势', 'economy'),
      ('你认为中国经济发展的新动能是什么', 'economy'),
      ('请介绍一下你对某一经济学理论的认识', 'economy'),
      ('如何看待数字经济的发展', 'economy'),
      ('你对乡村振兴战略有什么认识', 'economy'),
      ('请谈谈你对金融风险的理解', 'economy'),
      ('如何看待国际贸易中的保护主义', 'economy'),
      ('你认为经济学家的社会责任是什么', 'economy'),
      ('请介绍一下你最感兴趣的经济学研究方向', 'economy'),
      ('请谈谈你对教育本质的理解', 'education'),
      ('如何看待素质教育与应试教育的关系', 'education'),
      ('你认为教师应该具备哪些素质', 'education'),
      ('请介绍一下你对某一教育理论的认识', 'education'),
      ('如何看待教育公平问题', 'education'),
      ('你对新时代教育改革有什么建议', 'education'),
      ('请谈谈你对终身教育的理解', 'education'),
      ('如何利用现代技术促进教育发展', 'education'),
      ('你认为教育研究的重要性是什么', 'education'),
      ('请介绍一下你最感兴趣的教育研究方向', 'education'),
      ('请谈谈你对文学经典的理解', 'literature'),
      ('如何看待网络文学的发展', 'literature'),
      ('你认为文学的社会功能是什么', 'literature'),
      ('请介绍一下你对某一文学流派的认识', 'literature'),
      ('如何看待中西方文学的差异与融合', 'literature'),
      ('你对新时代文学创作有什么建议', 'literature'),
      ('请谈谈你对文学批评的理解', 'literature'),
      ('如何看待文学与其他艺术形式的关系', 'literature'),
      ('你认为文学研究的方法有哪些', 'literature'),
      ('请介绍一下你最感兴趣的文学研究方向', 'literature');
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export {
  pool,
  testConnection,
  initializeDatabase
};