const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage });

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'web_system'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// JWT密钥
const JWT_SECRET = 'your_jwt_secret_key';

// 用户注册
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ message: '请填写所有字段' });
    }
    
    // 检查用户名和邮箱是否已存在
    const [existingUser] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }
    
    // 密码哈希
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'member']
    );
    
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户登录
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ message: '请填写用户名和密码' });
    }
    
    // 查找用户
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    const user = users[0];
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 权限验证中间件
function checkRole(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: '未授权' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      
      // 获取用户角色
      pool.query('SELECT role FROM users WHERE id = ?', [decoded.userId])
        .then(([rows]) => {
          const userRole = rows[0]?.role;
          
          if (role === 'super_admin' && userRole !== 'super_admin') {
            return res.status(403).json({ message: '需要管理员权限' });
          }
          
          if (role === 'member' && userRole === 'guest') {
            return res.status(403).json({ message: '需要成员权限' });
          }
          
          next();
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: '服务器错误' });
        });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: '无效令牌' });
    }
  };
}

// 文件上传接口
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' });
  }
  
  res.json({
    message: '文件上传成功',
    filePath: req.file.path,
    filename: req.file.filename
  });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});