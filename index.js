import toPicker from './src/datepicker';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#input');
  toPicker(input);
});
