import dom from './dom';
import CustomDate from './customDate';

let isbindTurnOff = 0;
let isWindowResize = 0;

const bindWindowResize = () => {
  if (isWindowResize) return false;
  isWindowResize += 1;
  const resizeBodyMinHeight = () => {
    const windowHeight = window.innerHeight;
    document.body.style.minHeight = `${windowHeight}px`;
  };
  window.addEventListener('resize', () => {
    resizeBodyMinHeight();
  });
  resizeBodyMinHeight();
  return isWindowResize;
};

const theadTop = () => {
  const result = dom.of('<tr>');
  const prevMonth = dom.of('<th>').text('◂').addClass('prev-month');
  const th = dom.of('<th>');
  const nextMonth = dom.of('<th>').text('▸').addClass('next-month');
  const month = dom.of('<th>').attr('colspan', 2).addClass('month');
  const input = dom.of('<input>').attr('type', 'number').addClass('year');
  const thInput = dom.of('<th>').attr('colspan', 2).append(input);
  const children = [prevMonth, th, thInput, month, nextMonth];
  children.forEach((child) => {
    result.append(child);
  });
  return result;
};

const theadBottom = () => {
  const result = dom.of('<tr>').addClass('week-sign');
  const weekDay = [
    dom.of('<th>').text('日').addClass('text-red'),
    dom.of('<th>').text('一'),
    dom.of('<th>').text('二'),
    dom.of('<th>').text('三'),
    dom.of('<th>').text('四'),
    dom.of('<th>').text('五'),
    dom.of('<th>').text('六').addClass('text-red'),
  ];
  weekDay.forEach((day) => {
    result.append(day);
  });
  return result;
};

const tdWeek = () => {
  const result = dom.of('<tr>').addClass('week');
  for (let i = 0; i < 7; i += 1) {
    const td = dom.of('<td>');
    result.append(td);
  }
  return result;
};

const pickerElement = () => {
  // html元素拼接结果
  const result = dom.of('<div>').addClass('datepicker hide');
  const table = dom.of('<table>').attr('border', 1).attr('cellspacing', 2);
  const thtop = theadTop();
  const thbottom = theadBottom();
  const thead = dom.of('<thead>').append(thtop).append(thbottom);
  const tbody = dom.of('<tbody>');
  for (let i = 0; i < 6; i += 1) {
    const week = tdWeek();
    tbody.append(week);
  }
  table.append(thead).append(tbody);
  result.append(table);
  return result.dom;
};

