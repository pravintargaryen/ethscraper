d3.csv("data/incoming.csv", function(error, data) {
  makeGraph(processData(data, "Incoming Ether"), "#inc-plot");
});

d3.csv("data/outgoing.csv", function(error, data) {
  makeGraph(processData(data, "Outgoing Ether"), "#out-plot");
});

d3.csv("data/address.csv", function(error, data) {
  makeGraph(processData(data, "New Addresses"), "#address-plot");
});

$(function() {
  $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
    window.dispatchEvent(new Event('resize'));
  });
});

const makeGraph = (data, id) => {
  nv.addGraph(function() {
    let chart = nv.models.linePlusBarChart()
        .margin({bottom: 80, left: 60, right: 60})
        .focusEnable(false)
        .x(function(d,i) {return new Date(d[0])})
        .y(function(d,i) {return d[1]});

    //chart.useInteractiveGuideline(true);
    chart.xAxis.tickFormat(function(d) {
      return d3.time.format('%d %b')(new Date(d))
    }).showMaxMin(false);
    chart.xAxis.rotateLabels(-45);
    chart.y1Axis.tickFormat(d3.format(',f')).showMaxMin(false);
    chart.y2Axis.tickFormat(d3.format(',f')).showMaxMin(false);
    chart.bars.forceY([0]);

    let chartData = d3.select(id)
      .append("svg")
      .datum(data)
      .transition()
      .duration(0)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
}

const processData = (rows, title) => {
  let bar_data = [], line_data = [];
  for(let i = 0; i < rows.length; i++) {
    let row = rows[i];
    bar_data.push([row["date"], parseFloat(row["value"])]);
    line_data.push([row["date"], parseFloat(row["cumulative"])]);
  }
  return [{key: title, bar: true, values: bar_data, color: "#729fcf"}, {key: "Cumulative", values: line_data, color: "#3465a4"}];
}
