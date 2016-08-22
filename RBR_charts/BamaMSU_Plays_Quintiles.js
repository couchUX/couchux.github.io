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
    nsOpacity:          0.3,
    axisLabelAdj:       0.66,
    gridWidth:          1,
    gridOpacity:        1,
    labelLineOpacity:   0.5,
    labelLineWidth:     1.2,
}
var rArrays = {
    rWidths:            [380, 550, 680],
    chartMarginL:       [1, 6, 30, 50],
    chartMarginR:       [1, 6, 20, 40],
    barMarginTop:       [30, 30, 20, 20],
    barWidthMulti:      [.97, .96, .96, .96],
    labelLineLenAdj:    [6, 4, 3, 1],
    playHeight:         [1, .75, .6, .6],
    axisHeight:         [24, 24, 26, 26],
    upPointsAdj:        [3, 4, 5, 5],
    downPointsAdj:      [11, 12, 13, 13],
    teamTitlesCentVis:  ["visible","visible","hidden","hidden"],
    teamTitlesLeftVis:  ["hidden","hidden","visible","visible"],
}
    /* margins, widths, and X positions */
var allWidth = document.getElementById("plays-charts-container").offsetWidth
    chartMarginL = rArrays.chartMarginL[responsive(allWidth)]
    chartMarginR = rArrays.chartMarginR[responsive(allWidth)]
    barMarginTop = rArrays.barMarginTop[responsive(allWidth)]
    chartWidth = allWidth - chartMarginL - chartMarginR
    barWidthMulti = rArrays.barWidthMulti[responsive(allWidth)]
    halfMargin = chartWidth * (1 - barWidthMulti)
    barWidth = chartWidth / 20 * barWidthMulti
    qWidth = chartWidth * barWidthMulti / 4
    labelAdj = barWidth / 2
    labelLineLenAdj = rArrays.labelLineLenAdj[responsive(allWidth)]
    teamTitlesCentVis = rArrays.teamTitlesCentVis[responsive(allWidth)]
    teamTitlesLeftVis = rArrays.teamTitlesLeftVis[responsive(allWidth)]
    chartX = function() {
      return "translate(" + chartMarginL + ")"
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
    chartHeight = (barMaxHeight + barMarginTop) * 2 + axisHeight
    upPointsAdj = rArrays.upPointsAdj[responsive(allWidth)]
    downPointsAdj = rArrays.downPointsAdj[responsive(allWidth)]
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
      return "translate(0," + barMarginTop + ")"
    }
    axisGroupY = function(q) {
      return "translate(0," + (barMarginTop + barMaxHeight) + ")"
    }
    downGroupY = function(q) {
      return "translate(0," + (barMarginTop + barMaxHeight + axisHeight) + ")"
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
      return barMaxHeight - d.Total_plays * playHeight - upPointsAdj
    }
    downPointsY = function(d,i) {
      return barHeight(d,i) + downPointsAdj
    }
    /* naming and selecting */
    q_to_class = function(q) {
      return "Q" + q
    }
    q_to_class_sel = function(q) {
      return ".Q" + q
    }
    axis_q_to_class = function(q) {
      return "axis_Q" + q
    }
    axis_q_to_class_sel = function(q) {
      return ".axis_Q" + q
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
var svg = d3.select("#plays-charts-container")
      .append("svg")
      .attr("width",chartWidth + chartMarginL + chartMarginR)
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

var upLines = upGroup.insert("g")
      .attr("class","up-lines")
    downLines = downGroup.insert("g")
      .attr("class","down-lines")

/* render the white lines that serve as a horizontal grid */
var grid_nums = [1,2,3,4,5,6,7,8]
grid_nums.forEach(renderGridHz)
var gridAttr = d3.selectAll(".grid")
      .attr("fill","none")
      .style("opacity",layout.gridOpacity)
      .style("stroke","white")
      .style("stroke-width",layout.gridWidth)
    thirdMargin = d3.selectAll(".Q3")
      .attr("transform",halfMarginFn(3))
    fourthMargin = d3.selectAll(".Q4")
      .attr("transform",halfMarginFn(4))

teamTitlesCent(upGroup, teamList.team1, 0)
teamTitlesCent(downGroup, teamList.team2, barMaxHeight)
teamTitlesLeft(upGroup, teamList.team1, barMaxHeight, "start")
teamTitlesLeft(downGroup, teamList.team2, 0, "end")

/* supporting functions for bars and grid */
function renderQuarter(q, q_fil) {
      upGroup.append("g")
        .attr("class",q_to_class(q))
        .attr("transform",qX(q))
      downGroup.append("g")
        .attr("class",q_to_class(q))
        .attr("transform",qX(q))

      renderBars(team1_fil, upGroup, q, q_fil, ".uBars", "uBars", layout.nsOpacity, barHeight, upBarY)
      renderBars(team1_fil, upGroup, q, q_fil, ".sBars", "sBars", 1, barHeight_S, upBarY_S)
      renderBars(team1_fil, upGroup, q, q_fil, ".xBars", "xBars", 1, barHeight_X, upBarY_X)
      renderBars(team1_fil, upGroup, q, q_fil, ".grid", "grid", 1, barHeight, upBarY)
      renderBars(team2_fil, downGroup, q, q_fil, ".uBars", "uBars", layout.nsOpacity, barHeight, 0)
      renderBars(team2_fil, downGroup, q, q_fil, ".sBars", "sBars", 1, barHeight_S, 0)
      renderBars(team2_fil, downGroup, q, q_fil, ".xBars", "xBars", 1, barHeight_X, 0)
      renderBars(team2_fil, downGroup, q, q_fil, ".grid", "grid", 1, barHeight, 0)
      renderLabels(q)
      renderPoints(team1_fil, upGroup, q, q_fil, ".points", "points", upPointsY)
      renderPoints(team2_fil, downGroup, q, q_fil, ".points", "points", downPointsY)
}
function renderBars(team_fil, up_down, q, q_fil, bar_cl_sel, bar_cl_set, bar_o, bar_height, bar_y) {
      up_down.select(q_to_class_sel(q))
      .append("g")
      .attr("class",bar_cl_set)
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
function renderGridHz(item) {
      upLines.append("line")
      .attr("class","grid")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",gridHzY(item))
      .attr("y2",gridHzY(item))

      downLines.append("line")
      .attr("class","grid")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",gridHzY(item))
      .attr("y2",gridHzY(item))
}
function gridHzY(grid_num) {
      return barMaxHeight - grid_num * playHeight
}

/* axis labels and label lines */
function renderLabels(q) {
      axisGroup.append("g")
      .attr("class",q_to_class(q))
      .attr("transform",qX(q))

      renderLabel(q, 0, "axis-labels", q_to_label(q))
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
function renderPoints(team_fil, up_down, q, q_fil, points_cl_sel, points_cl_set, points_y) {
      up_down.select(q_to_class_sel(q))
      .append("g")
      .attr("class","points-group")
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
function teamTitlesCent(up_down, team, y_pos) {
      up_down.append("text")
      .text(team)
      .attr("class","teamTitle")
      .attr("text-anchor","middle")
      .attr("fill",teamColor(team))
      .attr("x",chartWidth / 2)
      .attr("y",y_pos)
      .style("visibility",teamTitlesCentVis)
}
function teamTitlesLeft(up_down, team, y_pos, anchor) {
      up_down.append("text")
      .text(team)
      .attr("class","teamTitle")
      .attr("text-anchor",anchor)
      .attr("fill",teamColor(team))
      .attr("x",0)
      .attr("y",y_pos)
      .style("writing-mode","tb")
      .style("visibility",teamTitlesLeftVis)
}

} //end of building chart in d3
