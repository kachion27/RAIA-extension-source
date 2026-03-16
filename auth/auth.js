(function () {
  const logo = document.getElementById('logo');
  if (logo && typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    logo.src = chrome.runtime.getURL('icons/icon.png');
  }

  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const stepLoggedIn = document.getElementById('step-logged-in');
  const studentProfile = document.getElementById('student-profile');
  const studentLoading = document.getElementById('student-loading');
  const studentInfo = document.getElementById('student-info');
  const studentAvatar = document.getElementById('student-avatar');
  if (studentAvatar) studentAvatar.addEventListener('error', () => { studentAvatar.style.display = 'none'; });
  const studentName = document.getElementById('student-name');
  const studentEmail = document.getElementById('student-email');
  const studentPhone = document.getElementById('student-phone');
  const studentStatus = document.getElementById('student-status');
  const btnLogout = document.getElementById('btn-logout');
  const formEmail = document.getElementById('form-email');
  const formPassword = document.getElementById('form-password');
  const emailInput = document.getElementById('email');
  const emailHidden = document.getElementById('email-hidden');
  const passwordInput = document.getElementById('password');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const passwordHint = document.getElementById('password-hint');
  const btnContinue = document.getElementById('btn-continue');
  const btnLogin = document.getElementById('btn-login');
  const btnBack = document.getElementById('btn-back');

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
    el.hidden = !msg;
  }

  function showStep1() {
    step1.hidden = false;
    step2.hidden = true;
    if (stepLoggedIn) stepLoggedIn.hidden = true;
    showError(errorEmail, '');
    showError(errorPassword, '');
  }

  async function showLoggedIn() {
    step1.hidden = true;
    step2.hidden = true;
    if (stepLoggedIn) {
      stepLoggedIn.hidden = false;
      if (studentLoading) studentLoading.hidden = false;
      if (studentInfo) studentInfo.hidden = true;

      const { ok, status, data } = await RaiaAPI.me();
      if (studentLoading) studentLoading.hidden = true;

      if (status === 401) {
        await RaiaAPI.clearTokens();
        showStep1();
        return;
      }
      if (ok && data?.data) {
        const s = data.data;
        if (studentName) studentName.textContent = s.fullName || '-';
        if (studentEmail) studentEmail.textContent = s.email || '';
        if (studentPhone) {
          studentPhone.textContent = s.phone ? 'ĐT: ' + s.phone : '';
          studentPhone.hidden = !s.phone;
        }
        if (studentStatus) studentStatus.textContent = s.status === 'active' ? 'Đang hoạt động' : (s.status || '');
        if (studentAvatar && s.avatar) {
          const base = (typeof API_BASE !== 'undefined' && API_BASE) ? API_BASE.replace(/\/api\/v\d+.*$/, '') : '';
          studentAvatar.src = s.avatar.startsWith('http') ? s.avatar : (base + (s.avatar.startsWith('/') ? '' : '/') + s.avatar);
          studentAvatar.style.display = '';
        } else if (studentAvatar) studentAvatar.style.display = 'none';
        if (studentInfo) studentInfo.hidden = false;
      } else {
        if (studentName) studentName.textContent = RaiaAPI.getUserEmail() || 'Đã đăng nhập';
        if (studentEmail) studentEmail.textContent = '';
        if (studentInfo) studentInfo.hidden = false;
      }
    }
  }

  function showStep2(hint) {
    step1.hidden = true;
    step2.hidden = false;
    if (stepLoggedIn) stepLoggedIn.hidden = true;
    passwordHint.textContent = hint || 'Nhập mật khẩu';
    passwordInput.value = '';
    showError(errorPassword, '');
  }

  formEmail.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    showError(errorEmail, '');
    btnContinue.disabled = true;
    btnContinue.textContent = 'Đang kiểm tra...';

    const { ok, status, data } = await RaiaAPI.verifyEmail(email);

    btnContinue.disabled = false;
    btnContinue.textContent = 'Tiếp tục';

    if (status === 404 || (data?.errors?.email)) {
      showError(errorEmail, data?.errors?.email || 'Email chưa tồn tại trong hệ thống');
      return;
    }

    if (!ok || !data) {
      showError(errorEmail, data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      return;
    }

    const payload = data?.data || data;
    const hasPassword = payload?.hasPassword;
    if (hasPassword === undefined && payload?.exists === false) {
      showError(errorEmail, 'Email chưa tồn tại trong hệ thống');
      return;
    }

    emailHidden.value = email;
    showStep2(hasPassword === false ? 'Nhập mật khẩu đã gửi vào email' : 'Nhập mật khẩu');
  });

  formPassword.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = emailHidden.value;
    const password = passwordInput.value;
    if (!email || !password) return;

    showError(errorPassword, '');
    btnLogin.disabled = true;
    btnLogin.textContent = 'Đang đăng nhập...';

    const { ok, data } = await RaiaAPI.login(email, password);

    btnLogin.disabled = false;
    btnLogin.textContent = 'Đăng nhập';

    if (!ok) {
      const msg = data?.errors?.password || data?.errors?.email || data?.message || 'Đăng nhập thất bại.';
      showError(errorPassword, msg);
      return;
    }

    const { accessToken, refreshToken, expiresIn } = data?.data || data;
    if (accessToken) {
      await RaiaAPI.saveTokens(accessToken, refreshToken || '', expiresIn || 3600);
      RaiaAPI.setUserEmail(email);
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'AUTH_SUCCESS' }).catch(() => {});
      }
      showLoggedIn();
    } else {
      showError(errorPassword, 'Đăng nhập thất bại.');
    }
  });

  btnBack.addEventListener('click', function () {
    showStep1();
  });

  btnLogout.addEventListener('click', async function () {
    await RaiaAPI.clearTokens();
    showStep1();
  });

  if (RaiaAPI.isLoggedIn()) {
    showLoggedIn();
  } else {
    showStep1();
  }
})();
