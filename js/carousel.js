// 解决IE7、IE8兼容性问题
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) { // W3C标准
    elm.addEventListener(evType, fn, useCapture);
  } else if (elm.attachEvent) { // IE
    elm.attachEvent('on' + evType, fn);
  } else {
    elm['on' + evType] = fn;
  }
}

// 轮播图逻辑
var slides = document.querySelectorAll('.carousel img');
var currentIndex = 0;

// classList polyfill for IE
if (!("classList" in document.documentElement)) {
  Object.defineProperty(HTMLElement.prototype, 'classList', {
    get: function() {
      var self = this;
      function update(fn) {
        return function(value) {
          var classes = self.className.split(/\s+/g);
          var index = classes.indexOf(value);
          fn(classes, index, value);
          self.className = classes.join(" ");
        }
      }
      return {
        add: update(function(classes, index, value) {
          if (!~index) classes.push(value);
        }),
        remove: update(function(classes, index) {
          if (~index) classes.splice(index, 1);
        }),
        toggle: update(function(classes, index, value) {
          if (~index) classes.splice(index, 1);
          else classes.push(value);
        })
      };
    }
  });
}

function showSlide(index) {
  for (var i = 0; i < slides.length; i++) {
    slides[i].className = i === index ? 'active' : '';
  }
}

addEvent(document.getElementById('nextBtn'), 'click', function() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});

addEvent(document.getElementById('prevBtn'), 'click', function() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

// 自动播放（可选）
setInterval(function() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}, 3000);

// 获取横向滚动面板
var horizontalScrollPanel = document.querySelector('.horizontal-scroll-panel');

// 拖动状态标志
var isDragging = false;
var startX = 0;
var scrollStart = 0;

// 禁用选择函数
function disableSelection() {
  horizontalScrollPanel.style.userSelect = 'none';
  horizontalScrollPanel.style.webkitUserSelect = 'none';
  horizontalScrollPanel.style.msUserSelect = 'none'; // 添加IE支持
}

// 恢复选择函数
function restoreSelection() {
  horizontalScrollPanel.style.userSelect = '';
  horizontalScrollPanel.style.webkitUserSelect = '';
  horizontalScrollPanel.style.msUserSelect = '';
}

// 鼠标按下事件
addEvent(horizontalScrollPanel, 'mousedown', function(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  
  if (target.tagName === 'A' || target.tagName === 'IMG') {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  isDragging = true;
  startX = (e.pageX || e.clientX + document.documentElement.scrollLeft) - horizontalScrollPanel.offsetLeft;
  scrollStart = horizontalScrollPanel.scrollLeft;

  disableSelection();
  horizontalScrollPanel.style.cursor = 'move';
});

// 鼠标移动事件
addEvent(horizontalScrollPanel, 'mousemove', function(e) {
  if (!isDragging) return;
  e = e || window.event;
  
  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }

  var x = (e.pageX || e.clientX + document.documentElement.scrollLeft) - horizontalScrollPanel.offsetLeft;
  var walk = (x - startX) * 2;
  horizontalScrollPanel.scrollLeft = scrollStart - walk;

  document.documentElement.scrollLeft = horizontalScrollPanel.scrollLeft;
});

// 鼠标抬起事件
addEvent(horizontalScrollPanel, 'mouseup', function() {
  isDragging = false;
  restoreSelection();
  horizontalScrollPanel.style.cursor = 'auto';
});

// 鼠标离开事件
addEvent(horizontalScrollPanel, 'mouseleave', function() {
  isDragging = false;
  restoreSelection();
  horizontalScrollPanel.style.cursor = 'auto';
});

// 点击事件处理
addEvent(horizontalScrollPanel, 'click', function(e) {
  if (isDragging) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
});

// 添加Array.forEach polyfill
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}