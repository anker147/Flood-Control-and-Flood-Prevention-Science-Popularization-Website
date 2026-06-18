// 自定义光标、拖尾、粒子画布与滚动渐显动画模块
(function () {
  // 创建自定义光标元素并添加到页面
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  // 创建光标拖尾点，尺寸与透明度逐级递减
  var trails = [];
  var trailCount = 6;
  for (var i = 0; i < trailCount; i++) {
    var t = document.createElement('div');
    t.className = 'cursor-trail';
    var size = 10 - i * 1.2;
    t.style.cssText = 'width:' + size + 'px;height:' + size + 'px;background:rgba(13,148,136,' + (0.5 - i * 0.07) + ')';
    document.body.appendChild(t);
    trails.push({ el: t, x: 0, y: 0 });
  }

  // 鼠标移动时实时更新光标主点位置
  var mx = 0, my = 0;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // 拖尾动画循环，各点以递减延迟跟随鼠标
  (function animTrail() {
    var prev = { x: mx, y: my };
    trails.forEach(function (tr, i) {
      var delay = 0.15 + i * 0.08;
      tr.x += (prev.x - tr.x) * (1 - delay);
      tr.y += (prev.y - tr.y) * (1 - delay);
      tr.el.style.left = tr.x + 'px';
      tr.el.style.top = tr.y + 'px';
      prev = { x: tr.x, y: tr.y };
    });
    requestAnimationFrame(animTrail);
  })();

  // 获取Hero区域粒子画布并初始化上下文
  var heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    var ctx = heroCanvas.getContext('2d');
    var particles = [];

    // 画布尺寸自适应窗口大小
    function resizeCanvas() {
      heroCanvas.width = heroCanvas.offsetWidth;
      heroCanvas.height = heroCanvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 生成随机飘浮粒子，分配色调和相位
    for (var j = 0; j < 45; j++) {
      particles.push({
        x: Math.random() * heroCanvas.width,
        y: Math.random() * heroCanvas.height,
        r: 1.5 + Math.random() * 3.5,
        opacity: 0.08 + Math.random() * 0.22,
        speed: 0.3 + Math.random() * 0.6,
        hue: Math.random() > 0.5 ? '13,148,136' : '96,165,250',
        phase: Math.random() * Math.PI * 2
      });
    }

    // 粒子上升动画循环，超出画布顶部的粒子回到底部
    function drawParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(function (p) {
        p.y -= p.speed;
        p.x += Math.sin(p.y / 90 + p.phase) * 0.35;
        p.phase += 0.008;
        if (p.y < -10) {
          p.y = heroCanvas.height + 10;
          p.x = Math.random() * heroCanvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.hue + ',' + p.opacity + ')';
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

  // 滚动进入视口时触发渐显动画
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // 为交错动画组内子元素设置递增延迟
  var staggerGroups = document.querySelectorAll('.stagger-group');
  staggerGroups.forEach(function (group) {
    var children = group.querySelectorAll('.reveal');
    children.forEach(function (child, idx) {
      child.style.transitionDelay = (idx * 0.12) + 's';
    });
  });
})();
