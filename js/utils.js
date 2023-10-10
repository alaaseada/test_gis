const chart_container = document.querySelector('#chartContainer');
const table_container = document.querySelector('#tableContainer');

// Prepare a data table source
function prepareChartData(title, summary_col, totals) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', summary_col);
  data.addColumn('number', title);
  data.addRows(Object.entries(totals));
  return data;
}

function calculateAverage(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

// Prepare an arrayToDataTable object for combo chart
function prepareComboChartData(title, summary_col, totals) {
  const headers = [summary_col];
  const result = [];
  Object.keys(totals).map((item) => result.push([item])).filter((item) => item != 'empty');

  Object.values(totals)[0].map((item, index) => {
    headers.push(Object.keys(item)[0]);
  });
  Object.values(totals).map((item, index) => {
    item.map((val) => result[index].push(Object.values(val)[0]));
  });
  return google.visualization.arrayToDataTable([headers, ...result]);
}

// Draw a Pie chart
function drawPieChart(title, summary_col, totals) {
  const data = prepareChartData(title, summary_col, totals);
  var options = { 
  title: title,
  width: 1000,
  height: 'fit-content',
  legend: { position: 'top' , maxLines : 100},
  };
  var chart = new google.visualization.PieChart(chart_container);
  chart.draw(data, options);
  if (table_container.innerHTML === '') drawTableChart(data);
}

// Draw a bar chart
function drawBarChart(title, summary_col, totals) {
  const data = prepareChartData(title, summary_col, totals);
  var options = {
    title: title,
    width: 1000,
    height: 'fit-content',
  };
  var chart = new google.visualization.BarChart(chart_container);
  chart.draw(data, options);

  if (table_container.innerHTML === '') drawTableChart(data);
}

// Draw a column chart
function drawColumnChart(title, summary_col, totals) {
  const data = prepareChartData(title, summary_col, totals);
  const wrapper = new google.visualization.ChartWrapper({
    chartType: 'ColumnChart',
    dataTable: data,
    options: {
      title: title,
      width: 1000,
      height: 'fit-content',
    },
    containerId: 'chartContainer',
  });
  wrapper.draw();
  if (table_container.innerHTML === '') drawTableChart(data);
}

// Draw a combo chart
function drawComboVisualization(title, summary_col, totals) {
  const data = prepareComboChartData(title, summary_col, totals);
  const chart = new google.visualization.ComboChart(chart_container);
  const options = {
    title: title,
    vAxis: { title: 'Number of vessels' },
    hAxis: { title: summary_col },
    seriesType: 'bars',
  };
  chart.draw(data, options);
  if (table_container.innerHTML === '') drawTableChart(data);
}

// Draw a table chart
function drawTableChart(data) {
  const cssClassNames = {
    headerRow: 'darkgreen-bg large-font bold-font frozen-column',
    tableRow: '',
    oddTableRow: '',
    selectedTableRow: 'grey-background large-font',
    hoverTableRow: '',
    headerCell: 'gold-border',
    tableCell: '',
    rowNumberCell: '',
  };

  const options = {
    showRowNumber: true,
    allowHtml: true,
    cssClassNames: cssClassNames,
    width: '100vw',
    frozenColumns: 1,
    pageSize: 100,
  };

  const table = new google.visualization.Table(table_container);
  table.draw(data, options);
}

// Draw Geo chart
function drawGeoChart(title, summary_col, totals) {
  const data = prepareChartData(title, summary_col, totals);
  const chart = new google.visualization.GeoChart(chart_container);
  const options = {
    colorAxis: { colors: ['#00853f', 'black', '#e31b23'] },
    datalessRegionColor: '#f8bbd0',
    defaultColor: '#f5f5f5',
  };
  chart.draw(data, options);
}
