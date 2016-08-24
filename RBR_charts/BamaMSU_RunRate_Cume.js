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
}
var rArrays = {
    rWidths:          [380, 550, 680],
}
    /* margins, widths, and X positions */
var allWidth = document.getElementById("runRate-charts-container").offsetWidth
    chartWidth = allWidth
    rateChartHeight = chartWidth * layout.rateChartHeightMulti
    srChartHeight = chartWidth * layout.srChartHeightMulti
    axisHeight = 12
    chartHeight = rateChartHeight + srChartHeight + axisHeight
    maxIndex = d3.max(runRateData,function(d,i) { return (i + 1) })
    lineX = function(d,i) {
      return (i + 1) / maxIndex * chartWidth
    }

    /* heights and Y positions */
    srGroupY = function() {
      return "translate(0," + rateChartHeight + ")"
    }
    axisGroupY = function() {
      return "translate(0," + (rateChartHeight + srChartHeight) + ")"
    }
    runRateY = function(d,i) {
      return rateChartHeight - (d.RunRate_cume * rateChartHeight)
    }
    runSRY = function(d,i) {
      return srChartHeight - (d.Run_SR_cume * srChartHeight)
    }
    passSRY = function(d,i) {
      return srChartHeight - (d.Pass_SR_cume * srChartHeight)
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
      .attr("stroke-width",3)
      .attr("fill","none")

    runSRLine = srGroup.append("path")
      .attr("d",runSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",3)
      .attr("opacity",0.8)
      .attr("fill","none")

    passSRLine = srGroup.append("path")
      .attr("d",passSRLineFn(runRateData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",3)
      .attr("opacity",0.5)
      .attr("fill","none")

} //end of building chart in d3
