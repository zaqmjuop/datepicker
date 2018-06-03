/* <div class="datepicker" id="datepicker">
  <table border="1" id="picker">
    <thead>
      <tr>
        <th id="prev-year">←</th>
        <th id="year" colspan="2"></th>
        <th id="next-year">→</th>
        <th id="prev-month">←</th>
        <th id="month"></th>
        <th id="next-month">→</th>
      </tr>
      <tr>
        <th>日</th>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
      </tr>
    </thead>
    <tbody id="daypicker">
      <tr class="week">
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr class="week">
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr class="week">
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>2</td>
      </tr>
      <tr class="week">
        <td>2</td>
        <td>2</td>
        <td>2</td>
        <td>2</td>
        <td>2</td>
        <td>2</td>
        <td>2</td>
      </tr>
      <tr class="week">
        <td>2</td>
        <td>2</td>
        <td>3</td>
        <td>3</td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
      </tr>
      <tr class="week">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div> */
const datepicker = document.createElement('DIV');
const table = document.createElement('TABLE');

const thead = document.createElement('THEAD');

table.setAttribute('border', 1);
const theadTop = 'qwe' + 'ddd';
