const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const authRoutes = require('../controllers/authController');
const destinationRoutes = require('../controllers/destinationController');
const adminRoutes = require('../controllers/adminController');

app.use('/api', authRoutes);
app.use('/api', destinationRoutes);
app.use('/api', adminRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(port, () => {
  console.log(`Server chạy trên cổng ${port}`);
});