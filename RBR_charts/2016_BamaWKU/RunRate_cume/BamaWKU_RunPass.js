function runPass_charts(csv_url, team1, team2, height_adj) {

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

/* percentages (horizontal) grid */
var yScale = d3.scaleLinear()
  .domain([0,height_adj])
  .range([1,0])
function yPercent(y) {
  return yScale(y) * 100 + "%"
}
function yLabel(y) {
  return y.toFixed(2) * 100 + "%"
}

var gridPcAdjX = 4
var gridPcAdjY = 16
var grid_pc_arr = [.25,.5,.75]
grid_pc_arr.forEach(gridHz)

function gridHz(item) {
  d3.selectAll(".runPass-svg")
    .append("line")
    .attr("class","grid-white")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(item))
    .attr("y2",yPercent(item))
  d3.selectAll(".runPass-svg")
    .append("text")
    .text(yLabel(item))
    .attr("class","gridText")
    .attr("x",gridPcAdjX)
    .attr("y",yPercent(item))
    .attr("transform","translate(0," + gridPcAdjY + ")")
}
/* quarters (vertical) grid */
var teamFilter = runPassData.filter(function(d) { return d.Team == team1 })
var playNumMax = d3.max(teamFilter,function(d) { return +d.Play_num_team })
var xScale = d3.scaleLinear()
  .domain([1,playNumMax])
  .range([0,100])
function xPercent(x) {
  return xScale(x) + "%"
}
function playNumX(d,i) {
  return xPercent(d.Play_num_team)
}
var gridQtY = "97%"
var gridQtAdjX = 5
function quarterNameFn(name) {
  return quarterNames[name]
}
var quarterNames = {
    1:"1st",
    2:"2nd",
    3:"3rd",
    4:"4th",
}
gridVt()

function gridVt() {
  d3.selectAll(".runPass-svg")
    .selectAll("line")
    .data(teamFilter)
    .enter()
    .filter(function(d) { return d.New_q_team !== "" })
    .append("line")
    .attr("class","gridLine")
    .attr("x1",playNumX)
    .attr("x2",playNumX)
    .attr("y1",0)
    .attr("y2","100%")
  d3.selectAll(".runPass-svg")
    .selectAll("line")
    .data(teamFilter)
    .enter()
    .filter(function(d) { return d.New_q_team !== "" })
    .append("text")
    .text(function(d) { return quarterNameFn(+d.Quarter) })
    .attr("class","gridText")
    .attr("x",function(d) { return xPercent(d.Play_num_team) })
    .attr("transform","translate(" + gridQtAdjX + ",0)")
    .attr("y",gridQtY)
}
}
}
