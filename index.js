
const getParentElements = (element) => {
  if (!element || (element.nodeType !== 1)) return undefined;
  const result = [];
  let parent = element;
  for (let i = 0; i < 999; i += 1) {
    if (parent) {
      parent = parent.parentElement;
      if (parent && (parent.nodeType === 1)) {
        result.push(parent);
      }
    } else {
      break;
    }
  }
  return result;
};

const defaultMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getMonths = (yearNumber) => {
  // 用一个数组表示某一年的12月每月有多少天
  if (!Number.isSafeInteger(yearNumber)) throw new TypeError('param should be a year number, and type is integer');
  const months = defaultMonths;
  const isLeapYear = (yearNumber % 4 === 0);
  if (isLeapYear) months[1] = 29;
  return months;
};

const getDaysCount = (year, month) => {
  // 获得某一个月的天数
  if (!Number.isSafeInteger(year)) throw new TypeError('param year should be a Integer of year');
  if (!Number.isSafeInteger(month)) throw new TypeError('param month should be a Integer of month');
  const months = getMonths(year);
  const count = months[month];
  return count;
};

const getWeekArray = (date) => {
  // 用数组形式表示一周，从周一开始 [30, 1, 2, 3, 4, 5, 6]
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  const daysCount = getDaysCount(date.getFullYear(), date.getMonth());
  const prevMonthObj = { year: date.getFullYear(), month: (date.getMonth() - 1) };
  if (prevMonthObj.month < 0) {
    prevMonthObj.year -= 1;
    prevMonthObj.month = 11;
  }
  const prevMonthDaysCount = getDaysCount(prevMonthObj.year, prevMonthObj.month);
  const start = date.getDate() - date.getDay();
  const week = [];
  for (let i = 0; i < 7; i += 1) {
    let dateNum = start + i;
    if (dateNum > daysCount) {
      dateNum -= daysCount;
    } else if (dateNum < 1) {
      dateNum += prevMonthDaysCount;
    }
    week.push(dateNum);
  }
  return week;
};

const getMonthArray = (date) => {
  // 用数组形式表示一个月 [[30, 1, 2, 3, 4, 5, 6],[7,8,9,10,11,12,13], ...]
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysCount = getDaysCount(year, month);
  const array = [];
  const thisWeek = getWeekArray(date);
  array.push(thisWeek);
  for (let i = 0; i < 5; i += 1) {
    const prevSaturdayDate = (date.getDate() - date.getDay()) - 1 - (i * 7);
    if (prevSaturdayDate > 0) {
      const prevSaturday = new Date(date.getFullYear(), date.getMonth(), prevSaturdayDate);
      const prevWeek = getWeekArray(prevSaturday);
      array.unshift(prevWeek);
    }
    const nextSundayDate = (date.getDate() - date.getDay()) + 7 + (i * 7);
    if (nextSundayDate <= daysCount) {
      const nextSunday = new Date(date.getFullYear(), date.getMonth(), nextSundayDate);
      const nextWeek = getWeekArray(nextSunday);
      array.push(nextWeek);
    }
  }
  return array;
};

const initDatepicker = () => {
  const today = new Date();
  const datepicker = document.querySelector('#datepicker');
  const picker = document.querySelector('#picker');
  const year = document.querySelector('#year');
  const month = document.querySelector('#month');
  year.innerText = today.getFullYear();
  month.innerText = today.getMonth() + 1;
};

const fillDayPickerByDate = (date) => {
  // 根据日期填充选择器的日期
  if (!(date instanceof Date)) throw new TypeError('param date should be a instance of Date');
  const daypicker = document.querySelector('#daypicker');
  const monthArray = getMonthArray(date);
  const trs = daypicker.querySelectorAll('tr');
  document.querySelector('#year').innerText = date.getFullYear();
  document.querySelector('#month').innerText = (date.getMonth() + 1);
  if (monthArray.length === 5) {
    monthArray.push(['', '', '', '', '', '', '']);
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
        if (Number(day) < 7) {
          tdItem.classList.add('next-month');
        } else {
          tdItem.classList.remove('next-month');
        }
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initDatepicker();
  const today = new Date();
  let currentDate = today;
  let pickerDate = today;
  const currentPicker = {
    year: today.getFullYear(), month: today.getMonth(), day: today.getDate(),
  };
  const input = document.querySelector('#input');
  const datepicker = document.querySelector('#datepicker');
  const picker = document.querySelector('#picker');
  const prevYear = document.querySelector('#prev-year');
  const nextYear = document.querySelector('#next-year');
  const prevMonth = document.querySelector('#prev-month');
  const nextMonth = document.querySelector('#next-month');
  const year = document.querySelector('#year').innerText;
  const month = document.querySelector('#month').innerText;
  const daypicker = document.querySelector('#daypicker');
  const daypickerItems = daypicker.querySelectorAll('td');
  prevYear.addEventListener('click', () => {
    if ((currentPicker.year < 1) || (currentPicker.year > 9998)) return false;
    currentPicker.year -= 1;
    const currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
    return 1;
  });
  nextYear.addEventListener('click', () => {
    if ((currentPicker.year < 1) || (currentPicker.year > 9998)) return false;
    currentPicker.year += 1;
    const currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
    return 1;
  });
  prevMonth.addEventListener('click', () => {
    currentPicker.day = 1;
    currentPicker.month -= 1;
    if (currentPicker.month < 0) {
      currentPicker.year -= 1;
      currentPicker.month = 11;
    }
    const currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
  });
  nextMonth.addEventListener('click', () => {
    currentPicker.day = 1;
    currentPicker.month += 1;
    if (currentPicker.month > 11) {
      currentPicker.year += 1;
      currentPicker.month = 0;
    }
    const currentPickerDate = new Date(currentPicker.year, currentPicker.month, currentPicker.day);
    fillDayPickerByDate(currentPickerDate);
  });
  daypickerItems.forEach((item) => {
    item.addEventListener('click', () => {
      const day = item.innerText;
      const value = `${year}-${month}-${day}`;
      input.value = value;
      daypickerItems.forEach(td => td.setAttribute('id', ''));
      item.setAttribute('id', 'current-picker');
    });
  });
  input.addEventListener('mousedown', (event) => {
    event.stopPropagation();
    datepicker.classList.remove('hide');
    const topSpace = window.scrollY - input.offsetTop;
    const bottomSpace = window.innerHeight - input.offsetHeight - topSpace;
    if ((bottomSpace < datepicker.offsetHeight) && (topSpace >= datepicker.offsetHeight)) {
      datepicker.style.top = '0px';
      datepicker.style.bottom = `${(bottomSpace - datepicker.offsetHeight)}px`;
    } else {
      datepicker.style.top = `${(topSpace - datepicker.offsetHeight)}px`;
      datepicker.style.bottom = '0px';
    }
  });
  document.body.addEventListener('mousedown', (e) => {
    const touchElement = e.target;
    const parents = getParentElements(touchElement);
    let isTouchingDatepicker = false;
    parents.forEach((parent) => {
      if (datepicker.isSameNode(parent)) {
        isTouchingDatepicker = true;
      }
    });
    if (!isTouchingDatepicker) {
      datepicker.classList.add('hide');
    }
  });
  fillDayPickerByDate(today);
});
