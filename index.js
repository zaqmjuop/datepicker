import toPicker from './src/element';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('#input');
  toPicker(input);
});

export default toPicker;
