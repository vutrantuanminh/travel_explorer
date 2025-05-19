const nodemailer = require('nodemailer');
require('dotenv').config();

class OTP {
  constructor() {
    this.otpStore = new Map();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  async generateAndSend(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(email, otp);
    setTimeout(() => this.otpStore.delete(email), 5 * 60 * 1000);

    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Mã OTP Xác Thực Đăng Ký Travel Explorer',
      text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
    });

    return otp;
  }

  verify(email, code) {
    return this.otpStore.get(email) === code;
  }
}

module.exports = new OTP();