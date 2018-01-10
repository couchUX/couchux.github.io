/* select what csv should be run */
var srxrq_csv_url = "https://couchux.github.io/RBR_charts/2018_BamaGeorgia/SRXR_quarters/BamaGeorgia_SRXR_Quarters.csv"

/* run the whole chart function */
srxrqCharts()

function srxrqCharts() {
  srxrqChart(srxrq_csv_url, "Alabama", "1")
  srxrqChart(srxrq_csv_url, "Georgia", "2")
}

/* defining the main chart functions */
function srxrqChart(data_url, which_team, what_order) {
  d3.csv(data_url, csv_response.bind(null, which_team).bind(null, what_order))
}

function csv_response(which_team, what_order, error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    data.forEach(function(d) {
      d.SuccessRate = +d.SuccessRate
      if (d.Team == "Georgia") {
        d.Team = "Georgia"
      }
      if (d.Quarter !== "Game") {
        d.Quarter = "Q" + +d.Quarter
      }
      else {
        d.Quarter = d.Quarter
      }
    })
    srxrqData = data.filter(function(row){
      return row.Team == which_team  //try to Filter/reformat ("Transform") outside of data pull
    })

    render_SRXRquarters_chart(which_team, what_order)
  }
}

function render_SRXRquarters_chart(which_team, what_order) {

/* tie chart colors to team names */
var teamColors = {
  "Alabama": "#C31C45",
  "Georgia": "#BA0C2F"
}
    gameColor = "#5C5C5C"

teamColor = function(team_name) {
  return teamColors[team_name]
};

var srxrqChartName = "srxrq-chart"

function selectChartClass() {
  return "." + srxrqChartName + ".chart" + what_order
}
function defineChartClass() {
  return srxrqChartName + " chart" + what_order
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
  barHeight: 32,
  barMarginBoost: 1.1,
  srWidthScale: 0.7,
  leagueSR: 0.4, //update this peridically for NCAA Success Rate averages
  leagueSRwidth: 3,
  qLabelX: 8,
  srLabelX: 24,
  secondLabelX: 40,
  labelYpc: 0.58,
  yAdjust: 24,
  titleAdjust: 8,
  bottomLabelAdj: 0,
}
var rArrays = {
    rWidths:          [380, 550, 680],
    chartWidthAdj:    [1,1,.5,.5],
    chartBtwWidthHz:  [0,0,7,7],
}
var allWidth = document.getElementById("srxr-q-charts-container").offsetWidth
    chartBtwWidthHz = rArrays.chartBtwWidthHz[responsive(allWidth)]
    chartWidth = allWidth * rArrays.chartWidthAdj[responsive(allWidth)] - chartBtwWidthHz - 1
    barHeightMulti = layout.barHeight * layout.barMarginBoost
    labelYadj = barHeightMulti * layout.labelYpc
    yKeys = layout.yAdjust - layout.titleAdjust
    maxIndex = d3.max(srxrqData, function(d,i) { return (i + 1) });
    totalMaxSR = d3.max(srxrqData, function(d,i) { return d.SuccessMax })
    svgHeight = maxIndex * barHeightMulti + layout.yAdjust + layout.bottomLabelAdj
    leagueSRx = layout.leagueSR / totalMaxSR * chartWidth * layout.srWidthScale - layout.leagueSRwidth / 2

    srBarWidth = function(d,i) {
      return d.SuccessRate / totalMaxSR * chartWidth * layout.srWidthScale
    }
    expBarWidth = function(d,i) {
      return d.ExpRate / totalMaxSR * chartWidth * layout.srWidthScale
    }
    barY = function(d,i) {
      return i * barHeightMulti + layout.yAdjust
    }
    labelY = function(d,i) {
      return i * barHeightMulti + labelYadj + layout.yAdjust
    }
    srBarColor = function(d,i) {
      if ( d.Quarter === "Game") {
        return gameColor
      }
      else {
        return teamColor(d.Team)
      }
    }
    returnQ = function(d,i) {
      return d.Quarter
    }
    srPercent = function(d,i) {
      return format.percent(d.SuccessRate)
    }
    expPercent = function(d,i) {
      if( d.ExpRate === "0.00") {
        return ""
      }
        return format.percent(d.ExpRate)
    }
    leagueSRpercent = function() {
      return format.percent(layout.leagueSR)
    }
    marginRightPx = function() {
      return srxrqMarginRight() + "px"
    }
    leagueSRtext = function() {
      return leagueSRpercent() + "*"
    }

var format = {
  percent: d3.format(".0%")
}

/* actually building the chart in d3 */

var teamChart = d3.select("#srxr-q-charts-container")
      .append("div")
      .attr("class",defineChartClass())

    svg = d3.select(selectChartClass())
      .append("svg")
      .attr("class","svgChart")
      .attr("width",chartWidth)
      .attr("height",svgHeight)

    teamTitle = svg.append("text")
      .text(which_team)
      .style("fill",teamColor(which_team))
      .attr("class","teamTitle")
      .attr("y",yKeys)

    srKey = svg.append("text")
      .text("SR")
      .attr("class","srKey")
      .attr("text-anchor","middle")
      .attr("x", chartWidth - layout.srLabelX + 2)
      .attr("y",yKeys)

    expKey = svg.append("text")
      .text("XR")
      .attr("class","expKey")
      .attr("text-anchor","middle")
      .attr("x", chartWidth - layout.srLabelX - layout.secondLabelX + 2)
      .attr("y",yKeys)

    leagueSRkey = svg.append("text")
      .text(leagueSRtext)
      .attr("class","leagueKey")
      .attr("text-anchor","middle")
      .attr("x",leagueSRx)
      .attr("y",yKeys)

    backBars = svg.selectAll(".backBar").data(srxrqData).enter()
      .append("rect")
      .attr("class","backBar")
      .attr("width",chartWidth)
      .attr("height",layout.barHeight)
      .attr("y",barY)

    srBars = svg.selectAll(".srBar").data(srxrqData).enter()
      .append("rect")
      .attr("class","backBar")
      .attr("width",srBarWidth)
      .attr("height",layout.barHeight)
      .attr("y",barY)
      .style("fill",srBarColor)

    expBars = svg.selectAll(".expBars").data(srxrqData).enter()
      .append("rect")
      .attr("class","expBars")
      .attr("width",expBarWidth)
      .attr("height",layout.barHeight)
      .attr("y",barY)

    qLabels = svg.selectAll(".qLabels").data(srxrqData).enter()
      .append("text")
      .text(returnQ)
      .attr("class","qLabels")
      .attr("x",layout.qLabelX)
      .attr("y",labelY)

    srLabels = svg.selectAll(".srLabels").data(srxrqData).enter()
      .append("text")
      .text(srPercent)
      .attr("class","srLabels")
      .attr("text-anchor","end")
      .attr("x", chartWidth - layout.qLabelX)
      .attr("y",labelY)

    expLabels = svg.selectAll(".expLabels").data(srxrqData).enter()
      .append("text")
      .text(expPercent)
      .attr("class","expLabels")
      .attr("text-anchor","end")
      .attr("x", chartWidth - layout.qLabelX - layout.secondLabelX)
      .attr("y",labelY)

    leagueSRline = svg.append("line")
      .attr("class","leagueSRline")
      .attr("x1",leagueSRx)
      .attr("x2",leagueSRx)
      .attr("y1",layout.yAdjust)
      .attr("y2",svgHeight - 4)
      .style("stroke","#242424")
      .style("stroke-width",2)
      .style("stroke-dasharray","5,5")
      .style("d","M5 20 l215 0")

/* applying a margin between charts responsively */
    chartBtwMargins = d3.select(".chart1")
      .insert("svg")
      .attr("width",chartBtwWidthHz)
      .attr("height",10)

} //end of building chart in d3
