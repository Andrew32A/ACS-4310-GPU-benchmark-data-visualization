const leftSearchBar = document.getElementById("leftSearchBar");
const rightSearchBar = document.getElementById("rightSearchBar");
const leftSuggestionsList = document.getElementById("leftSuggestions");
const rightSuggestionsList = document.getElementById("rightSuggestions");
const leftSearchButton = document.getElementById("leftSearchButton");
const rightSearchButton = document.getElementById("rightSearchButton");
const leftCardContainer = document.getElementById("leftCardContainer");
const rightCardContainer = document.getElementById("rightCardContainer");
const chartContainer = document.getElementById("chart");
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
leftSearchButton.addEventListener("click", displayLeftGPUData);
rightSearchButton.addEventListener("click", displayRightGPUData);

document.addEventListener("click", function (event) {
  if (
    !leftSearchBar.contains(event.target) &&
    !rightSearchBar.contains(event.target)
  ) {
    leftSuggestionsList.style.display = "none";
    rightSuggestionsList.style.display = "none";
  }
});

leftSuggestionsList.addEventListener("click", function (event) {
  leftSearchBar.value = event.target.textContent;
  leftSuggestionsList.style.display = "none";
  displayLeftGPUData();
});

rightSuggestionsList.addEventListener("click", function (event) {
  rightSearchBar.value = event.target.textContent;
  rightSuggestionsList.style.display = "none";
  displayRightGPUData();
});

leftSearchBar.addEventListener("input", function () {
  const inputValue = this.value.toLowerCase();
  const suggestions = dataset.filter((item) =>
    item.gpuName.toLowerCase().includes(inputValue)
  );

  leftSuggestionsList.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion.gpuName;
    leftSuggestionsList.appendChild(li);
  });

  if (suggestions.length > 0) {
    leftSuggestionsList.style.display = "block";
  } else {
    leftSuggestionsList.style.display = "none";
  }
});

rightSearchBar.addEventListener("input", function () {
  const inputValue = this.value.toLowerCase();
  const suggestions = dataset.filter((item) =>
    item.gpuName.toLowerCase().includes(inputValue)
  );

  rightSuggestionsList.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion.gpuName;
    rightSuggestionsList.appendChild(li);
  });

  if (suggestions.length > 0) {
    rightSuggestionsList.style.display = "block";
  } else {
    rightSuggestionsList.style.display = "none";
  }
});

function displayLeftGPUData() {
  const gpuName = leftSearchBar.value.trim();
  const selectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === gpuName.toLowerCase()
  );

  if (selectedGPU) {
    const gpuData = Object.entries(selectedGPU).filter(
      ([key]) => key !== "gpuName" && key !== "category"
    );

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information for the left side
    leftCardContainer.innerHTML = `
      <div class="card">
        <h2>${selectedGPU.gpuName}</h2>
        <p><span class="label">G3Dmark:</span> <span class="value">${selectedGPU.G3Dmark}</span></p>
        <p><span class="label">G2Dmark:</span> <span class="value">${selectedGPU.G2Dmark}</span></p>
        <p><span class="label">Price:</span> <span class="value">$${selectedGPU.price}</span></p>
        <p><span class="label">GPU Value:</span> <span class="value">${selectedGPU.gpuValue}</span></p>
        <p><span class="label">TDP:</span> <span class="value">${selectedGPU.TDP}</span></p>
        <p><span class="label">Power Performance:</span> <span class="value">${selectedGPU.powerPerformance}</span></p>
        <p><span class="label">Test Date:</span> <span class="value">${selectedGPU.testDate}</span></p>
      </div>
    `;

    // create bar chart
    createBarChart(selectedGPU);
  }
}

function displayRightGPUData() {
  const gpuName = rightSearchBar.value.trim();
  const selectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === gpuName.toLowerCase()
  );

  if (selectedGPU) {
    const gpuData = Object.entries(selectedGPU).filter(
      ([key]) => key !== "gpuName" && key !== "category"
    );

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information for the right side
    rightCardContainer.innerHTML = `
      <div class="card">
        <h2>${selectedGPU.gpuName}</h2>
        <p><span class="label">G3Dmark:</span> <span class="value">${selectedGPU.G3Dmark}</span></p>
        <p><span class="label">G2Dmark:</span> <span class="value">${selectedGPU.G2Dmark}</span></p>
        <p><span class="label">Price:</span> <span class="value">$${selectedGPU.price}</span></p>
        <p><span class="label">GPU Value:</span> <span class="value">${selectedGPU.gpuValue}</span></p>
        <p><span class="label">TDP:</span> <span class="value">${selectedGPU.TDP}</span></p>
        <p><span class="label">Power Performance:</span> <span class="value">${selectedGPU.powerPerformance}</span></p>
        <p><span class="label">Test Date:</span> <span class="value">${selectedGPU.testDate}</span></p>
      </div>
    `;

    // create bar chart
    createBarChart(selectedGPU);
  }
}

function createBarChart(selectedGPU) {
  const chartContainer = document.getElementById("chart");
  const width = chartContainer.offsetWidth;
  const height = chartContainer.offsetHeight;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const maxG3Dmark = selectedGPU.G3Dmark;

  const xScale = d3
    .scaleLinear()
    .domain([0, maxG3Dmark])
    .range([0, width - 100]);

  const yScale = d3
    .scaleBand()
    .domain([selectedGPU.gpuName])
    .range([0, height]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(50, " + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(50, 0)")
    .call(yAxis);

  svg
    .selectAll(".bar")
    .data([selectedGPU])
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 50)
    .attr("y", (d) => yScale(d.gpuName))
    .attr("width", (d) => xScale(d.G3Dmark))
    .attr("height", yScale.bandwidth());

  svg
    .selectAll(".label")
    .data([selectedGPU])
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => xScale(d.G3Dmark) + 60)
    .attr("y", (d) => yScale(d.gpuName) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text((d) => d.G3Dmark);
}
