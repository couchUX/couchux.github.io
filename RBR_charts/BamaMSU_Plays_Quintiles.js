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

/* d3 prep and rendering */
function render_chart() {

var layout = {
  barMarginTop: 16,
  nsOpacity: 0.3,
}
var containerWidth = document.getElementById("plays-charts-container").offsetWidth
    chartWidth = containerWidth
    barWidth = chartWidth / 20
    maxIndex = d3.max(playsData, function(d,i) { return (i + 1) });
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    chartHeight = totalPlaysMax * barWidth * 2
    gridHeight = totalPlaysMax * barWidth + layout.barMarginTop
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
    gridY = function(top_bottom, grid_num) {
        if (top_bottom == "topGroup") {
          return layout.barMarginTop + (barWidth * grid_num)
        }
        else {
          return
        }
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
      return chartHeight / 2 + layout.barMarginTop - d.Total_plays * barWidth
    }
    topBarY_S = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop - d.S_plays * barWidth
    }
    topBarY_X = function(d,i) {
      return chartHeight / 2 + layout.barMarginTop - d.X_plays * barWidth
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
      .attr("width",chartWidth)
      .attr("height",chartHeight)

    topGroup = svg.append("g")
      .attr("class","top-group")
    bottomGroup = svg.append("g")
      .attr("class","bottom-group")
    topGrid = topGroup.append("g")
      .attr("class","top-grid")
    bottomGrid = bottomGroup.append("g")
      .attr("class","bottom-grid")

renderTop = function(q, q_filter, q_class) {
      topBarsNS(q, q_filter, q_class)
      topBarsS(q, q_filter, q_class)
      topBarsX(q, q_filter, q_class)
      topGridV(q, q_filter, q_class)
}
renderBottom = function(q, q_filter, q_class) {
      bottomBarsNS(q, q_filter, q_class)
      bottomBarsS(q, q_filter, q_class)
      bottomBarsX(q, q_filter, q_class)
      bottomGridV(q, q_filter, q_class)
}
renderTop(1, q1_filter, "top-bars .q1")
renderTop(2, q2_filter, "top-bars .q2")
renderTop(3, q3_filter, "top-bars .q3")
renderTop(4, q4_filter, "top-bars .q4")
renderBottom(1, q1_filter, "bottom-bars .q1")
renderBottom(2, q2_filter, "bottom-bars .q2")
renderBottom(3, q3_filter, "bottom-bars .q3")
renderBottom(4, q4_filter, "bottom-bars .q4")

renderGridHz()


/* supporting functions for top and bottom bars */
function topBarsNS(q, q_filter, q_class) {
      topGroup.append("g")
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
      topGroup.append("g")
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
      topGroup.append("g")
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
function bottomBarsNS(q, q_filter, q_class) {
      bottomGroup.append("g")
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
      bottomGroup.append("g")
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
      bottomGroup.append("g")
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
      topGroup.append("g")
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
      .style("stroke","white")
      .style("stroke-width",2)
}
function bottomGridV(q, q_filter, q_class) {
      bottomGroup.append("g")
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

function renderGridHz(top_bottom, grid_num) { top_bottom.append("rect")
      .attr("width",chartWidth)
      .attr("height",barWidth)
      .attr("fill","none")
      .attr("y",layout.barMarginTop)
}

} //end of building chart in d3
