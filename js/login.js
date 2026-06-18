// 登录表单校验与提交模块
(function () {
  // 创建自定义光标并添加到页面
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // 鼠标移动时实时更新光标位置
  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // 获取登录表单与字段元素引用
  var form = document.getElementById('loginForm');
  var usernameInput = document.getElementById('usernameInput');
  var passwordInput = document.getElementById('passwordInput');
  var usernameError = document.getElementById('usernameError');
  var passwordError = document.getElementById('passwordError');
  var submitBtn = document.getElementById('submitBtn');

  // 显示字段错误提示并标记错误样式
  function showError(input, errorEl, msg) {
    input.classList.add('error');
    errorEl.textContent = msg;
  }

  // 清除字段错误提示与错误样式
  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  // 用户名输入时实时校验最小长度
  usernameInput.addEventListener('input', function () {
    if (usernameInput.value.length >= 3) {
      clearError(usernameInput, usernameError);
    }
  });

  // 密码输入时实时校验最小长度
  passwordInput.addEventListener('input', function () {
    if (passwordInput.value.length >= 6) {
      clearError(passwordInput, passwordError);
    }
  });

  // 表单提交校验，通过后模拟登录并跳转首页
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    if (usernameInput.value.trim().length < 3) {
      showError(usernameInput, usernameError, '用户名至少需要 3 个字符');
      valid = false;
    } else {
      clearError(usernameInput, usernameError);
    }

    if (passwordInput.value.length < 6) {
      showError(passwordInput, passwordError, '密码至少需要 6 位');
      valid = false;
    } else {
      clearError(passwordInput, passwordError);
    }

    if (!valid) return;

    submitBtn.classList.add('loading');
    submitBtn.textContent = '登录中…';

    setTimeout(function () {
      sessionStorage.setItem('flood_loggedIn', '1');
      window.location.href = './index.html';
    }, 800);
  });
})();
