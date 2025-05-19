const bcrypt = require('bcrypt');

const password = 'Cucthitmo@123'; // Mật khẩu bạn muốn dùng cho superadmin
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Lỗi mã hóa:', err);
    return;
  }
  console.log('Mật khẩu đã mã hóa:', hash);
});