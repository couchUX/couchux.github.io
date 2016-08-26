/* select what csv should be run */
var csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU_RunRate_Cume.csv"
runRateChart(csv_url);

/* team colors */
var teamColors = {
  "Alabama": "#C31C45",
}

/* defining the main chart functions */
function runRateChart(data_url) {
  d3.csv(data_url, csv_response)
}
function csv_response(error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    runRateData = data
    render_chart()
  }
}

/* render d3 chart */
function render_chart() {

/* responsiveness prep */
responsive = function(w) {
  if (w < rArrays.rWidths[0]) {
    return 0
    }
  else if (w < rArrays.rWidths[1]) {
    return 1
    }
  else if (w < rArrays.rWidths[2]) {
    return 2
    }
  else {
    return 3
  }
} // how to avoid nested IFs here? Maybe use an array here too?

var layout = {
    btwCharts: 24,
    rateScale: .75,
    srScale: .75,
    rateAvg: .5,
    srAvg: .42,
    lineStrokeW: 3,
    gridStrokeW: 1.5,
    gridStrokeW_thick: 3,
    gridKeyStrokeW: 1.5,
    percentYadj: 13,
    percentXadj: 3,
    quartersYadj: 6,
    quartersXadj: 5,
}
var rArrays = {
    rWidths:       [380, 550, 680],
    whMulti:       [.53, .4, .27, .22],
    chartWidthAdj: [1,1,.5,.5]
}
/* margins, widths, and X positions */
var allWidth = document.getElementById("runRate-charts-container").offsetWidth
    chartWidth = allWidth * rArrays.chartWidthAdj[responsive(allWidth)]
    rateChartHeight = allWidth * rArrays.whMulti[responsive(allWidth)]
    srChartHeight = rateChartHeight
    chartHeight = rateChartHeight + srChartHeight + layout.btwCharts
    maxIndex = d3.max(runRateData,function(d,i) { return i })
    lineX = function(d,i) {
      return i / maxIndex * chartWidth
    }
    gridX = function(item) {
      return chartWidth * item
    }

/* heights and Y positions */
    srGroupY = function() {
      return "translate(0," + (rateChartHeight + layout.btwCharts) + ")"
    }
    rateGridY = function(item) {
      return rateChartHeight - (item * rateChartHeight / layout.rateScale)
    }
    srGridY = function(item) {
      return srChartHeight - (item * srChartHeight / layout.srScale)
    }
    srGuideY = function() {
      return srChartHeight - (layout.srAvg * srChartHeight / layout.srScale)
    }
    runRateY = function(d,i) {
      return rateChartHeight - (d.RunRate_cume * rateChartHeight / layout.rateScale)
    }
    runSRY = function(d,i) {
      return srChartHeight - (d.Run_SR_cume * srChartHeight / layout.srScale)
    }
    passSRY = function(d,i) {
      return srChartHeight - (d.Pass_SR_cume * srChartHeight / layout.srScale)
    }

/* color selections */
    teamColor = function(team_name) {
      return teamColors[team_name]
    }
    barColor = function(d,i) {
        return teamColor(d.Team)
    }
    gridWidthVert = layout.gridStrokeW
    gridColorVert = "#242424"
    gridClassVert = "gridLine"
    gridWidthHz = layout.gridStrokeW_thick
    gridColorHz = "white"
    gridClassHz = "gridLine_white"

/* naming and such */
function quarterNameFn(name) {
  return quarterNames[name]
}
var quarterNames = {
    .25:"thru Q1",
    .5:"thru Q2",
    .75:"thru Q3",
    1:"game"
}
function percentNameFn(name) {
  return percentNames[name]
}
var percentNames = {
    .25:"25",
    .5:"50",
    .75:"75%",
}
/* actually building the chart in d3 */
var svg = d3.select("#runRate-charts-container")
      .append("svg")
      .attr("width",chartWidth)
      .attr("height",chartHeight)

/* defining groups/sections */
    allGroups = svg.append("g")
      .attr("id","all-groups")
    rateGroup = allGroups.append("g")
      .attr("id","rate-group")
    srGroup = allGroups.append("g")
      .attr("id","sr-group")
      .attr("transform",srGroupY)

/* draw chart backgrounds */
    rateGroup.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",rateChartHeight)
    srGroup.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",srChartHeight)

/* draw grid */
var grid_nums_x = [.25,.5,.75]
grid_nums_x.forEach(gridVert)

var grid_nums_x_text = [.25,.5,.75,1]
grid_nums_x_text.forEach(quarterText)

var grid_nums_y = [.25,.5,.75]
grid_nums_y.forEach(rateGridHz)
grid_nums_y.forEach(srGridHz)

var grid_nums_y_text = [.25,.5,.75]
grid_nums_y_text.forEach(rateTextPcs)
grid_nums_y_text.forEach(srTextPcs)

function rateGridHz(item) {
    rateGroup.append("line")
      .attr("class",gridClassHz)
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",rateGridY(item))
      .attr("y2",rateGridY(item))
      .style("stroke",gridColorHz)
      .style("stroke-width",gridWidthHz)
}
function rateTextPcs(item) {
    rateGroup.append("text")
      .attr("class","gridText")
      .attr("x",layout.percentXadj)
      .attr("y",rateGridY(item) + layout.percentYadj)
      .text(percentNameFn(item))
}
function srGridHz(item) {
    srGroup.append("line")
      .attr("class",gridClassHz)
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",srGridY(item))
      .attr("y2",srGridY(item))
      .style("stroke",gridColorHz)
      .style("stroke-width",gridWidthHz)
}
function srTextPcs(item) {
      srGroup.append("text")
      .attr("class","gridText")
      .attr("x",layout.percentXadj)
      .attr("y",srGridY(item) + layout.percentYadj)
      .text(percentNameFn(item))
}
function gridVert(item) {
    rateGroup.append("line")
      .attr("class",gridClassVert)
      .attr("x1",gridX(item))
      .attr("x2",gridX(item))
      .attr("y1",0)
      .attr("y2",rateChartHeight)
      .style("stroke",gridColorVert)
      .style("stroke-width",gridWidthVert)
    srGroup.append("line")
      .attr("class",gridClassVert)
      .attr("x1",gridX(item))
      .attr("x2",gridX(item))
      .attr("y1",0)
      .attr("y2",srChartHeight)
      .style("stroke",gridColorVert)
      .style("stroke-width",gridWidthVert)
}
function quarterText(item) {
    rateGroup.append("text")
      .attr("class","gridText")
      .attr("x",gridX(item) - layout.quartersXadj)
      .attr("y",srChartHeight - layout.quartersYadj)
      .attr("text-anchor","end")
      .text(quarterNameFn(item))
    srGroup.append("text")
      .attr("class","gridText")
      .attr("x",gridX(item) - layout.quartersXadj)
      .attr("y",srChartHeight - layout.quartersYadj)
      .attr("text-anchor","end")
      .text(quarterNameFn(item))
}

/* draw lines */
    runRateLineFn = d3.line()
      .x(lineX)
      .y(runRateY)
      .curve(d3.curveBasis)
    runSRLineFn = d3.line()
      .x(lineX)
      .y(runSRY)
      .curve(d3.curveBasis)
    passSRLineFn = d3.line()
      .x(lineX)
      .y(passSRY)
      .curve(d3.curveBasis)

    runRateLine = rateGroup.append("path")
      .attr("d",runRateLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    runSRLine = srGroup.append("path")
      .attr("d",runSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    passSRLine = srGroup.append("path")
      .attr("d",passSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("opacity",0.4)
      .attr("fill","none")

/* draw key gridlines */
    srGroup.append("line")
      .attr("class","leagueSRline")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",srGuideY)
      .attr("y2",srGuideY)
      .style("stroke","#242424")
      .style("stroke-width",layout.gridKeyStrokeW)
      .style("stroke-dasharray","5,5")
      .style("d","M5 20 l215 0")

} //end of building chart in d3
