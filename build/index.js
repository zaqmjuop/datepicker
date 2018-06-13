import toPicker from './datepicker';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#input');
  toPicker(input);
});

export default toPicker;
