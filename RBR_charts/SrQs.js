function srQs_charts(csv_url, team_1, team_class_1, team_2, team_class_2, container_id, league_sr) {

get_srQs_data(csv_url)

function get_srQs_data(url) {
  d3.csv(url, csv_response)
}
function csv_response(error, data) {
  if (error) {
    console.error(error)
  }
    console.log("data loaded")
    runPassData = data
    render_srQs_charts()
  }
}

function render_srQs_charts() {

/* set up team names */
function teamId_1(id_name) {
  return id_name + "-" + team_class_1
}
function teamId_2(id_name) {
  return id_name + "-" + team_class_2
}
function teamClass_1(class_name) {
  return class_name + " " + team_class_1
}
function teamClass_2(class_name) {
  return class_name + " " + team_class_2
}

/* svg backgrounds and subtitles */
var chartContainer = d3.select(container_id)
var chartMargin = chartContainer.style("margin-bottom","12px")
var srQsChartOne = chartContainer.append("div")
  .attr("class","srQs-Outer")
