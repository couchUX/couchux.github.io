function runPass_charts(csv_url, team_1, team_2, height_adj) {

var team1 = team_1
var team2 = team_2

get_runPass_data(csv_url)

function get_runPass_data(url) {
  d3.csv(url, csv_response)
}
function csv_response(error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    runPassData = data
    render_runPass_charts()
  }
}

function render_runPass_charts() {

/* scontainers and backgrounds */
var rateSvg = d3.select("#runPass-rate-chart")
  .append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
    .append("rect")
    .attr("class","runPass-bg")
var srSvg = d3.select("#runPass-sr-chart")
  .append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
    .append("rect")
    .attr("class","runPass-bg")

/* grid */
var teamFilter = runPassData.filter(function(d,i) { return d.Team = team1 })
var runRateMax = d3.max(teamFilter,function(d,i) { return +d.RunRate_cume })
var runSrMax = d3.max(teamFilter,function(d,i) { return +d.SR_run_cume })
var passSrMax = d3.max(teamFilter,function(d,i) { return +d.SR_pass_cume })
var heightMax = Math.max(runRateMax,runSrMax,passSrMax)

var yScale = d3.scaleLinear().domain([0,height_adj]).range([1,0])
function yPercent(y) {
  return yScale(y).toFixed(2) * 100 + "%"
}
function yLabel(y) {
  return y.toFixed(2) * 100 + "%"
}

var gridTxtAdjX = 4
var gridTxtAdjY = 16

var grid_hz_arr = [.25,.5,.75]
grid_hz_arr.forEach(gridHz)

function gridHz(item) {
  d3.selectAll(".runPass-svg").append("line")
    .attr("class","grid-hz")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(item))
    .attr("y2",yPercent(item))
  d3.selectAll(".runPass-svg").append("text")
    .text(yLabel(item))
    .attr("class","gridText")
    .attr("x",gridTxtAdjX)
    .attr("y",yPercent(item))
    .attr("transform","translate(0," + gridTxtAdjY + ")")
}

}
}
