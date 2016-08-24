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
    rateChartHeightMulti: 0.15,
    srChartHeightMulti: 0.3,
    btwCharts: 12,
    srScale: .8,
    rateAvg: .5,
    srAvg: .42,
    lineStrokeW: 2.5,
}
var rArrays = {
    rWidths:      [380, 550, 680],
    rateWHMulti:  [0.3, 0.2, 0.15],
    srWHMulti:    [0.5, 0.4, 0.3]
}
    /* margins, widths, and X positions */
var allWidth = document.getElementById("runRate-charts-container").offsetWidth
    chartWidth = allWidth
    rateChartHeight = chartWidth * rArrays.rateWHMulti[responsive(allWidth)]
    srChartHeight = chartWidth * rArrays.srWHMulti[responsive(allWidth)]
    axisHeight = 12
    chartHeight = rateChartHeight + srChartHeight + axisHeight + layout.btwCharts
    maxIndex = d3.max(runRateData,function(d,i) { return i })
    lineX = function(d,i) {
      return i / maxIndex * chartWidth
    }

    /* heights and Y positions */
    srGroupY = function() {
      return "translate(0," + (rateChartHeight + layout.btwCharts) + ")"
    }
    axisGroupY = function() {
      return "translate(0," + (rateChartHeight + srChartHeight) + ")"
    }
    runRateGuideY = function(d,i) {
      return rateChartHeight - (layout.rateAvg * rateChartHeight)
    }
    srGuideY = function(d,i) {
      return srChartHeight - (layout.srAvg * srChartHeight / layout.srScale)
    }
    runRateY = function(d,i) {
      return rateChartHeight - (d.RunRate_cume * rateChartHeight)
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
    axisGroup = allGroups.append("g")
      .attr("id","axis-group")
      .attr("transform",axisGroupY)

/* chart backgrounds */
    rateGroup.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",rateChartHeight)
    rateGroup.append("line")
      .attr("class","leagueSRline")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",runRateGuideY)
      .attr("y2",runRateGuideY)
      .style("stroke","#242424")
      .style("stroke-width",2)
      .style("stroke-dasharray","5,5")
      .style("d","M5 20 l215 0")
    srGroup.append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",srChartHeight)
    srGroup.append("line")
      .attr("class","leagueSRline")
      .attr("x1",0)
      .attr("x2",chartWidth)
      .attr("y1",srGuideY)
      .attr("y2",srGuideY)
      .style("stroke","#242424")
      .style("stroke-width",2)
      .style("stroke-dasharray","5,5")
      .style("d","M5 20 l215 0")

/* draw lines */
    runRateLineFn = d3.line()
      .x(lineX)
      .y(runRateY)
      .curve(d3.curveMonotoneX)
    runSRLineFn = d3.line()
      .x(lineX)
      .y(runSRY)
      .curve(d3.curveMonotoneX)
    passSRLineFn = d3.line()
      .x(lineX)
      .y(passSRY)
      .curve(d3.curveMonotoneX)

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

} //end of building chart in d3
