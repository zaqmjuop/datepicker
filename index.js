
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
  const start = (date.getDate() - date.getDay()) + 1;
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
  for (let i = 1; i < 6; i += 1) {
    const pastDayNumber = date.getDate() - (i * 7);
    if ((pastDayNumber > 0) && (pastDayNumber <= daysCount)) {
      const pastDate = new Date(year, month, pastDayNumber);
      const pastWeek = getWeekArray(pastDate);
      array.unshift(pastWeek);
    }
    const futureDayNumber = date.getDate() + (i * 7);
    if ((futureDayNumber > 0) && (futureDayNumber <= daysCount)) {
      const futureDate = new Date(year, month, futureDayNumber);
      const futureWeek = getWeekArray(futureDate);
      array.push(futureWeek);
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
  monthArray.forEach((weekArray, weekIndex) => {
    const trItem = trs[weekIndex];
    const tds = trItem.querySelectorAll('td');
    weekArray.forEach((day, dayIndex) => {
      const tdItem = tds[dayIndex];
      tdItem.innerText = day;
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
  const prevMonth = document.querySelector('#prev-month');
  const nextMonth = document.querySelector('#next-month');
  const year = document.querySelector('#year').innerText;
  const month = document.querySelector('#month').innerText;
  const daypicker = document.querySelector('#daypicker');
  const daypickerItems = daypicker.querySelectorAll('td');
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
    });
  });
  const log = getWeekArray(new Date(2016, 0, 1));
  // console.log(log);
  fillDayPickerByDate(today);
});
