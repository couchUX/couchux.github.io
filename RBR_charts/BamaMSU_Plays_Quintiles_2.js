/* select what csv should be run */
var csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU_Plays_Quintiles.csv"
playsChart(csv_url);

/* team names and colors */
var teamList = {
  team1: "Alabama",
  team2: "Michigan State"
}
var teamColors = {
  "Alabama": "#C31C45",
  "Michigan State": "#509E8B"
}

/* defining the main chart functions */
function playsChart(data_url) {
  d3.csv(data_url, csv_response)
}
function csv_response(error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    playsData = data
    render_chart()
  }
}

/* render d3 chart */
function render_chart() {

var allWidth = allWidth = document.getElementById("plays-charts-container").offsetWidth

class_select = function(class_name) {
  return "." + class_name
}

/* create and group elements */
var svg = d3.select("#plays-charts-container").append("svg")
  .attr("width",allWidth)
  .attr("height","600")
var allGroups = svg.append("g")
render_team(teamList.team1)
render_team(teamList.team2)
render_axis()

function render_team(team) {
  var teamGroup = allGroups.append("g")
    .attr("transform","translate(0,20)")
    .attr("class",function(team) { return team })
  render_quarter(1)
  render_quarter(2)
  render_quarter(3)
  render_quarter(4)
}
function render_quarter(q) {
  var qGroup = teamGroup.append("g")
    .attr("transform",function(q) { return "translate(" + q * allWidth / 4 + ")"})
    .attr("class",function(q) { return q + "Q"})
  render_bars("uPlays")
  render_bars("sPlays")
  render_bars("xPlays")
}
function render_bars(class_name) {
  var barGroup = qGroup.select(class_select(class_name))
    .data(playsData)
    .enter()
    .append("rect")
    .attr("class",class_name)
}

} //end of building chart in d3
