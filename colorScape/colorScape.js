function colorScape() {

colorArray = [
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
  Math.random(),
]

var colorScale = d3.scaleLinear()
  .domain([0,1])
  .range(["#2b6fdb","#e82949"])

d3.select("#outer").selectAll("div").data(colorArray).enter().append("div")
  .attr("class","block")
  .style("background",function(d) { return colorScale(d) })
}
