const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const os = require('os');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost', // або IP-адреса сервера
  user: 'root',      // ваш користувач MySQL
  password: 'root',  // ваш пароль
  database: 'app'    // назва вашої бази даних
});

db.connect(err => {
  if (err) {
    console.error('Помилка підключення до MySQL:', err);
  } else {
    console.log('Підключено до MySQL');
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Усі поля є обов’язковими!');
  }

  // Хешування пароля перед вставкою в базу
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Помилка вставки в MySQL:', err);
      return res.status(500).send('Помилка сервера');
    }
    res.status(200).send('Користувач зареєстрований');
  });
});


const secretKey = 'test'; // Таємний ключ для генерації токену

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Будь ласка, введіть email і пароль');
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Помилка при виборці користувача:', err);
      return res.status(500).send('Помилка сервера');
    }

    if (results.length === 0) {
      return res.status(400).send('Невірний email або пароль');
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send('Невірний email або пароль');
    }

    // Створення токену
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: '1d' // Термін дії токену
    });

    res.status(200).send({ token });
  });
});


app.get('/user', (req, res) => {
    // Отримуємо токен із заголовка Authorization
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Неавторизований запит');
    }
  
    const token = authHeader.split(' ')[1]; // Витягуємо токен з "Bearer <token>"
  
    // Верифікуємо токен
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('Помилка токену:', err);
        return res.status(401).send('Невірний або прострочений токен');
      }
  
      const userId = decoded.id;
  
      // Отримуємо дані користувача з бази даних за ID
      const query = 'SELECT id, name, email FROM users WHERE id = ?';
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Помилка при виборці користувача:', err);
          return res.status(500).send('Помилка сервера');
        }
  
        if (results.length === 0) {
          return res.status(404).send('Користувача не знайдено');
        }
  
        // Відправляємо дані користувача
        const user = results[0];
        res.status(200).json(user);
      });
    });
  });


function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (let interface in interfaces) {
    for (let details of interfaces[interface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'localhost';
}

const ipAddress = getIPAddress();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер працює на http://${ipAddress}:${PORT}`);
});
