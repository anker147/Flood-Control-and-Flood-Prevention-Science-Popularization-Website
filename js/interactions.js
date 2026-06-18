// 页面交互模块，包含手风琴、视频播放、计数器与紧急求助弹窗
(function () {
  // 手风琴展开收起，点击时关闭其他项并根据内容高度展开
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var body = item.querySelector('.accordion-body');
    var inner = item.querySelector('.accordion-body__inner');

    if (!trigger || !body) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      accordionItems.forEach(function (other) {
        other.classList.remove('open');
        var b = other.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0px';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = inner.scrollHeight + 40 + 'px';
      }
    });
  });

  // 宣传视频点击遮罩播放，暂停或结束时恢复遮罩
  var videoEl = document.getElementById('promoVideo');
  var videoOverlay = document.getElementById('videoOverlay');

  if (videoEl && videoOverlay) {
    videoOverlay.addEventListener('click', function () {
      videoOverlay.classList.add('hidden');
      videoEl.play();
    });

    videoEl.addEventListener('pause', function () {
      videoOverlay.classList.remove('hidden');
    });

    videoEl.addEventListener('ended', function () {
      videoOverlay.classList.remove('hidden');
    });
  }

  // 统计数据数字滚动动画，进入视口后缓动递增到目标值
  var counters = document.querySelectorAll('.stat-card__num[data-target]');
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0;
      var duration = 1800;
      var startTime = null;

      // 缓动步进函数，使用三次方缓出曲线
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = (start + (target - start) * eased);
        el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });

  // 紧急求助弹窗相关DOM元素引用
  var emergencyModal = document.getElementById('emergencyModal');
  var emergencyBtn = document.getElementById('emergencyBtn');
  var emergencyClose = document.getElementById('emergencyClose');
  var mobileEmergencyBtn = document.getElementById('mobileEmergencyBtn');
  var emergencySearch = document.getElementById('emergencySearch');
  var emergencyContacts = document.getElementById('emergencyContacts');

  // 打开紧急求助弹窗并锁定页面滚动
  function openEmergencyModal() {
    if (emergencyModal) {
      emergencyModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // 关闭紧急求助弹窗并恢复页面滚动
  function closeEmergencyModal() {
    if (emergencyModal) {
      emergencyModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 桌面端紧急求助按钮绑定
  if (emergencyBtn) {
    emergencyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openEmergencyModal();
    });
  }

  // 移动端紧急求助按钮绑定，打开弹窗前关闭侧栏菜单
  if (mobileEmergencyBtn) {
    mobileEmergencyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openEmergencyModal();
      var mobileOverlay = document.getElementById('mobileOverlay');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
    });
  }

  // 弹窗关闭按钮绑定
  if (emergencyClose) {
    emergencyClose.addEventListener('click', closeEmergencyModal);
  }

  // 点击弹窗遮罩背景关闭
  if (emergencyModal) {
    emergencyModal.addEventListener('click', function (e) {
      if (e.target === emergencyModal) {
        closeEmergencyModal();
      }
    });
  }

  // 按下Escape键关闭弹窗
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && emergencyModal && emergencyModal.classList.contains('active')) {
      closeEmergencyModal();
    }
  });

  // 紧急联系方式搜索过滤，按地区和描述匹配
  if (emergencySearch && emergencyContacts) {
    emergencySearch.addEventListener('input', function () {
      var query = this.value.toLowerCase().trim();
      var groups = emergencyContacts.querySelectorAll('.emergency-contact__group');
      groups.forEach(function (group) {
        var items = group.querySelectorAll('.emergency-contact__item');
        var visibleCount = 0;
        items.forEach(function (item) {
          var region = item.getAttribute('data-region') || '';
          var desc = item.querySelector('.emergency-contact__desc');
          var descText = desc ? desc.textContent.toLowerCase() : '';
          if (region.toLowerCase().indexOf(query) !== -1 || descText.indexOf(query) !== -1) {
            item.style.display = 'flex';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        group.style.display = visibleCount > 0 ? 'grid' : 'none';
      });
    });
  }
})();
