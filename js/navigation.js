// 导航栏模块，含滚动毛玻璃切换、移动端菜单与当前页高亮
(function () {
  // 获取导航相关DOM元素引用
  var header = document.getElementById('siteHeader');
  var hamburger = document.getElementById('hamburger');
  var mobileOverlay = document.getElementById('mobileOverlay');
  var mobileClose = document.getElementById('mobileClose');

  // 滚动超过阈值时为导航栏添加毛玻璃效果
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 汉堡菜单点击打开移动端全屏遮罩
  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', function () {
      mobileOverlay.classList.add('open');
    });
  }

  // 移动端关闭按钮点击隐藏遮罩菜单
  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener('click', function () {
      mobileOverlay.classList.remove('open');
    });
  }

  // 移动端遮罩内导航链接点击后自动关闭菜单
  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileOverlay.classList.remove('open');
      });
    });
  }

  // 根据当前页面路径匹配并高亮对应导航链接
  var navLinks = document.querySelectorAll('.nav-links li a');
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
})();
