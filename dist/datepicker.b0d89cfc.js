// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {

var defaultMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var getMonths = function getMonths(yearNumber) {
  // 用一个数组表示某一年的12月每月有多少天
  if (!Number.isSafeInteger(yearNumber)) throw new TypeError('param should be a year number, and type is integer');
  var months = defaultMonths;
  var isLeapYear = yearNumber % 4 === 0;
  if (isLeapYear) months[1] = 29;
  return months;
};

var getDaysCount = function getDaysCount(year, month) {
  // 获得某一个月的天数
  if (!Number.isSafeInteger(year)) throw new TypeError('param year should be a Integer of year');
  if (!Number.isSafeInteger(month)) throw new TypeError('param month should be a Integer of month');
  var months = getMonths(year);
  var count = months[month];
  return count;
};

var getWeekArray = function getWeekArray(date) {
  // 用数组形式表示一周，从周一开始 [30, 1, 2, 3, 4, 5, 6]
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  var daysCount = getDaysCount(date.getFullYear(), date.getMonth());
  var prevMonthObj = { year: date.getFullYear(), month: date.getMonth() - 1 };
  if (prevMonthObj.month < 0) {
    prevMonthObj.year -= 1;
    prevMonthObj.month = 11;
  }
  var prevMonthDaysCount = getDaysCount(prevMonthObj.year, prevMonthObj.month);
  var start = date.getDate() - date.getDay() + 1;
  var week = [];
  for (var i = 0; i < 7; i += 1) {
    var dateNum = start + i;

    if (dateNum > daysCount) {
      dateNum -= daysCount;
    } else if (dateNum < 1) {
      dateNum += prevMonthDaysCount;
    }
    week.push(dateNum);
  }
  return week;
};

var getMonthArray = function getMonthArray(date) {
  // 用数组形式表示一个月 [[30, 1, 2, 3, 4, 5, 6],[7,8,9,10,11,12,13], ...]
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  var year = date.getFullYear();
  var month = date.getMonth();
  var daysCount = getDaysCount(year, month);
  var array = [];
  var thisWeek = getWeekArray(date);
  array.push(thisWeek);
  for (var i = 1; i < 6; i += 1) {
    var pastDayNumber = date.getDate() - i * 7;
    if (pastDayNumber > 0 && pastDayNumber <= daysCount) {
      var pastDate = new Date(year, month, pastDayNumber);
      var pastWeek = getWeekArray(pastDate);
      array.unshift(pastWeek);
    }
    var futureDayNumber = date.getDate() + i * 7;
    if (futureDayNumber > 0 && futureDayNumber <= daysCount) {
      var futureDate = new Date(year, month, futureDayNumber);
      var futureWeek = getWeekArray(futureDate);
      array.push(futureWeek);
    }
  }
  return array;
};

var initDatepicker = function initDatepicker() {
  var today = new Date();
  var datepicker = document.querySelector('#datepicker');
  var picker = document.querySelector('#picker');
  var year = document.querySelector('#year');
  var month = document.querySelector('#month');
  year.innerText = today.getFullYear();
  month.innerText = today.getMonth() + 1;
};

var fillDayPickerByDate = function fillDayPickerByDate(date) {
  // 根据日期填充选择器的日期
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  var daypicker = document.querySelector('#daypicker');
  var monthArray = getMonthArray(date);
  var trs = daypicker.querySelectorAll('tr');
  document.querySelector('#year').innerText = date.getFullYear();
  document.querySelector('#month').innerText = date.getMonth() + 1;
  monthArray.forEach(function (weekArray, weekIndex) {
    var trItem = trs[weekIndex];
    var tds = trItem.querySelectorAll('td');
    weekArray.forEach(function (day, dayIndex) {
      var tdItem = tds[dayIndex];
      tdItem.innerText = day;
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  initDatepicker();
  var today = new Date();
  var currentDate = today;
  var pickerDate = today;
  var currentPicker = {
    year: today.getFullYear(), month: today.getMonth(), day: today.getDate()
  };
  var input = document.querySelector('#input');
  var datepicker = document.querySelector('#datepicker');
  var picker = document.querySelector('#picker');
  var prevMonth = document.querySelector('#prev-month');
  var nextMonth = document.querySelector('#next-month');
  var year = document.querySelector('#year').innerText;
  var month = document.querySelector('#month').innerText;
  var daypicker = document.querySelector('#daypicker');
  var daypickerItems = daypicker.querySelectorAll('td');
  prevMonth.addEventListener('click', function () {
    currentPicker.day = 1;
    currentPicker.month -= 1;
    if (currentPicker.month < 0) {
      currentPicker.year -= 1;
      currentPicker.month = 11;
    }
    var currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
  });
  nextMonth.addEventListener('click', function () {
    currentPicker.day = 1;
    currentPicker.month += 1;
    if (currentPicker.month > 11) {
      currentPicker.year += 1;
      currentPicker.month = 0;
    }
    var currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
  });
  daypickerItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var day = item.innerText;
      var value = year + '-' + month + '-' + day;
      input.value = value;
    });
  });
  var log = getWeekArray(new Date(2016, 0, 1));
  // console.log(log);
  fillDayPickerByDate(today);
});
},{}],23:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '45679' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[23,3], null)
//# sourceMappingURL=/datepicker.b0d89cfc.map