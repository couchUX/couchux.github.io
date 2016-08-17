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

/* responsiveness prep */
responsive = function(allWidth) {
  if (allWidth < rArrays.rWidths[0]) {
    return 0
    }
  else if (allWidth < rArrays.rWidths[1]) {
    return 1
    }
  else if (allWidth < rArrays.rWidths[2]) {
    return 2
    }
  else {
    return 3
  }
} // how to avoid nested IFs here? Maybe use an array here too?

var layout = {
    barMarginTop:       20,
    nsOpacity:          0.3,
    axisLabelAdj:       0.73,
    axisLabelAdj_bold:  0.65,
    gridWidth:          1,
    gridOpacity:        1,
    labelLineOpacity:   0.5,
    labelLineWidth:     1.2,
    upPointsAdj:        6,
    downPointsAdj:      12,
}
var rArrays = {
    rWidths:          [380, 550, 680],
    chartMargin:      [1, 6, 20, 40],
    barWidthMulti:    [.97, .96, .96, .96],
    labelLineLenAdj:  [ 6, 4, 3, 1],
    playHeight:      [1, .75, .6, .6],
    axisHeight:       [24, 24, 26, 26]
}
    /* margins, widths, and X positions */
var allWidth = document.getElementById("plays-charts-container").offsetWidth
    chartMargin = rArrays.chartMargin[responsive(allWidth)]
    chartWidth = allWidth - chartMargin * 2
    barWidthMulti = rArrays.barWidthMulti[responsive(allWidth)]
    halfMargin = chartWidth * (1 - barWidthMulti)
    barWidth = chartWidth / 20 * barWidthMulti
    qWidth = chartWidth * barWidthMulti / 4
    labelAdj = barWidth / 2
    labelLineLenAdj = rArrays.labelLineLenAdj[responsive(allWidth)]
    chartX = function() {
      return "translate(" + chartMargin + ")"
    }
    halfMarginFn = function(q) {
      return "translate(" + (qWidth * (q - 1) + halfMargin) + ")"
    }
    qX = function(q) {
      return "translate(" + qWidth * (q - 1) + ")"
    }
    barX = function(d,i) {
      return i * barWidth
    }
    pointsX = function(d,i) {
      return i * barWidth + labelAdj
    }
    quinLabelX = function(quin_num) {
          return barWidth * quin_num + labelAdj
    }

    /* heights and Y positions */
    totalPlaysMax = d3.max(playsData, function(d,i) { return d.Total_plays_max })
    playHeight = barWidth * rArrays.playHeight[responsive(allWidth)]
    axisHeight = rArrays.axisHeight[responsive(allWidth)]
    barMaxHeight = totalPlaysMax * playHeight
    chartHeight = (barMaxHeight + layout.barMarginTop) * 2 + axisHeight
    barHeight = function(d,i) {
        return d.Total_plays * playHeight
    }
    barHeight_S = function(d,i) {
        return d.S_plays * playHeight
    }
    barHeight_X = function(d,i) {
        return d.X_plays * playHeight
    }
    upGroupY = function(q) {
      return "translate(0," + layout.barMarginTop + ")"
    }
    axisGroupY = function(q) {
      return "translate(0," + (layout.barMarginTop + barMaxHeight) + ")"
    }
    downGroupY = function(q) {
      return "translate(0," + (layout.barMarginTop + barMaxHeight + axisHeight) + ")"
    }
    upBarY = function(d,i) {
      return barMaxHeight - d.Total_plays * playHeight
    }
    upBarY_S = function(d,i) {
      return barMaxHeight - d.S_plays * playHeight
    }
    upBarY_X = function(d,i) {
      return barMaxHeight - d.X_plays * playHeight
    }
    upPointsY = function(d,i) {
      return barMaxHeight - d.Total_plays * playHeight - layout.upPointsAdj
    }
    downPointsY = function(d,i) {
      return barHeight(d,i) + layout.downPointsAdj
    }
    /* naming and selecting */
    playsChartName = "plays-chart"
    selectChartClass = function() {
      return "." + playsChartName
    }
    defineChartClass = function() {
      return playsChartName
    }
    q_to_class = function(q) {
      return "Q" + q
    }
    q_to_class_sel = function(q) {
      return ".Q" + q
    }
    q_to_label = function(q) {
      return q + "Q"
    }
    class_to_sel = function(class_name) {
      return "." + class_name
    }
    points = function(d,i) {
      if (d.Points == "0") {
        return ""
      }
      else {
        return d.Points
      }
    }

    /* filter functions */
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
    } //how to consolidate these into one q_fil, while persisting the d.VALUE from data?

    /* color selections */
    teamColor = function(team_name) {
      return teamColors[team_name]
    }
    barColor = function(d,i) {
        return teamColor(d.Team)
    }

