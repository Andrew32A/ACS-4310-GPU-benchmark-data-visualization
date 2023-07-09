// set the dimensions and margins of the graph
let margin = { top: 20, right: 30, bottom: 50, left: 60 };
let width = window.innerWidth - margin.left - margin.right;
let height = window.innerHeight - margin.top - margin.bottom;

// create a function to update the dimensions
function updateDimensions() {
  width = window.innerWidth - margin.left - margin.right;
  height = window.innerHeight - margin.top - margin.bottom;

  // need to call a function to redraw or update the graph here
}

window.addEventListener("resize", updateDimensions);
updateDimensions();

// append the SVG element to the body of the page
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// read the CSV data
d3.csv("./data/benchmarks.csv").then(function (data) {
  // format the data
  data.forEach(function (d) {
    d.G3Dmark = +d.G3Dmark;
    d.G2Dmark = +d.G2Dmark;
    d.price = +d.price;
  });

  // set the categories (x-axis)
  const categories = data.map(function (d) {
    return d.gpuName;
  });

  // set the color scale
  const color = d3
    .scaleOrdinal()
    .domain(["G3Dmark", "G2Dmark", "Price"])
    .range(["#2C82C9", "#F2B134", "#E64B35"]);

  // stack the data
  const stackedData = d3
    .stack()
    .keys(["G3Dmark", "G2Dmark", "Price"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)(data);

  // set the x and y scales
  const x = d3.scaleBand().domain(categories).range([0, width]).padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(stackedData, function (d) {
        return d3.max(d, function (d) {
          return d[1];
        });
      }),
    ])
    .range([height, 0]);

  // create the stacked bars
  svg
    .selectAll(".series")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "series")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data.gpuName);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

  // add the x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("y", 10)
    .attr("x", -10)
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // add the y-axis
  svg.append("g").call(d3.axisLeft(y));

  // add the legend
  const legend = svg
    .selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      return d;
    });
});
