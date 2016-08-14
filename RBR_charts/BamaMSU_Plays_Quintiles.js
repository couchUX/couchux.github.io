/* select what csv should be run */
var csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU_Plays_Quintiles.csv"

/* run the whole chart function */

playsChart(csv_url);

/* tie chart colors to team names */
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

/* d3 prep and rendering */
function render_chart() {

var layout = {
  barMarginTop: 20,
  nsOpacity: 0.3,
}
var containerWidth = document.getElementById("plays-charts-container").offsetWidth
    chartWidth = containerWidth
    barWidth = chartWidth / 20
    maxIndex = d3.max(playsData, function(d,i) { return (i + 1) });
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    barMaxHeight = totalPlaysMax * barWidth
    chartHeight = (barMaxHeight + layout.barMarginTop) * 2
    playsChartName = "plays-chart"

    selectChartClass = function() {
      return "." + playsChartName
    }
    defineChartClass = function() {
      return playsChartName
    }
    teamColor = function(team_name) {
      return teamColors[team_name]
    }
    barColor = function(d,i) {
        return teamColor(d.Team)
    }
    team1_fil = function(d,i) {
        return d.Team == teamList.team1
    }
    team2_fil = function(d,i) {
        return d.Team == teamList.team2
    }
    q1_fil = function(d,i) {
        return (d.Quarter_quintile > 1 && d.Quarter_quintile < 2)
    }
    q2_fil = function(d,i) {
        return (d.Quarter_quintile > 2 && d.Quarter_quintile < 3)
    }
    q3_fil = function(d,i) {
        return (d.Quarter_quintile > 3 && d.Quarter_quintile < 4)
    }
    q4_fil = function(d,i) {
        return d.Quarter_quintile > 4
    }
    barHeight = function(d,i) {
        return d.Total_plays * barWidth
    }
    barHeight_S = function(d,i) {
        return d.S_plays * barWidth
    }
    barHeight_X = function(d,i) {
        return d.X_plays * barWidth
    }
    gridY = function(top_bottom, grid_num) {
        if (top_bottom == "topGroup") {
          return layout.barMarginTop + (barWidth * grid_num)
        }
        else {
          return
        }
    }
    qX = function(q) {
      return "translate("
             + chartWidth / 4 * (q - 1)
             + ",0)"
    }
    topGroupY = function(q) {
      return "translate(0,"
             + layout.barMarginTop
             + ")"
    }
    bottomGroupY = function(q) {
      return "translate(0,"
             + (layout.barMarginTop + barMaxHeight)
             + ")"
    }
    barX = function(d,i) {
      return i / (maxIndex / 2) * chartWidth
    }
    topBarY = function(d,i) {
      return barMaxHeight + layout.barMarginTop - d.Total_plays * barWidth
    }
    topBarY_S = function(d,i) {
      return barMaxHeight + layout.barMarginTop - d.S_plays * barWidth
    }
    topBarY_X = function(d,i) {
      return barMaxHeight + layout.barMarginTop - d.X_plays * barWidth
    }
    bottomBarY_all = 0
    q_to_class = function(q) {
      return "q" + q
    }

/* actually building the chart in d3 */
var chart = d3.select("#plays-charts-container")
      .append("div")
      .attr("class",defineChartClass())

    svg = d3.select(selectChartClass())
      .append("svg")
      .attr("width",chartWidth)
      .attr("height",chartHeight)

    topGroup = svg.append("g")
      .attr("class","top-group")
    bottomGroup = svg.append("g")
      .attr("class","bottom-group")
      .attr("transform",bottomGroupY)
    topGrid = topGroup.append("g")
      .attr("class","top-grid")
    bottomGrid = bottomGroup.append("g")
      .attr("class","bottom-grid")

renderQuarter(1,q1_fil)
renderQuarter(2,q2_fil)
renderQuarter(3,q3_fil)
renderQuarter(4,q4_fil)

var gridAttr = d3.selectAll(".grid")
      .attr("fill","none")
      .style("stroke","white")
      .style("stroke-width",2)

/*
renderGridHz()
*/

/* supporting functions for top and bottom bars */
function renderQuarter(q, q_fil) {
  renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars ns", layout.nsOpacity, barHeight, topBarY)
  renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars s", 1, barHeight_S, topBarY_S)
  renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars expBars", 1, barHeight_X, topBarY_X)
  renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, barHeight, topBarY)
  renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars ns", layout.nsOpacity, barHeight, bottomBarY_all)
  renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars s", 1, barHeight_S, bottomBarY_all)
  renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars expBars", 1, barHeight_X, bottomBarY_all)
  renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, barHeight, bottomBarY_all)
}

function renderBars(team_fil, top_bottom, q, q_fil, bar_cl_sel, bar_cl_set, bar_o, bar_height, bar_y) {
      top_bottom.append("g")
      .attr("class",q_to_class(q))
      .attr("transform",qX(q))
      .selectAll(bar_cl_sel)
      .data(playsData)
      .enter()
      .filter(team_fil)
      .filter(q_fil)
      .append("rect")
      .attr("class",bar_cl_set)
      .attr("fill",barColor)
      .attr("opacity",bar_o)
      .attr("width",barWidth)
      .attr("height",bar_height)
      .attr("x",barX)
      .attr("y",bar_y)
}

/*
function renderGridHz(top_bottom, grid_num) { top_bottom.append("rect")
      .attr("width",chartWidth)
      .attr("height",barWidth)
      .attr("fill","none")
      .attr("y",layout.barMarginTop)
}
*/
} //end of building chart in d3
