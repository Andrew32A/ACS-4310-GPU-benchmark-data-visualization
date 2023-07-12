const leftSearchBar = document.getElementById("leftSearchBar");
const rightSearchBar = document.getElementById("rightSearchBar");
const searchButton = document.getElementById("searchButton");
const suggestionsList = document.getElementById("suggestions");
const chartContainer = document.getElementById("chart");
const leftCardContainer = document.getElementById("leftCardContainer");
const rightCardContainer = document.getElementById("rightCardContainer");
let dataset = [];

// load the dataset from file
d3.text("./data/benchmarks.csv").then((data) => {
  // parse the CSV data into an array of objects
  const lines = data.split("\n");
  const headers = lines[0].split(",");
  dataset = lines.slice(1).map((line) => {
    const values = line.split(",");
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    return entry;
  });
});

// add event listeners
leftSearchBar.addEventListener("input", handleSearchInput);
rightSearchBar.addEventListener("input", handleSearchInput);

searchButton.addEventListener("click", displayGPUData);

document.addEventListener("click", function (event) {
  if (
    !leftSearchBar.contains(event.target) &&
    !rightSearchBar.contains(event.target)
  ) {
    suggestionsList.style.display = "none";
  }
});

suggestionsList.addEventListener("click", function (event) {
  const selectedGpuName = event.target.textContent;
  leftSearchBar.value = selectedGpuName;
  rightSearchBar.value = selectedGpuName;
  suggestionsList.style.display = "none";
  displayGPUData();
});

// handle search input for both search bars
function handleSearchInput() {
  const inputValue = this.value.toLowerCase();
  const suggestions = dataset.filter((item) =>
    item.gpuName.toLowerCase().includes(inputValue)
  );

  suggestionsList.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion.gpuName;
    suggestionsList.appendChild(li);
  });

  if (suggestions.length > 0) {
    suggestionsList.style.display = "block";
  } else {
    suggestionsList.style.display = "none";
  }
}

// display GPU data (cards and chart)
function displayGPUData() {
  const leftGpuName = leftSearchBar.value.trim();
  const rightGpuName = rightSearchBar.value.trim();

  const leftSelectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === leftGpuName.toLowerCase()
  );

  const rightSelectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === rightGpuName.toLowerCase()
  );

  if (leftSelectedGPU && rightSelectedGPU) {
    const leftGpuData = Object.entries(leftSelectedGPU).filter(
      ([key]) => key !== "gpuName" && key !== "category"
    );

    const rightGpuData = Object.entries(rightSelectedGPU).filter(
      ([key]) => key !== "gpuName" && key !== "category"
    );

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information for the left side
    leftCardContainer.innerHTML = `
      <div class="card">
        <h2>${leftSelectedGPU.gpuName}</h2>
        <p><span class="label">G3Dmark:</span> <span class="value">${leftSelectedGPU.G3Dmark}</span></p>
        <p><span class="label">G2Dmark:</span> <span class="value">${leftSelectedGPU.G2Dmark}</span></p>
        <p><span class="label">Price:</span> <span class="value">$${leftSelectedGPU.price}</span></p>
        <p><span class="label">GPU Value:</span> <span class="value">${leftSelectedGPU.gpuValue}</span></p>
        <p><span class="label">TDP:</span> <span class="value">${leftSelectedGPU.TDP}</span></p>
        <p><span class="label">Power Performance:</span> <span class="value">${leftSelectedGPU.powerPerformance}</span></p>
        <p><span class="label">Test Date:</span> <span class="value">${leftSelectedGPU.testDate}</span></p>
      </div>
    `;

    // create card with GPU information for the right side
    rightCardContainer.innerHTML = `
      <div class="card">
        <h2>${rightSelectedGPU.gpuName}</h2>
        <p><span class="label">G3Dmark:</span> <span class="value">${rightSelectedGPU.G3Dmark}</span></p>
        <p><span class="label">G2Dmark:</span> <span class="value">${rightSelectedGPU.G2Dmark}</span></p>
        <p><span class="label">Price:</span> <span class="value">$${rightSelectedGPU.price}</span></p>
        <p><span class="label">GPU Value:</span> <span class="value">${rightSelectedGPU.gpuValue}</span></p>
        <p><span class="label">TDP:</span> <span class="value">${rightSelectedGPU.TDP}</span></p>
        <p><span class="label">Power Performance:</span> <span class="value">${rightSelectedGPU.powerPerformance}</span></p>
        <p><span class="label">Test Date:</span> <span class="value">${rightSelectedGPU.testDate}</span></p>
      </div>
    `;

    // create bar chart
    createBarChart(leftSelectedGPU, rightSelectedGPU);
  }
}

// create bar chart
function createBarChart(leftGPU, rightGPU) {
  const chartContainer = document.getElementById("chart");
  const width = chartContainer.offsetWidth;
  const height = chartContainer.offsetHeight;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const maxG3Dmark = Math.max(leftGPU.G3Dmark, rightGPU.G3Dmark);

  const xScale = d3
    .scaleLinear()
    .domain([0, maxG3Dmark])
    .range([0, width - 100]);

  const yScale = d3
    .scaleBand()
    .domain([leftGPU.gpuName, rightGPU.gpuName])
    .range([0, height - 50]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(50, " + (height - 50) + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(50, 0)")
    .call(yAxis);

  svg
    .selectAll(".bar.left")
    .data([leftGPU])
    .enter()
    .append("rect")
    .attr("class", "bar left")
    .attr("x", 50)
    .attr("y", (d) => yScale(d.gpuName))
    .attr("width", (d) => xScale(d.G3Dmark))
    .attr("height", yScale.bandwidth());

  svg
    .selectAll(".bar.right")
    .data([rightGPU])
    .enter()
    .append("rect")
    .attr("class", "bar right")
    .attr("x", 50)
    .attr("y", (d) => yScale(d.gpuName))
    .attr("width", (d) => xScale(d.G3Dmark))
    .attr("height", yScale.bandwidth());

  svg
    .selectAll(".label.left")
    .data([leftGPU])
    .enter()
    .append("text")
    .attr("class", "label left")
    .attr("x", (d) => xScale(d.G3Dmark) + 60)
    .attr("y", (d) => yScale(d.gpuName) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text((d) => d.G3Dmark);

  svg
    .selectAll(".label.right")
    .data([rightGPU])
    .enter()
    .append("text")
    .attr("class", "label right")
    .attr("x", (d) => xScale(d.G3Dmark) + 60)
    .attr("y", (d) => yScale(d.gpuName) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text((d) => d.G3Dmark);
}
