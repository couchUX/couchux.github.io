/* select what csv should be run */
var runRate_csv_url = "https://couchux.github.io/RBR_charts/2015_BamaMSU/RunRate_cume/2015_BamaMSU_RunRate_Cume.csv"

runRateChart(runRate_csv_url)

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
    render_runRate_chart()
  }
}

/* render d3 chart */
function render_runRate_chart() {

/* team colors */
var teamColors = {
  "Alabama": "#C31C45",
}

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
}

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
    percentYadj: 14,
    percentXadj: 3,
    quartersYadj: 6,
    quartersXadj: 5,
    passSR_opacity: .3,
}
var rArrays = {
    rWidths:          [380, 550, 680],
    whMulti:          [.55, .42, .3, .3],
    chartWidthAdj:    [1,1,.5,.5],
    chartBtwWidthHz:  [0,0,10,10],
}
/* margins, widths, and X positions */
var allWidth = document.getElementById("runRate-charts-container").offsetWidth
    chartBtwWidthHz = rArrays.chartBtwWidthHz[responsive(allWidth)]
    chartWidth = allWidth * rArrays.chartWidthAdj[responsive(allWidth)] - chartBtwWidthHz - 4
    chartHeight = allWidth * rArrays.whMulti[responsive(allWidth)]
    maxIndex = d3.max(runRateData,function(d,i) { return i })
    lineX = function(d,i) {
      return i / maxIndex * chartWidth
    }
    gridX = function(item) {
      return chartWidth * item
    }

/* heights and Y positions */
    srSvgY = function() {
      return "translate(0," + (chartHeight + layout.btwCharts) + ")"
    }
    rateGridY = function(item) {
      return chartHeight - (item * chartHeight / layout.rateScale)
    }
    srGridY = function(item) {
      return chartHeight - (item * chartHeight / layout.srScale)
    }
    srGuideY = function() {
      return chartHeight - (layout.srAvg * chartHeight / layout.srScale)
    }
    runRateY = function(d,i) {
      return chartHeight - (d.RunRate_cume * chartHeight / layout.rateScale)
    }
    runSRY = function(d,i) {
      return chartHeight - (d.Run_SR_cume * chartHeight / layout.srScale)
    }
    passSRY = function(d,i) {
      return chartHeight - (d.Pass_SR_cume * chartHeight / layout.srScale)
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
function srAvgText() {
  return +layout.srAvg * 100 + "%*"
}
/* actually building the chart in d3 */
var rateSvg = d3.select("#runRate-chart")
      .append("svg")
      .attr("width",chartWidth)
      .attr("height",chartHeight)
    chartBtwMargins = d3.select("#runRate-chart")
      .insert("svg")
      .attr("width",chartBtwWidthHz)
      .attr("height",10)
    srSvg = d3.select("#srRP-chart")
      .append("svg")
      .attr("width",chartWidth)
      .attr("height",chartHeight)

/* draw chart backgrounds */
    rateSvg.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",chartHeight)
    srSvg.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",chartHeight)

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
    rateSvg.append("line")
      .attr("class",gridClassHz)
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",rateGridY(item))
      .attr("y2",rateGridY(item))
      .style("stroke",gridColorHz)
      .style("stroke-width",gridWidthHz)
}
function rateTextPcs(item) {
    rateSvg.append("text")
      .attr("class","gridText")
      .attr("x",layout.percentXadj)
      .attr("y",rateGridY(item) + layout.percentYadj)
      .text(percentNameFn(item))
}
function srGridHz(item) {
    srSvg.append("line")
      .attr("class",gridClassHz)
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",srGridY(item))
      .attr("y2",srGridY(item))
      .style("stroke",gridColorHz)
      .style("stroke-width",gridWidthHz)
}
function srTextPcs(item) {
    srSvg.append("text")
      .attr("class","gridText")
      .attr("x",layout.percentXadj)
      .attr("y",srGridY(item) + layout.percentYadj)
      .text(percentNameFn(item))
}
function gridVert(item) {
    rateSvg.append("line")
      .attr("class",gridClassVert)
      .attr("x1",gridX(item))
      .attr("x2",gridX(item))
      .attr("y1",0)
      .attr("y2",chartHeight)
      .style("stroke",gridColorVert)
      .style("stroke-width",gridWidthVert)
    srSvg.append("line")
      .attr("class",gridClassVert)
      .attr("x1",gridX(item))
      .attr("x2",gridX(item))
      .attr("y1",0)
      .attr("y2",chartHeight)
      .style("stroke",gridColorVert)
      .style("stroke-width",gridWidthVert)
}
function quarterText(item) {
    rateSvg.append("text")
      .attr("class","gridText")
      .attr("x",gridX(item) - layout.quartersXadj)
      .attr("y",chartHeight - layout.quartersYadj)
      .attr("text-anchor","end")
      .text(quarterNameFn(item))
    srSvg.append("text")
      .attr("class","gridText")
      .attr("x",gridX(item) - layout.quartersXadj)
      .attr("y",chartHeight - layout.quartersYadj)
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

    runRateLine = rateSvg.append("path")
      .attr("d",runRateLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    runSRLine = srSvg.append("path")
      .attr("d",runSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    passSRLine = srSvg.append("path")
      .attr("d",passSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("opacity",layout.passSR_opacity)
      .attr("fill","none")

/* draw key line */
    srSvg.append("line")
      .attr("class","leagueSRline")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",srGuideY)
      .attr("y2",srGuideY)
      .style("stroke","#242424")
      .style("stroke-width",layout.gridKeyStrokeW)
      .style("stroke-dasharray","5,5")
      .style("d","M5 20 l215 0")
    srSvg.append("text")
      .attr("class","gridText")
      .attr("text-anchor","end")
      .attr("x",chartWidth - layout.percentXadj)
      .attr("y",srGuideY() + layout.percentYadj)
      .text(srAvgText)

} //end of building chart in d3
