/* select what csv should be run */
var csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU_Plays_Quintiles.csv"

/* run the whole chart function */

playsChart(csv_url);

/* tie chart colors to team names */
var teamList = {
  "team1": "Alabama",
  "team2": "Michigan State"
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

/* Some prep for building the d3 chart */
var containerWidth = document.getElementById("plays-charts-container").offsetWidth

function render_chart() {

var playsChartName = "plays-chart"

function selectChartClass() {
  return "." + playsChartName
}
function defineChartClass() {
  return playsChartName
}

var layout = {
  barMarginTop: 16,
  nsOpacity: 0.3,
}

var chartWidth = containerWidth
    barWidth = chartWidth / 20
    maxIndex = d3.max(playsData, function(d,i) { return (i + 1) });
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    chartHeight = totalPlaysMax * barWidth * 2
    gridHeight = totalPlaysMax * barWidth + layout.barMarginTop

    teamColor = function(team_name) {
      return teamColors[team_name]
    }
    barColor = function(d,i) {
        return teamColor(d.Team)
    }
    team1_filter = function(d,i) {
        return d.Team == teamList.team1
    }
    team2_filter = function(d,i) {
        return d.Team == teamList.team2
    }
    q1_filter = function(d,i) {
        return (d.Quarter_quintile > 1 && d.Quarter_quintile < 2)
    }
    q2_filter = function(d,i) {
        return (d.Quarter_quintile > 2 && d.Quarter_quintile < 3)
    }
    q3_filter = function(d,i) {
        return (d.Quarter_quintile > 3 && d.Quarter_quintile < 4)
    }
    q4_filter = function(d,i) {
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
    groupX = function(q) {
      return "translate("
             + chartWidth / 4 * (q - 1)
             + ",0)"
    }
    barX = function(d,i) {
      return i / (maxIndex / 2) * chartWidth
    }
    topBarY = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop - (d.Total_plays * barWidth)
    }
    topBarY_S = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop - (d.S_plays * barWidth)
    }
    topBarY_X = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop - (d.X_plays * barWidth)
    }
    bottomBarY_all = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop
    }

/* actually building the chart in d3 */

var chart = d3.select("#plays-charts-container")
      .append("div")
      .attr("class",defineChartClass())

    svg = d3.select(selectChartClass())
      .append("svg")
      .attr("class","svgChart")
      .attr("width",chartWidth)
      .attr("height",chartHeight)

/* render top bars for first team */
topBarsNS(1, q1_filter, ".top-bars .q1")
topBarsS(1, q1_filter, ".top-bars .q1 .success")
topBarsX(1, q1_filter, ".top-bars .q1 .explosive")
topGridV(1, q1_filter, ".top-bars .q1 .grid")

topBarsNS(2, q2_filter, ".top-bars .q2")
topBarsS(2, q2_filter, ".top-bars .q2 .success")
topBarsX(2, q2_filter, ".top-bars .q2 .explosive")
topGridV(2, q1_filter, ".top-bars .q2 .grid")

topBarsNS(3, q3_filter, ".top-bars .q3")
topBarsS(3, q3_filter, ".top-bars .q3 .success")
topBarsX(3, q3_filter, ".top-bars .q3 .explosive")
topGridV(3, q1_filter, ".top-bars .q3 .grid")

topBarsNS(4, q4_filter, ".top-bars .q4")
topBarsS(4, q4_filter, ".top-bars .q4 .success")
topBarsX(4, q4_filter, ".top-bars .q4 .explosive")
topGridV(4, q1_filter, ".top-bars .q4 .grid")

/* render bottom bars for other team */
bottomBarsNS(1, q1_filter, ".bottom-bars .q1")
bottomBarsS(1, q1_filter, ".bottom-bars .q1 .success")
bottomBarsX(1, q1_filter, ".bottom-bars .q1 .explosive")
bottomGridV(1, q1_filter, ".bottom-bars .q1 .grid")

bottomBarsNS(2, q2_filter, ".bottom-bars .q2")
bottomBarsS(2, q2_filter, ".bottom-bars .q2 .success")
bottomBarsX(2, q2_filter, ".bottom-bars .q2 .explosive")
bottomGridV(2, q1_filter, ".bottom-bars .q2 .grid")

bottomBarsNS(3, q3_filter, ".bottom-bars .q3")
bottomBarsS(3, q3_filter, ".bottom-bars .q3 .success")
bottomBarsX(3, q3_filter, ".bottom-bars .q3 .explosive")
bottomGridV(3, q1_filter, ".bottom-bars .q3 .grid")

bottomBarsNS(4, q4_filter, ".bottom-bars .q4")
bottomBarsS(4, q4_filter, ".bottom-bars .q4 .success")
bottomBarsX(4, q4_filter, ".bottom-bars .q4 .explosive")
bottomGridV(4, q1_filter, ".bottom-bars .q4 .grid")

/* supporting functions for top bars */
function topBarsNS(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team1_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars")
          .attr("fill",barColor)
          .attr("opacity",layout.nsOpacity)
          .attr("width",barWidth)
          .attr("height",barHeight)
          .attr("x",barX)
          .attr("y",topBarY)
}

function topBarsS(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team1_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars success")
          .attr("fill",barColor)
          .attr("width",barWidth)
          .attr("height",barHeight_S)
          .attr("x",barX)
          .attr("y",topBarY_S)
}

function topBarsX(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team1_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars expBars")
          .attr("width",barWidth)
          .attr("height",barHeight_X)
          .attr("x",barX)
          .attr("y",topBarY_X)
}

/* supporting functions for bottom bars */
function bottomBarsNS(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team2_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars")
          .attr("fill",barColor)
          .attr("opacity",layout.nsOpacity)
          .attr("width",barWidth)
          .attr("height",barHeight)
          .attr("x",barX)
          .attr("y",bottomBarY_all)
}

function bottomBarsS(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team2_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars success")
          .attr("fill",barColor)
          .attr("width",barWidth)
          .attr("height",barHeight_S)
          .attr("x",barX)
          .attr("y",bottomBarY_all)
}

function bottomBarsX(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".top-bars")
          .data(playsData)
          .enter()
          .filter(team2_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","top-bars expBars")
          .attr("width",barWidth)
          .attr("height",barHeight_X)
          .attr("x",barX)
          .attr("y",bottomBarY_all)
}

function topGridV(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".gridLine")
          .data(playsData)
          .enter()
          .filter(team1_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","gridLine")
          .attr("fill","none")
          .attr("width",barWidth)
          .attr("height",gridHeight)
          .attr("x",barX)
          .attr("y",layout.barMarginTop)
          .style("stroke","white")
          .style("stroke-width",2)
}

function bottomGridV(q, q_filter, q_class) {
      svg.append("g")
          .attr("class",q_class)
          .attr("transform",groupX(q))
          .selectAll(".gridLine")
          .data(playsData)
          .enter()
          .filter(team1_filter)
          .filter(q_filter)
          .append("rect")
          .attr("class","gridLine")
          .attr("fill","none")
          .attr("width",barWidth)
          .attr("height",gridHeight)
          .attr("x",barX)
          .attr("y",bottomBarY_all)
          .style("stroke","white")
          .style("stroke-width",2)
}

} //end of building chart in d3
