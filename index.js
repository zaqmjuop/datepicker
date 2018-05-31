
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
  const lastMonthDaysCount = getDaysCount(date.getFullYear(), (date.getMonth() - 1));
  const start = (date.getDate() - date.getDay()) + 1;
  const week = [];
  for (let i = 0; i < 7; i += 1) {
    let dateNum = start + i;
    if (dateNum > daysCount) {
      dateNum -= daysCount;
    } else if (dateNum < 1) {
      dateNum += lastMonthDaysCount;
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


document.addEventListener('DOMContentLoaded', () => {
  initDatepicker();
  const today = new Date();
  const input = document.querySelector('#input');
  const datepicker = document.querySelector('#datepicker');
  const picker = document.querySelector('#picker');
  const year = document.querySelector('#year').innerText;
  const month = document.querySelector('#month').innerText;
  const daypicker = document.querySelector('#daypicker');
  const daypickerItems = daypicker.querySelectorAll('td');
  daypickerItems.forEach((item) => {
    item.addEventListener('click', () => {
      const day = item.innerText;
      const value = `${year}-${month}-${day}`;
      input.value = value;
    });
  });
  const log = getMonthArray(new Date(2018, 4, 31));
  console.log(log);
});
