function runPass_charts(csv_url, team, team_class, container_id, height_adj, league_sr) {

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

function teamId(id_name) {
  return id_name + "-" + team_class
}
function teamClass(class_name) {
  return class_name + " " + team_class
}
/* svg backgrounds and subtitles */
var chartContainer = d3.select(container_id)
var chartMargin = chartContainer.style("margin-bottom","12px")
var rateChart = chartContainer.append("div")
  .attr("id",teamId("runPass-rate-chart"))
  .attr("class",teamClass("runPass-rate-chart"))
var rateSub = rateChart.append("p")
  .attr("class","chartSubtitle")
  .html("<span class=\"suc\">&#9679;&nbsp;</span>Run rate (runs &#247; total plays), cumulative")
var rateSvg = rateChart.append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
var rateBg = rateSvg.append("rect")
  .attr("class","runPass-bg")
var srChart = chartContainer.append("div")
  .attr("id",teamId("runPass-sr-chart"))
  .attr("class",teamClass("runPass-sr-chart"))
var srSub = srChart.append("p")
  .attr("class","chartSubtitle")
  .html("Success rate for <span class=\"suc\">&#9679;&nbsp;</span>runs and <span class=\"un\">&#9679;&nbsp;</span>passes, cumulative")
var srSvg = srChart.append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
var srBg = srSvg.append("rect")
  .attr("class","runPass-bg")


/* quarters (vertical) grid */
var teamData = runPassData.filter(function(d) { return d.Team == team })
var playNumMax = d3.max(teamData,function(d) { return +d.Play_num_team })
var xScaleGrid = d3.scaleLinear()
  .domain([1,playNumMax])
  .range([0,100])
function xPercent(x) {
  return xScaleGrid(x) + "%"
}
function playNumPercentX(d,i) {
  return xPercent(+d.Play_num_team)
}
function newQtTeam(d,i) {
  return d.New_q_team !== ""
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
function nestedTeamClass(class_name) {
  return "." + team_class + " > ." + class_name
}
var gridVtLine = d3.selectAll(nestedTeamClass("runPass-svg"))
    .selectAll("line")
    .data(teamData)
    .enter()
    .filter(newQtTeam)
    .append("line")
    .attr("class","gridLine")
    .attr("x1",playNumPercentX)
    .attr("x2",playNumPercentX)
    .attr("y1",0)
    .attr("y2","100%")
var gridVtTxt = d3.selectAll(nestedTeamClass("runPass-svg"))
    .selectAll("text")
    .data(teamData)
    .enter()
    .filter(newQtTeam)
    .append("text")
    .text(function(d) { return quarterNameFn(+d.Quarter) })
    .attr("class","gridText")
    .attr("x",playNumPercentX)
    .attr("transform","translate(" + gridQtAdjX + ",0)")
    .attr("y",gridQtY)

/* percentages (horizontal) grid */
var yScaleGrid = d3.scaleLinear()
  .domain([0,height_adj])
  .range([1,0])
function yPercent(y) {
  return yScaleGrid(y) * 100 + "%"
}
function yLabel(y) {
  return y.toFixed(2) * 100 + "%"
}

var gridPcAdjX = 4
var gridPcAdjY = 16
var leagueTextW = "99%"
var grid_pc_arr = [.25,.5,.75, 1]
grid_pc_arr.forEach(gridHz)

function gridHz(item) {
  d3.selectAll(nestedTeamClass("runPass-svg"))
    .append("line")
    .attr("class","grid-white")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(item))
    .attr("y2",yPercent(item))
  d3.selectAll(nestedTeamClass("runPass-svg"))
    .append("text")
    .text(yLabel(item))
    .attr("class","gridText")
    .attr("x",gridPcAdjX)
    .attr("y",yPercent(item))
    .attr("transform","translate(0," + gridPcAdjY + ")")
}
var leagueLine = srSvg.append("line")
    .attr("class","league-sr-line")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(league_sr))
    .attr("y2",yPercent(league_sr))
var leagueText = srSvg.append("text")
    .text("NCAA avg: " + yLabel(league_sr) + "*")
    .attr("class","gridText leagueText")
    .attr("x",leagueTextW)
    .attr("y",yPercent(league_sr))
    .attr("transform","translate(0," + gridPcAdjY + ")")

/* line graphs */
var runPassChartH = document.getElementById(teamId("runPass-rate-chart")).offsetHeight

var yScale = d3.scaleLinear()
  .domain([0,height_adj])
  .range([runPassChartH,0])
function runRateY(d,i) {
  return yScale(d.runRate_cume)
}
function runSrY(d,i) {
  return yScale(d.SR_run_cume)
}
function passSrY(d,i) {
  return yScale(d.SR_pass_cume)
}

var runPassChartW = document.getElementById(teamId("runPass-rate-chart")).offsetWidth
var xScale = d3.scaleLinear()
  .domain([2,playNumMax])
  .range([0,runPassChartW])
function playNumX(d,i) {
  return xScale(+d.Play_num_team)
}

var rateLine = d3.line()
  .x(playNumX)
  .y(runRateY)
  .curve(d3.curveBasis)
var runSrLine = d3.line()
  .x(playNumX)
  .y(runSrY)
  .curve(d3.curveBasis)
var passSrLine = d3.line()
  .x(playNumX)
  .y(passSrY)
  .curve(d3.curveBasis)

var runRatePath = rateSvg.append("path")
    .attr("d",rateLine(teamData))
    .attr("class","run-rate-line")
var runSrPath = srSvg.append("path")
    .attr("d",runSrLine(teamData))
    .attr("class","run-sr-line")
var passSrPath = srSvg.append("path")
    .attr("d",passSrLine(teamData))
    .attr("class","pass-sr-line")

window.addEventListener('resize', updateLineX);

function updateLineX() {
  var runPassChartW = document.getElementById(teamId("runPass-rate-chart")).offsetWidth
  xScale.range([0,runPassChartW])
  runRatePath.attr('d',rateLine(teamData));
  runSrPath.attr('d',runSrLine(teamData));
  passSrPath.attr('d',passSrLine(teamData));
}
}
}
