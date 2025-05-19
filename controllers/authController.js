const express = require('express');
const router = express.Router();
const User = require('../models/user');
const OTP = require('../models/otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Thêm dòng này
require('dotenv').config();

const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email là bắt buộc' });

  const checkEmail = await User.findByEmail(email);
  if (checkEmail) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }

  try {
    await OTP.generateAndSend(email);
    res.json({ message: 'Mã OTP đã được gửi đến email của bạn' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).json({ message: 'Lỗi gửi email' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, otp } = req.body;
  if (!email || !password || !otp) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số' });
  }

  if (!OTP.verify(email, otp)) {
    return res.status(400).json({ message: 'Mã OTP không hợp lệ' });
  }

  try {
    await User.create(email, password);
    OTP.otpStore.delete(email);
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
});

module.exports = router;