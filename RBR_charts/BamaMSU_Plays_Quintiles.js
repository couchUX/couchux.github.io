/* select what csv should be run */
var csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU_Plays_Quintiles.csv"

/* run the whole chart function */

srxrqChart(csv_url, "Alabama", "1");
srxrqChart(csv_url, "Michigan State", "2");

/* tie chart colors to team names */
var teamColors = {
  "Alabama": "#C31C45",
  "Michigan State": "#509E8B"
}

/* defining the main chart functions */
function playsChart(data_url, which_team, what_order) {
  d3.csv(data_url, csv_response.bind(null, which_team).bind(null, what_order))
}

function csv_response(which_team, what_order, error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    playsData = data.filter(function(row){
      return row.Team == which_team  //try to Filter/reformat ("Transform") outside of data pull
    })
    render_chart(which_team, what_order)
  }
}

/* Some prep for building the d3 chart */
var containerWidth = document.getElementById("plays-charts-container").offsetWidth

function chartWidthFn(containerWidth) {
  if (containerWidth < 584) {
    return containerWidth
    }
  else {
    return containerWidth / 2 - 16 /* adjusting this from 8 for RBR tablet view */
    }
}
function render_chart(which_team, what_order) {

var playsChartName = "plays-chart"

function selectChartClass() {
  return "." + playsChartName + ".chart" + what_order
}
function defineChartClass() {
  return playsChartName + " chart" + what_order
}

var layout = {
  squareWidth: 16,
  sqMarginAdj: 1.1,
  yAdjust: 24,
}

var chartWidth = chartWidthFn(containerWidth)
    svgWidth = chartWidth
    sqWidthMulti = layout.squareWidth * layout.sqMarginAdj
    squareHeight = squareWidth
    maxIndex = d3.max(playsData, function(d,i) { return (i + 1) });
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    svgHeight = maxIndex * barHeightMulti + layout.yAdjust + layout.bottomLabelAdj

    teamColor = function(team_name) {
      return teamColors[team_name]
    }
    squareColor = function(d,i) {
        return teamColor(d.Team)
    }

/* actually building the chart in d3 */

var chart = d3.select("#plays-charts-container")
      .append("div")
      .attr("class",defineChartClass())

    svg = d3.select(selectChartClass())
      .append("svg")
      .attr("class","svgChart")
      .attr("width",chartWidth)
      .attr("height",svgHeight)


} //end of building chart in d3
