function runPass_charts(csv_url, team_1, team_2) {

var team1 = team_1
var team2 = team_2

get_runPass_data(csv_url)

function get_runPass_data(url) {
  d3.csv(url, csv_response)
}
function csv_response(error, data) {
  if (error) {
    console.error(error)
  }
  else {
    console.log("data loaded")
    runPassData = data
    render_runPass_charts()
  }
}

/* render d3 charts */
function render_runPass_charts() {

/* set up containers and backgrounds */
var rateSvg = d3.select("#runPass-rate-chart")
  .append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
var rateBg = rateSvg.append("rect")
  .attr("class","runPass-bg")
var srSvg = d3.select("#runPass-sr-chart")
  .append("svg")
  .attr("class","runPass-svg")
  .attr("width","100%")
  .attr("height","100%")
var srBg = srSvg.append("rect")
  .attr("class","runPass-bg")

/* draw grid */
var runRateMax = d3.max(runPassData.filter(function(d,i) { return d.Team = team1 }),function(d,i) { return +d.RunRate_cume })
var runSrMax = d3.max(runPassData.filter(function(d,i) { return d.Team = team1 }),function(d,i) { return +d.SR_run_cume })
var passSrMax = d3.max(runPassData.filter(function(d,i) { return d.Team = team1 }),function(d,i) { return +d.SR_pass_cume })
var heightMax = Math.max(runRateMax,runSrMax,passSrMax)
function heightAdj() {
  if (heightMax >= 0.75){
    return heightMax
    }
  else {
    return .75
  }
}
var yScale = d3.scaleLinear()
  .domain([0,1])
  .range([1,0])
function yPercent(y) {
  return yScale(y) * 100 + "%"
}
var grid_hz_arr = [.25,.5,.75]
grid_hz_arr.forEach(gridHz)

function gridHz(item) {
  rateSvg.append("line")
    .attr("class","grid-hz")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(item))
    .attr("y2",yPercent(item))
  srSvg.append("line")
    .attr("class","grid-hz")
    .attr("x1",0)
    .attr("x2","100%")
    .attr("y1",yPercent(item))
    .attr("y2",yPercent(item))
}
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
      .attr("d",runRateLineFn(runPassData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    runSRLine = srSvg.append("path")
      .attr("d",runSRLineFn(runPassData))
      .attr("stroke",teamColors.Alabama)
      .attr("stroke-width",layout.lineStrokeW)
      .attr("fill","none")
    passSRLine = srSvg.append("path")
      .attr("d",passSRLineFn(runPassData))
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

}
}
