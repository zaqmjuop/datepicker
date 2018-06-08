import toPicker from './element';

document.addEventListener('DOMContentLoaded', () => {
  const input2 = document.querySelector('#input2');
  const input3 = document.querySelector('#input3');
  toPicker(input2);
  toPicker(input3);
});