class Picker {
  constructor(input) {
    // 接受一个 <input type="text"> 元素
    if (!input || (input.nodeType !== 1) || (input.getAttribute('type') !== 'text')) throw new TypeError('参数应是一个input[type=text]');
    const now = new Date();
    this.input = input;
    this.body = pickerElement();
    this.current = CustomDate.of(now);
    document.body.appendChild(this.body);
    this.fillDayPickerByDate(this.current.toDate());
    this.bindEvent();
    return this;
  }
  fillDayPickerByDate(date) {
    // 根据日期填充选择器的日期
    if (!date || !(date instanceof Date)) throw new TypeError('参数应该是一个Date实例对象');
    this.current = CustomDate.of(date);
    const monthArray = CustomDate.getMonthArray(this.current.toDate());
    const tbody = this.body.querySelector('tbody');
    const trs = tbody.querySelectorAll('tr');
    this.body.querySelector('.year').value = date.getFullYear();
    this.body.querySelector('.month').innerText = (date.getMonth() + 1);
    if (monthArray.length === 5) {
      const next7th = new Date(date.getFullYear(), (date.getMonth() + 1), 6);
      const next1stWeek = CustomDate.getWeekArray(next7th);
      monthArray.push(next1stWeek);
    }
    monthArray.forEach((weekArray, weekIndex) => {
      const trItem = trs[weekIndex];
      const tds = trItem.querySelectorAll('td');
      weekArray.forEach((day, dayIndex) => {
        const tdItem = tds[dayIndex];
        tdItem.innerText = day;
        if (weekIndex === 0) {
          if (Number(day) > 7) {
            tdItem.classList.add('prev-month');
          } else {
            tdItem.classList.remove('prev-month');
          }
        } else if (weekIndex >= (monthArray.length - 2)) {
          if (Number(day) < 15) {
            tdItem.classList.add('next-month');
          } else {
            tdItem.classList.remove('next-month');
          }
        }
        if ((this.current.day === day) && (!tdItem.classList.contains('prev-month')) && (!tdItem.classList.contains('next-month'))) {
          const pastPikcer = this.body.querySelector('.current-picker');
          if (pastPikcer) pastPikcer.classList.remove('.current-picker');
          tdItem.classList.add('.current-picker');
        }
      });
    });
    return this;
  }
  fillDayPickerByCurrent() {
    // 根据this.current日期填充
    const byDate = this.current.toDate();
    this.fillDayPickerByDate(byDate);
    return this;
  }
  clearPicked() {
    // 清空被选择的
    const pastPicked = this.body.querySelectorAll('.current-picker');
    pastPicked.forEach((item) => {
      item.classList.remove('.current-picker');
    });
    return this;
  }
  bindMonthArrow() {
    const prevMonth = this.body.querySelector('.prev-month');
    const nextMonth = this.body.querySelector('.next-month');
    prevMonth.addEventListener('click', () => {
      // 左箭头事件 月份-1
      this.current.backOneMonth();
      this.fillDayPickerByCurrent();
    });
    nextMonth.addEventListener('click', () => {
      // 右箭头事件 月份+1
      this.current.aheadOneMonth();
      this.fillDayPickerByCurrent();
    });
    return this;
  }
  bindPickAction() {
    // 选择日期
    const thead = this.body.querySelector('thead');
    const tbody = this.body.querySelector('tbody');
    const daypickerItems = tbody.querySelectorAll('td');
    const yearInput = thead.querySelector('.year');
    const monthBoard = thead.querySelector('.month');
    const output = this.input;
    daypickerItems.forEach((item) => {
      item.addEventListener('click', () => {
        const pickValue = {
          year: Number(yearInput.value),
          month: Number(monthBoard.innerText) - 1,
          day: Number(item.innerText),
        };
        if (item.classList.contains('prev-month')) {
          pickValue.month -= 1;
          if (pickValue.month < 0) {
            pickValue.year -= 1;
            pickValue.month = 11;
          }
        } else if (item.classList.contains('next-month')) {
          pickValue.month += 1;
          if (pickValue.month > 11) {
            pickValue.year += 1;
            pickValue.month = 0;
          }
        }
        const pickDate = new Date(pickValue.year, pickValue.month, pickValue.day);
        this.current.reset(pickDate);
        this.clearPicked();
        output.value = `${this.current.year}-${this.current.month + 1}-${this.current.day}`;
        item.classList.add('current-picker');
        this.body.classList.add('hide');
      });
    });
    return this;
  }
  bindTurnOn() {
    // 点击输入框打开日期选择器
    this.input.addEventListener('mousedown', (event) => {
      event.stopPropagation();
      const datepickers = document.querySelectorAll('.datepicker');
      datepickers.forEach((picker) => {
        if (!this.body.isSameNode(picker)) picker.classList.add('hide');
      });
      dom.of(this.body).removeClass('arrow-top arrow-bottom reel hide'); // 先显示才有宽高
      const topSpace = this.input.offsetTop;
      const topSeen = topSpace - window.scrollY;
      const toSeenBottomHeight = window.scrollY + window.innerHeight;
      const toInputBottomHeight = this.input.offsetTop + this.input.offsetHeight;
      const bottomSeen = toSeenBottomHeight - toInputBottomHeight;
      const isBottomSeenEnough = bottomSeen > this.body.offsetHeight;
      const isTopSeenEnough = topSeen > this.body.offsetHeight;
      let top;
      if (!isBottomSeenEnough && isTopSeenEnough) {
        top = topSpace - this.body.offsetHeight;// 选择器在输入框上方
        dom.of(this.body).addClass('arrow-bottom');
      } else {
        top = topSpace + this.input.offsetHeight; // 选择器在输入框下方
        dom.of(this.body).addClass('arrow-top');
      }
      this.fillDayPickerByCurrent();
      dom.of(this.body).addClass('reel');
      this.body.style.top = `${top}px`;
    });
    return this;
  }
  bindTurnOff() {
    // 点击日期选择器或输入框以外的地方隐藏日期选择器
    if (isbindTurnOff) return false;
    isbindTurnOff += 1;
    document.body.addEventListener('mousedown', (e) => { // 最后记得调整body高度
      const touchElement = e.target;
      const datepickers = document.querySelectorAll('.datepicker');
      datepickers.forEach((picker) => {
        const isTouching = dom.of(touchElement).hasParent(picker);
        if (!isTouching) picker.classList.add('hide');
      });
    });
    return this;
  }
  bindYearInput() {
    // 年份输入框
    const year = this.body.querySelector('.year');
    const month = this.body.querySelector('.month');
    year.addEventListener('input', () => {
      const value = Number(year.value);
      if (!Number.isSafeInteger(value) || (value < 1900) || (value > 5000)) return false;
      const newDay = {
        year: value,
        month: (Number(month.innerText) - 1),
        day: 1,
      };
      const newDate = new Date(newDay.year, newDay.month, newDay.day);
      this.fillDayPickerByDate(newDate);
      return this;
    });
  }
  bindEvent() {
    bindWindowResize();
    this.bindMonthArrow();
    this.bindPickAction();
    this.bindTurnOn();
    this.bindTurnOff();
    this.bindYearInput();
  }
}

const toPicker = (input) => {
  const result = new Picker(input);
  return result;
};

export default toPicker;
