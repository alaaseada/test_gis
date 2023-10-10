// Grab the elements that contain data
var summarizing_option_form;
var result_table;
var report_window;

function instForm(tableName, formName) {
  summarizing_option_form = document.getElementById(formName);
  result_table = document.getElementById(tableName);
  var selected_filters = [].filter
    .call(
      summarizing_option_form.querySelectorAll('input[type=checkbox]'),
      (elem) => elem.checked
    )
    .map((elem) => elem.value.trim());
  if (selected_filters.length > 2) {
    alert('Sorry! You can combine only 2 filters for now.');
    return;
  }
  if (report_window) report_window.close();
  report_window = window.open('', '_blank');
  summarize_Table(tableName, selected_filters);
}

// Summarizing the table -> calculate totals
function summarize_Table(tableId, selected_filters) {
  // Get table Headers
  var tableHeaders = Array.prototype.map.call(
    document.querySelectorAll(`#${tableId} thead tr th.header-name`),
    (th) => th.innerHTML.trim()
  );

  // Calculate Summaries
  var tableInfo = Array.prototype.map.call(
    document.querySelectorAll(
      `#${tableId} tbody tr[style="visibility: visible"]`
    ),
    (tr) => {
      return Array.prototype.map.call(
        tr.querySelectorAll('td:not(.HiddenCol)'),
        (td) => {
          return td.innerHTML.trim();
        }
      );
    }
  );
  // Get the targeted column
  const summary_cols = tableInfo.map((row) => {
    if (selected_filters.length > 1) {
      const columns = selected_filters.map((criteria) => {
        let index_of_criteria =
          tableId === 'DataSrchDataDiv'
            ? tableHeaders.indexOf(criteria) + 1
            : tableHeaders.indexOf(criteria);
        return row[index_of_criteria];
      });
      return columns;
    } else {
      let index_of_filter =
        tableId === 'DataSrchDataDiv'
          ? tableHeaders.indexOf(selected_filters[0]) + 1
          : tableHeaders.indexOf(selected_filters[0]);
      return row[index_of_filter];
    }
  });

  let totals = {};

  // Aggregate 2 filters
  if (selected_filters.length === 2) {
    const root_distinct_values = Array.from(
      new Set(summary_cols.map((item) => item[0].trim()))
    ).filter((elem) => elem !== '');
    const child_distinct_values = Array.from(
      new Set(summary_cols.map((item) => item[1].trim()))
    ).filter((elem) => elem !== '');
    root_distinct_values.forEach((root_item) => {
      totals[root_item] = child_distinct_values.map((child_item) => {
        const total = summary_cols.reduce((total, current_item) => {
          if (current_item[0] === root_item && current_item[1] === child_item) {
            total += 1;
          }
          return total;
        }, 0);
        return { [child_item]: total };
      });
    });
    console.log(totals);
    // Calculate totals for 1 filter
  } else if (selected_filters.length === 1) {
    const distinct_values = Array.from(
      new Set(summary_cols.map((item) => item))
    ).filter((elem) => elem !== '');
    distinct_values.forEach((value) => {
      totals[value] = summary_cols.reduce((total, currentValue) => {
        if (currentValue === value) {
          total += 1;
        }
        return total;
      }, 0);
    });
  }
  // ================Display=============
  report_window.document.write(`
    <html>
      <head>
        <title>Summary of result data</title>
        <link rel="stylesheet" href="css/index.css" />    
        <link rel="stylesheet" href="css/charts.css" />
`);

  var script = document.createElement('script');
  script.src = 'js/loader.js';
  report_window.document.write(script.outerHTML);
  report_window.document.write(
    `<script>google.charts.load('current',{'packages':['corechart', 'table', 'geochart']});</script>`
  );

  report_window.document.write(`</head>
      <body style="width: 100%;">
        <header>
          <h1>Statistics</h1>
          <div class='btn-container'>
      `);
  if (selected_filters.length === 1) {
    const fieldName = selected_filters[0];
    const title = 'Number of vessels based on ' + fieldName;
    report_window.document.write(`
          <button class='btn header-btn' id='draw-pie' onclick='drawPieChart("${title}", "${fieldName}",${JSON.stringify(
      totals
    )});'>Pie Chart</button>
          <button class='btn header-btn' id='draw-bar' onclick='drawBarChart("${title}","${fieldName}",${JSON.stringify(
      totals
    )});'>Bar Chart</button>
          <button class='btn header-btn' id='draw-column' onclick='drawColumnChart("${title}","${fieldName}",${JSON.stringify(
      totals
    )});'>Column Chart</button>
    `);
    if (selected_filters[0] === 'Country Flag') {
      report_window.document.write(`
          <button class='btn header-btn' id='draw-geo-chart' onclick='drawGeoChart("${title}", "${fieldName}",${JSON.stringify(
        totals
      )});'>Geo Chart</button>`);
    }
  } else {
    const heading = selected_filters[0];
    const title =
      'Number of vessels based on ' +
      heading +
      ' and grouped by ' +
      selected_filters[1];
    report_window.document.write(`
     <button class='btn header-btn' id='draw-combo' onclick='drawComboVisualization("${title}", "${heading}",${JSON.stringify(
      totals
    )});'>Combo Chart</button>
    `);
  }

  report_window.document.write(`
          </div>
        </header>
        <main>
          <section>
            <div id="chartContainer" style="width: 100%;"></div>
            <div id="tableContainer"></div>
          </section>
        </main>`);

  var script = document.createElement('script');
  script.src = 'js/utils.js';
  report_window.document.write(script.outerHTML);

  report_window.document.write(`
        </body>
        </html>`);
}
