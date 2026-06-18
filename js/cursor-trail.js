// 自定义圆点光标与柔和长拖尾模块，支持速度感应拉伸
(function () {
  'use strict';

  // 触屏设备无精确指针，直接退出
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // 拖尾点总数
  var TRAIL_COUNT = 32;

  // 程序化生成递减的拖尾尺寸、透明度与跟随速度
  var TRAIL_SIZES  = [];
  var TRAIL_ALPHA  = [];
  var TRAIL_LERPS  = [];
  for (var k = 0; k < TRAIL_COUNT; k++) {
    var p = k / (TRAIL_COUNT - 1);
    TRAIL_SIZES[k] = +(7 * Math.pow(1 - p, 1.4) + 1.2).toFixed(2);
    TRAIL_ALPHA[k] = +(0.55 * Math.pow(1 - p, 1.7) + 0.02).toFixed(3);
    TRAIL_LERPS[k] = +(0.50 * Math.pow(1 - p, 1.2) + 0.10).toFixed(4);
  }

  // 创建主光标点DOM并初始隐藏到画布外
  var mainDot = document.createElement('div');
  mainDot.className = 'cursor-main';
  mainDot.style.transform = 'translate(-1000px, -1000px) translate(-50%, -50%)';
  mainDot.style.opacity = '0';
  document.body.appendChild(mainDot);

  // 创建拖尾点DOM，设置逐级递减的尺寸、透明度和模糊光晕
  var trails = [];
  for (var i = 0; i < TRAIL_COUNT; i++) {
    var el = document.createElement('div');
    el.className = 'cursor-trail';
    var size = TRAIL_SIZES[i];
    el.style.width  = size + 'px';
    el.style.height = size + 'px';
    el.style.background = 'rgba(13,148,136,' + TRAIL_ALPHA[i] + ')';
    el.style.boxShadow = '0 0 ' + (size + 3) + 'px rgba(13,148,136,' + (TRAIL_ALPHA[i] * 0.5) + ')';
    el.style.filter = 'blur(' + (i * 0.12) + 'px)';
    el.style.transform = 'translate(-1000px, -1000px) translate(-50%, -50%)';
    el.style.opacity = '0';
    document.body.appendChild(el);
    trails.push({ el: el, x: -1000, y: -1000 });
  }

  // 光标位置与速度追踪状态变量
  var mouseX = -1000;
  var mouseY = -1000;
  var active = false;
  var lastX = mouseX;
  var lastY = mouseY;
  var smoothSpeed = 0;

  // 鼠标移动时主点零帧跟随，同时检测链接悬停态
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    mainDot.style.transform =
      'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%, -50%)';
    mainDot.style.opacity = '1';

    // 首次激活时将所有拖尾点瞬移到当前鼠标位置
    if (!active) {
      active = true;
      for (var i = 0; i < trails.length; i++) {
        trails[i].x = mouseX;
        trails[i].y = mouseY;
      }
      lastX = mouseX;
      lastY = mouseY;
      smoothSpeed = 0;
    }

    // 检测鼠标是否悬浮在可交互元素上，切换光标样式
    var target = e.target;
    var isLink = target.closest('a, button, .btn, input, textarea, select, [role="button"]');
    document.body.classList.toggle('cursor-on-link', !!isLink);
  });

  // 鼠标离开视窗时停用光标
  document.documentElement.addEventListener('mouseleave', function () {
    active = false;
    smoothSpeed = 0;
  });
  // 鼠标重新进入视窗时激活光标
  document.documentElement.addEventListener('mouseenter', function () {
    active = true;
    smoothSpeed = 0;
  });

  // 拖尾动画循环，温和速度感应拉伸追鼠标位置
  function animate() {
    if (active) {
      // 瞬时速度指数平滑避免抖动
      var dx = mouseX - lastX;
      var dy = mouseY - lastY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      smoothSpeed += (speed - smoothSpeed) * 0.22;
      lastX = mouseX;
      lastY = mouseY;

      // 拉伸因子温和封顶，快速移动时拖尾拉长但不脱节
      var stretch = Math.min(smoothSpeed / 18, 2.2);

      for (var i = 0; i < trails.length; i++) {
        var t = trails[i];
        var effectiveLerp = TRAIL_LERPS[i] / (1 + stretch * 0.45);
        t.x += (mouseX - t.x) * effectiveLerp;
        t.y += (mouseY - t.y) * effectiveLerp;
        t.el.style.transform =
          'translate(' + t.x + 'px,' + t.y + 'px) translate(-50%, -50%)';
        t.el.style.opacity = '1';
      }
    } else {
      // 非活跃态隐藏主点与所有拖尾点
      mainDot.style.opacity = '0';
      for (var j = 0; j < trails.length; j++) {
        trails[j].el.style.opacity = '0';
      }
    }
    requestAnimationFrame(animate);
  }

  // 页面加载完成后启动动画循环
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animate);
  } else {
    animate();
  }
})();
