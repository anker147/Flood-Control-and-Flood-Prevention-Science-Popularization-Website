// 退出登录模块，含桌面端与移动端二次确认机制
(function () {
  'use strict';

  // 登录状态存储键名
  var STORAGE_KEY = 'flood_loggedIn';

  // 清除登录状态并跳转到登录页
  function doLogout() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    window.location.href = './login.html';
  }

  // 桌面端退出按钮，动态注入到紧急求助按钮之前
  var emergencyBtn = document.getElementById('emergencyBtn');
  var desktopBtn = null;
  var desktopConfirming = false;
  var desktopTimer = null;

  if (emergencyBtn && emergencyBtn.parentNode) {
    desktopBtn = document.createElement('button');
    desktopBtn.type = 'button';
    desktopBtn.className = 'nav-logout';
    desktopBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>' +
      '<polyline points="16 17 21 12 16 7"/>' +
      '<line x1="21" y1="12" x2="9" y2="12"/>' +
      '</svg>' +
      '<span class="nav-logout__text">退出登录</span>';

    // 将退出按钮与紧急求助一起放入右侧导航操作容器
    var actionsWrap = document.createElement('div');
    actionsWrap.className = 'nav-actions';
    emergencyBtn.parentNode.insertBefore(actionsWrap, emergencyBtn);
    actionsWrap.appendChild(desktopBtn);
    actionsWrap.appendChild(emergencyBtn);
  }

  // 桌面端退出按钮确认态超时自动复位
  function desktopReset() {
    desktopConfirming = false;
    if (desktopBtn) {
      desktopBtn.classList.remove('confirming');
      var t = desktopBtn.querySelector('.nav-logout__text');
      if (t) t.textContent = '退出登录';
    }
    if (desktopTimer) { clearTimeout(desktopTimer); desktopTimer = null; }
  }

  // 桌面端退出按钮点击，首次进入确认态，二次点击执行退出
  if (desktopBtn) {
    desktopBtn.addEventListener('click', function () {
      if (!desktopConfirming) {
        desktopConfirming = true;
        desktopBtn.classList.add('confirming');
        var t = desktopBtn.querySelector('.nav-logout__text');
        if (t) t.textContent = '确认退出？';
        desktopTimer = setTimeout(desktopReset, 3000);
        return;
      }
      doLogout();
    });
  }

  // 移动端退出按钮，动态注入到移动端紧急求助按钮之前
  var mobileEmergencyBtn = document.getElementById('mobileEmergencyBtn');
  var mobileBtn = null;
  var mobileConfirming = false;
  var mobileTimer = null;

  if (mobileEmergencyBtn && mobileEmergencyBtn.parentNode) {
    mobileBtn = document.createElement('button');
    mobileBtn.type = 'button';
    mobileBtn.className = 'mobile-logout';
    mobileBtn.textContent = '退出登录';
    mobileEmergencyBtn.parentNode.insertBefore(mobileBtn, mobileEmergencyBtn);
  }

  // 移动端退出按钮确认态超时自动复位
  function mobileReset() {
    mobileConfirming = false;
    if (mobileBtn) {
      mobileBtn.classList.remove('confirming');
      mobileBtn.textContent = '退出登录';
    }
    if (mobileTimer) { clearTimeout(mobileTimer); mobileTimer = null; }
  }

  // 移动端退出按钮点击，首次进入确认态，二次点击执行退出
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function () {
      if (!mobileConfirming) {
        mobileConfirming = true;
        mobileBtn.classList.add('confirming');
        mobileBtn.textContent = '确认退出？';
        mobileTimer = setTimeout(mobileReset, 3000);
        return;
      }
      doLogout();
    });
  }
})();
