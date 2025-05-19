const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Chỉ admin hoặc superadmin mới có quyền truy cập' });
  }
  next();
};

router.get('/destinations', authenticate, async (req, res) => {
  const searchTerm = req.query.search || '';
  try {
    const destinations = await Destination.findAll(searchTerm);
    res.json(destinations);
  } catch (error) {
    console.error('Lỗi lấy địa điểm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.post('/destinations', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  const { name, description, detailed_description, category, timezone, activities, latitude, longitude } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !description || !category || !imageUrl || (category === 'cities' && !timezone) || !latitude || !longitude) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc (Tên, Mô tả ngắn, Danh mục, Hình ảnh chính, Múi giờ nếu là Cities, Latitude, và Longitude)' });
  }

  try {
    await Destination.create(name, description, detailed_description, imageUrl, category, timezone, activities, latitude, longitude);
    res.status(201).json({ message: 'Thêm địa điểm thành công' });
  } catch (error) {
    console.error('Lỗi thêm địa điểm:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;