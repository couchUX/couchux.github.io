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

/* d3 prep */
containerWidth = document.getElementById("plays-charts-container").offsetWidth

squareHeightFn = function(containerWidth) {
  if (containerWidth < 380) {
    return 1.0
    }
  else {
    if (containerWidth < 500) {
      return 0.75
    }
    else {
      return 0.6
    }
  }
}

/* d3 render function */
function render_chart() {

var layout = {
  barMarginTop: 20,
  nsOpacity: 0.3,
  axisLabelAdj: 0.73,
  axisLabelAdj_bold: 0.65,
  gridWidth: 1.5,
}
var chartWidth = containerWidth
    barWidthMulti = 0.96
    halfMargin = chartWidth * (1 - barWidthMulti)
    barWidth = chartWidth / 20 * barWidthMulti
    labelAdj = barWidth / 2
    squareHeight = barWidth * squareHeightFn(containerWidth)
    axisHeight = squareHeight * 1.6
    maxIndex = d3.max(playsData, function(d,i) { return (i + 1) });
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    barMaxHeight = totalPlaysMax * squareHeight
    chartHeight = (barMaxHeight + layout.barMarginTop) * 2 + axisHeight
    playsChartName = "plays-chart"
    qWidth = chartWidth * barWidthMulti / 4
    bottomBarY_all = 0

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
        return d.Total_plays * squareHeight
    }
    barHeight_S = function(d,i) {
        return d.S_plays * squareHeight
    }
    barHeight_X = function(d,i) {
        return d.X_plays * squareHeight
    }
    qX = function(q) {
      return "translate("
             + qWidth * (q - 1)
             + ")"
    }
    topGroupY = function(q) {
      return "translate(0,"
             + layout.barMarginTop
             + ")"
    }
    axisGroupY = function(q) {
      return "translate(0,"
             + (layout.barMarginTop + barMaxHeight)
             + ")"
    }
    bottomGroupY = function(q) {
      return "translate(0,"
             + (layout.barMarginTop + barMaxHeight + axisHeight)
             + ")"
    }
    halfMarginFn = function(q) {
      return "translate("
             + (qWidth * (q - 1) + halfMargin)
             + ")"
    }
    barX = function(d,i) {
      return i * barWidth
    }
    topBarY = function(d,i) {
      return barMaxHeight - d.Total_plays * squareHeight
    }
    topBarY_S = function(d,i) {
      return barMaxHeight - d.S_plays * squareHeight
    }
    topBarY_X = function(d,i) {
      return barMaxHeight - d.X_plays * squareHeight
    }
    q_to_class = function(q) {
      return "Q" + q
    }
    q_to_class_sel = function(q) {
      return ".Q" + q
    }
    quinLabelX = function(quin_num) {
          return barWidth * quin_num + labelAdj
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
      .attr("id","top-group")
      .attr("transform",topGroupY)
    axisGroup = svg.append("g")
      .attr("id","axis-group")
      .attr("transform",axisGroupY)
    bottomGroup = svg.append("g")
      .attr("id","bottom-group")
      .attr("transform",bottomGroupY)

renderQuarter(1,q1_fil)
renderQuarter(2,q2_fil)
renderQuarter(3,q3_fil)
renderQuarter(4,q4_fil)

var gridAttr = d3.selectAll(".grid")
      .attr("fill","none")
      .style("stroke","white")
      .style("stroke-width",layout.gridWidth)
    boldAttr = d3.selectAll(".axis-label, .bold")
          .attr("y",axisHeight * layout.axisLabelAdj_bold)
    thirdMargin = d3.selectAll(".Q3")
      .attr("transform",halfMarginFn(3))
    fourthMargin = d3.selectAll(".Q4")
      .attr("transform",halfMarginFn(4))

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
      renderGridHz(q, q_fil)
      renderLabels(q)
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
function renderGridHz(q, q_fil) {
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(1))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(2))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(3))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(4))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(5))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(6))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(7))
      renderBars(team1_fil, topGroup, q, q_fil, ".top-bars", "top-bars grid", 1, squareHeight, gridHzY(8))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(1))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(2))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(3))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(4))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(5))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(6))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(7))
      renderBars(team2_fil, bottomGroup, q, q_fil, ".bottom-bars", "bottom-bars grid", 1, squareHeight, gridHzY(8))
} // !! how to get this whole thing consolidated. Tried for.Each functions... nope.

function gridHzY(grid_num) {
      return barMaxHeight - grid_num * squareHeight
}
function renderLabels(q) {
      axisGroup.append("g")
      .attr("class",q_to_class(q))
      .attr("transform",qX(q))

      renderLabel(q,0,"axis-labels bold",q_to_class(q))
      renderLabel(q,1,"axis-labels","\267")
      renderLabel(q,2,"axis-labels","\267")
      renderLabel(q,3,"axis-labels","\267")
      renderLabel(q,4,"axis-labels","\267")
}
function renderLabel(q, quin_num, label_class, text) {
      axisGroup.select(q_to_class_sel(q))
      .append("text")
      .attr("class",label_class)
      .text(text)
      .attr("text-anchor","middle")
      .attr("x",quinLabelX(quin_num))
      .attr("y",axisHeight * layout.axisLabelAdj)
}
} //end of building chart in d3
