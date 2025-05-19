let token = null;
let userRole = null;
let intervals = [];
const apiUrl = 'http://localhost:3000/api';

function setAuthState(isAuthenticated, role) {
  console.log('setAuthState called:', { isAuthenticated, role });
  if (!isAuthenticated) {
    token = null;
  }
  userRole = role;
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const searchBar = document.getElementById('searchBar');
  const adminDashboard = document.getElementById('adminDashboard');

  if (loginButton) loginButton.style.display = isAuthenticated ? 'none' : 'inline';
  if (logoutButton) logoutButton.style.display = isAuthenticated ? 'inline' : 'none';
  if (searchBar) searchBar.style.display = isAuthenticated ? 'flex' : 'none';
  if (adminDashboard) {
    adminDashboard.style.display = (isAuthenticated && (role === 'admin' || role === 'superadmin')) ? 'block' : 'none';
    if (role === 'superadmin') {
      loadUserList(); // Chỉ superadmin load danh sách người dùng
    } else if (role === 'admin') {
      document.getElementById('userTableBody').innerHTML = ''; // Xóa danh sách cho admin
      document.querySelectorAll('#adminDashboard .admin-form:first-of-type').forEach(el => el.style.display = 'none'); // Ẩn phần quản lý vai trò
    }
  }

  if (!isAuthenticated) {
    clearResults();
  }
}

function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

// Login button
const loginButton = document.getElementById('loginButton');
if (loginButton) {
  loginButton.addEventListener('click', () => {
    console.log('Login button clicked');
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (authContainer) authContainer.style.display = 'block';
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
  });
}

// Show register form
const showRegister = document.getElementById('showRegister');
if (showRegister) {
  showRegister.addEventListener('click', () => {
    console.log('Show register clicked');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  });
}

// Show login form
const showLogin = document.getElementById('showLogin');
if (showLogin) {
  showLogin.addEventListener('click', () => {
    console.log('Show login clicked');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
  });
}