/* actually building the chart in d3 */
var chart = d3.select("#plays-charts-container")
      .append("div")
      .attr("class",defineChartClass())
    svg = d3.select(selectChartClass())
      .append("svg")
      .attr("width",chartWidth + chartMargin * 2)
      .attr("height",chartHeight)
    allGroups = svg.append("g")
      .attr("id","all-groups")
      .attr("transform",chartX)
    upGroup = allGroups.append("g")
      .attr("id","up-group")
      .attr("transform",upGroupY)
    axisGroup = allGroups.append("g")
      .attr("id","axis-group")
      .attr("transform",axisGroupY)
    downGroup = allGroups.append("g")
      .attr("id","down-group")
      .attr("transform",downGroupY)

renderQuarter(1,q1_fil)
renderQuarter(2,q2_fil)
renderQuarter(3,q3_fil)
renderQuarter(4,q4_fil)

var gridAttr = d3.selectAll(".grid")
      .attr("fill","none")
      .style("opacity",layout.gridOpacity)
      .style("stroke","white")
      .style("stroke-width",layout.gridWidth)
    boldAttr = d3.selectAll(".axis-label, .bold")
          .attr("y",axisHeight * layout.axisLabelAdj_bold)
    thirdMargin = d3.selectAll(".Q3")
      .attr("transform",halfMarginFn(3))
    fourthMargin = d3.selectAll(".Q4")
      .attr("transform",halfMarginFn(4))

/* supporting functions for bars and grid */
function renderQuarter(q, q_fil) {
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars ns", layout.nsOpacity, barHeight, upBarY)
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars s", 1, barHeight_S, upBarY_S)
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars expBars", 1, barHeight_X, upBarY_X)
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars ns", layout.nsOpacity, barHeight, 0)
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars s", 1, barHeight_S, 0)
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars expBars", 1, barHeight_X, 0)
      renderGridHz(q, q_fil)
      renderLabels(q)
      renderPoints(team1_fil, upGroup, q, q_fil, ".up-points", "up-points", upPointsY)
      renderPoints(team2_fil, downGroup, q, q_fil, ".down-points", "down-points", downPointsY)
}
function renderBars(team_fil, up_down, q, q_fil, bar_cl_sel, bar_cl_set, bar_o, bar_height, bar_y) {
      up_down.append("g")
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
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(1))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(2))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(3))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(4))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(5))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(6))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(7))
      renderBars(team1_fil, upGroup, q, q_fil, ".up-bars", "up-bars grid", 1, playHeight, gridHzY(8))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(1))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(2))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(3))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(4))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(5))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(6))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(7))
      renderBars(team2_fil, downGroup, q, q_fil, ".down-bars", "down-bars grid", 1, playHeight, gridHzY(8))
} // !! how to get this whole thing consolidated. Tried for.Each functions... nope.

function gridHzY(grid_num) {
      return barMaxHeight - grid_num * playHeight
}

/* axis labels and label lines */
function renderLabels(q) {
      axisGroup.append("g")
      .attr("class",q_to_class(q))
      .attr("transform",qX(q))

      renderLabel(q, 0, "axis-labels bold", q_to_label(q))
      renderLabelLines(q, "axis-label-lines")
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
function renderLabelLines(q, label_class) {
      axisGroup.select(q_to_class_sel(q))
      .append("line")
      .attr("class",label_class)
      .attr("x1",qWidth / 5 + labelLineLenAdj)
      .attr("x2",qWidth - layout.labelLineWidth + 1 - labelLineLenAdj)
      .attr("y1",axisHeight / 2)
      .attr("y2",axisHeight / 2)

      axisGroup.select(q_to_class_sel(q))
      .append("line")
      .attr("class",label_class)
      .attr("x1",qWidth - labelLineLenAdj)
      .attr("x2",qWidth - labelLineLenAdj)
      .attr("y1",axisHeight * 0.4)
      .attr("y2",axisHeight * 0.6)

      axisGroup.selectAll(class_to_sel(label_class))
      .style("stroke","#242424")
      .style("stroke-width",layout.labelLineWidth)
      .style("opacity",layout.labelLineOpacity)
}
// renderPoints(team1_fil, upGroup, q, q_fil, ".up-points", "up-points", upBarY)
function renderPoints(team_fil, up_down, q, q_fil, points_cl_sel, points_cl_set, points_y) {
      up_down.append("g")
      .attr("class",q_to_class(q))
      .attr("transform",qX(q))
      .selectAll(points_cl_sel)
      .data(playsData)
      .enter()
      .filter(team_fil)
      .filter(q_fil)
      .append("text")
      .attr("text-anchor","middle")
      .text(points)
      .style("fill",barColor)
      .attr("class",points_cl_set)
      .attr("x",pointsX)
      .attr("y",points_y)
}
} //end of building chart in d3
