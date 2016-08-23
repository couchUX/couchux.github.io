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
    rateChartHeightMulti: 0.4,
    srChartHeightMulti: 0.6,
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

    /* heights and Y positions */
    srGroupY = function() {
      return "translate(0," + rateChartHeight + ")"
    }
    axisGroupY = function() {
      return "translate(0," + (rateChartHeight + srChartHeight) + ")"
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

} //end of building chart in d3
