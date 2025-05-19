const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token không hợp lệ' });
    req.user = decoded;
    next();
  });
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Chỉ super admin mới có quyền truy cập' });
  }
  next();
};

router.get('/users', authenticate, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.put('/users/:id/role', authenticate, isSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Vai trò không hợp lệ' });
  }
  try {
    const user = await User.updateRole(id, role);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Cập nhật vai trò thành công', user });
  } catch (error) {
    console.error('Lỗi cập nhật vai trò:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;