// Submit login
const submitLogin = document.getElementById('submitLogin');
if (submitLogin) {
  submitLogin.addEventListener('click', async () => {
    console.log('Submit login clicked');
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    if (!email || !password) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        token = data.token;
        userRole = data.role;
        setAuthState(true, data.role);
        document.getElementById('authContainer').style.display = 'none';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

// Send OTP
const sendOtpButton = document.getElementById('sendOtpButton');
if (sendOtpButton) {
  sendOtpButton.addEventListener('click', async () => {
    console.log('Send OTP clicked');
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm')?.value;
    if (!email || !password || !passwordConfirm) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== passwordConfirm) {
      alert('Mật khẩu nhập lại không khớp');
      return;
    }
    if (!isValidPassword(password)) {
      alert('Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa và 1 số');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Mã OTP đã được gửi đến email của bạn');
        document.getElementById('otpInput').style.display = 'block';
        document.getElementById('submitRegister').style.display = 'block';
        document.getElementById('sendOtpButton').style.display = 'none';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi gửi OTP:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

// Submit register
const submitRegister = document.getElementById('submitRegister');
if (submitRegister) {
  submitRegister.addEventListener('click', async () => {
    console.log('Submit register clicked');
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm')?.value;
    const otp = document.getElementById('otpInput')?.value;
    if (!email || !password || !passwordConfirm || !otp) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== passwordConfirm) {
      alert('Mật khẩu nhập lại không khớp');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công. Vui lòng đăng nhập.');
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

// Logout
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    console.log('Logout clicked');
    setAuthState(false, null);
  });
}

// Search
const searchButton = document.getElementById('searchButton');
if (searchButton) {
  searchButton.addEventListener('click', async () => {
    console.log('Search clicked');
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value.trim().toLowerCase();
    if (!searchTerm) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
    const resultContainer = document.getElementById('results');
    if (resultContainer) {
      resultContainer.innerHTML = '<div class="loading">Loading...</div>';
    }
    const homeSection = document.getElementById('homeSection');
    const searchResults = document.getElementById('searchResults');
    if (homeSection) homeSection.classList.add('split');
    if (searchResults) searchResults.classList.add('active');
    try {
      const response = await fetch(`${apiUrl}/destinations?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const destinations = await response.json();
      if (resultContainer) {
        resultContainer.innerHTML = '';
        if (destinations.length === 0) {
          resultContainer.innerHTML = '<p>Không tìm thấy kết quả cho từ khóa của bạn.</p>';
          return;
        }
        const uniqueDestinations = [];
        const seenNames = new Set();
        destinations.forEach(dest => {
          if (!seenNames.has(dest.name)) {
            seenNames.add(dest.name);
            uniqueDestinations.push(dest);
          }
        });
        uniqueDestinations.forEach(dest => {
          const div = document.createElement('div');
          div.className = 'recommendation-card';
          const timeId = dest.category === 'cities' && dest.timezone ? `time-${dest.name.replace(/[^a-zA-Z0-9]/g, '-')}` : null;
          const encodedDest = encodeURIComponent(JSON.stringify(dest));
          div.innerHTML = `
            <h3>${dest.name}</h3>
            <img src="${dest.image_url}?v=1" alt="${dest.name}">
            <p>${dest.description}</p>
            ${timeId ? `<p>Local Time: <span id="${timeId}"></span></p>` : ''}
            <button class="visit-button" data-dest="${encodedDest}">Visit</button>
          `;
          resultContainer.appendChild(div);
          if (timeId) {
            const updateTime = () => {
              const options = { timeZone: dest.timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
              const localTime = new Date().toLocaleTimeString('en-US', options);
              const timeElement = document.getElementById(timeId);
              if (timeElement) timeElement.textContent = localTime;
            };
            updateTime();
            intervals.push(setInterval(updateTime, 1000));
          }
        });

        // Thêm sự kiện cho nút Visit
        document.querySelectorAll('.visit-button').forEach(button => {
          button.addEventListener('click', (e) => {
            const encodedDest = e.target.getAttribute('data-dest');
            const dest = JSON.parse(decodeURIComponent(encodedDest));
            showDestinationModal(dest);
          });
        });
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
      if (resultContainer) resultContainer.innerHTML = '<p>Đã xảy ra lỗi khi tìm kiếm.</p>';
    }
  });
}

// Hàm hiển thị modal
function showDestinationModal(dest) {
  console.log('Destination data in modal:', dest); // Thêm dòng này
  const modal = document.getElementById('destinationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');
  const modalTime = document.getElementById('modalTime');
  const modalActivities = document.getElementById('modalActivities');
  const activityList = document.getElementById('activityList');
  const modalMap = document.getElementById('modalMap');
  const mapLink = document.getElementById('mapLink');

  modalTitle.textContent = dest.name;
  if (dest.image_url) {
    modalImage.src = dest.image_url;
    modalImage.style.display = 'block';
  } else {
    modalImage.style.display = 'none';
  }
  modalDescription.textContent = dest.detailed_description || dest.description || 'Không có mô tả chi tiết.';
  if (dest.timezone) {
    const updateModalTime = () => {
      const options = { timeZone: dest.timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const localTime = new Date().toLocaleTimeString('en-US', options);
      modalTime.textContent = `Thời gian địa phương: ${localTime}`;
    };
    updateModalTime();
    intervals.push(setInterval(updateModalTime, 1000));
    modalTime.style.display = 'block';
  } else {
    modalTime.style.display = 'none';
  }
  if (dest.activities && Array.isArray(dest.activities)) {
    activityList.innerHTML = dest.activities.map(activity => `<li>${activity}</li>`).join('');
    modalActivities.style.display = 'block';
  } else {
    modalActivities.style.display = 'none';
  }
  if (dest.latitude && dest.longitude) {
    const googleMapsUrl = `https://www.google.com/maps?q=${dest.latitude},${dest.longitude}`;
    mapLink.href = googleMapsUrl;
    mapLink.textContent = `Xem ${dest.name} trên Google Maps`;
    modalMap.style.display = 'block';
  } else {
    modalMap.style.display = 'none';
  }

  modal.style.display = 'flex';

  const closeModal = document.getElementById('closeModal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      intervals.forEach(interval => clearInterval(interval));
      intervals = [];
    }, { once: true });
  }
}

// Reset search
const resetButton = document.getElementById('resetButton');
if (resetButton) {
  resetButton.addEventListener('click', clearResults);
}

function clearResults() {
  console.log('Clear results called');
  const searchInput = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const homeSection = document.getElementById('homeSection');
  const searchResults = document.getElementById('searchResults');
  const backToTop = document.getElementById('backToTop');
  if (searchInput) searchInput.value = '';
  if (results) results.innerHTML = '';
  intervals.forEach(interval => clearInterval(interval));
  intervals = [];
  if (homeSection) homeSection.classList.remove('split');
  if (searchResults) searchResults.classList.remove('active');
  if (backToTop) backToTop.style.display = 'none';
}

// Submit destination
const submitDestination = document.getElementById('submitDestination');
if (submitDestination) {
  submitDestination.addEventListener('click', async () => {
    console.log('Submit destination clicked');
    const name = document.getElementById('destName')?.value;
    const description = document.getElementById('destDescription')?.value;
    const detailedDescription = document.getElementById('destDetailedDescription')?.value;
    const category = document.getElementById('destCategory')?.value;
    const timezone = document.getElementById('destTimezone')?.value;
    const activitiesInput = document.getElementById('destActivities')?.value;
    const image = document.getElementById('destImage')?.files[0];
    const latitude = document.getElementById('destLatitude')?.value;
    const longitude = document.getElementById('destLongitude')?.value;

    if (!name || !description || !category || !image || (category === 'cities' && !timezone) || !latitude || !longitude) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (Tên, Mô tả ngắn, Danh mục, Hình ảnh chính, Múi giờ nếu là Cities, Latitude, và Longitude)');
      return;
    }
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      alert('Bạn không có quyền thêm địa điểm.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (detailedDescription) formData.append('detailed_description', detailedDescription);
    formData.append('category', category);
    if (timezone) formData.append('timezone', timezone);
    if (activitiesInput) {
      const activities = activitiesInput.split(',').map(activity => activity.trim()).filter(activity => activity);
      formData.append('activities', JSON.stringify(activities));
    }
    formData.append('image', image);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);

    try {
      const response = await fetch(`${apiUrl}/destinations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        alert('Thêm địa điểm thành công');
        document.getElementById('destName').value = '';
        document.getElementById('destDescription').value = '';
        document.getElementById('destDetailedDescription').value = '';
        document.getElementById('destCategory').value = 'cities';
        document.getElementById('destTimezone').value = '';
        document.getElementById('destActivities').value = '';
        document.getElementById('destImage').value = '';
        document.getElementById('destLatitude').value = '';
        document.getElementById('destLongitude').value = '';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi thêm địa điểm:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

async function loadUserList() {
  console.log('Load user list called');
  if (userRole !== 'superadmin') {
    return; // Chỉ superadmin tải danh sách
  }
  try {
    const response = await fetch(`${apiUrl}/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const users = await response.json();
    if (response.ok) {
      const userTableBody = document.getElementById('userTableBody');
      if (userTableBody) {
        userTableBody.innerHTML = '';
        users.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
          `;
          userTableBody.appendChild(row);
        });
      }
    } else {
      alert(users.message);
    }
  } catch (error) {
    console.error('Lỗi tải danh sách người dùng:', error);
    alert('Đã xảy ra lỗi khi tải danh sách người dùng');
  }
}

// Submit role
const submitRole = document.getElementById('submitRole');
if (submitRole) {
  submitRole.addEventListener('click', async () => {
    console.log('Submit role clicked');
    if (userRole !== 'superadmin') {
      alert('Chỉ superadmin mới có quyền cập nhật vai trò.');
      return;
    }
    const userId = document.getElementById('userId')?.value;
    const role = document.getElementById('userRole')?.value;
    if (!userId || !role) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Cập nhật vai trò thành công');
        document.getElementById('userId').value = '';
        document.getElementById('userRole').value = 'user';
        loadUserList();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Lỗi cập nhật vai trò:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

// Scroll event for search results
const searchResults = document.getElementById('searchResults');
if (searchResults) {
  searchResults.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (searchResults.scrollTop > 100) {
      if (backToTop) backToTop.style.display = 'block';
    } else {
      if (backToTop) backToTop.style.display = 'none';
    }
  });
}

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) searchResults.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    console.log('Contact form submitted');
    e.preventDefault();
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    if (!name || !email || !message) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      alert('Cảm ơn bạn! Tin nhắn đã được gửi (chức năng này hiện chỉ mô phỏng).');
      document.getElementById('contactName').value = '';
      document.getElementById('contactEmail').value = '';
      document.getElementById('contactMessage').value = '';
    } catch (error) {
      console.error('Lỗi gửi liên hệ:', error);
      alert('Đã xảy ra lỗi');
    }
  });
}

// Initialize
try {
  setAuthState(false, null);
} catch (error) {
  console.error('Error initializing auth state:', error);
}