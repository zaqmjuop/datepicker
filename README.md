一个简单的时间选择器插件
[预览](https://zaqmjuop.github.io/datepicker/)

![face-preview](./src/readme.png)

### [下载](https://github.com/zaqmjuop/datepicker/releases/download/1.0.1/build.zip)

#### 引用文件
```html
<link rel="stylesheet" href="datepicker.css">
<script src="datepicker.js"></script>
```
#### 将一个文本输入框元素变成日期选择器
```html
<input type="text" value="选择时间" id="input">
<script>
  var input = document.querySelector('#input');
  window.datepicker(input);
</script>
```
#### ES6
```javascript
import datepicker from './datepicker.js';

const input = document.querySelector('#input');
datepicker(input);
```