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
let leftGPUData = null;
let rightGPUData = null;

const properties = [
  "G3Dmark",
  "G2Dmark",
  "price",
  "gpuValue",
  "TDP",
  "powerPerformance",
  "testDate",
];
const color = d3.scaleOrdinal().domain(properties).range(d3.schemeTableau10);

// load the dataset from file
d3.csv("./data/benchmarks.csv").then((data) => {
  // parse the CSV data into an array of objects
  dataset = data;
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
    leftGPUData = selectedGPU;

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information for the left side
    leftCardContainer.innerHTML = `
      <div class="leftCardContent">
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

    // create comparison chart
    createComparisonChart();

    // make the left card container visible
    leftCardContainer.style.opacity = "1";

    // move the left search bar to the left
    document
      .querySelector(".leftSearchBarContainer")
      .classList.add("movedLeft");
  } else {
    alert("No GPU found with the given name on the left search bar!");
  }
}

function displayRightGPUData() {
  const gpuName = rightSearchBar.value.trim();
  const selectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === gpuName.toLowerCase()
  );

  if (selectedGPU) {
    rightGPUData = selectedGPU;

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information for the right side
    rightCardContainer.innerHTML = `
      <div class="rightCardContent">
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

    // create comparison chart
    createComparisonChart();

    // make the right card container visible
    rightCardContainer.style.opacity = "1";

    // move the right search bar to the right
    document
      .querySelector(".rightSearchBarContainer")
      .classList.add("movedRight");
  } else {
    alert("No GPU found with the given name on the right search bar!");
  }
}

function createComparisonChart() {
  if (leftGPUData && rightGPUData) {
    chartContainer.innerHTML = "";

    const margin = { top: 50, right: 20, bottom: 30, left: 40 };
    let width = 400 - margin.left - margin.right;
    let height = 200 - margin.top - margin.bottom;

    properties.forEach((property, i) => {
      const data = [leftGPUData, rightGPUData];

      const maxVal = Math.max(+leftGPUData[property], +rightGPUData[property]);
      const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, width]);

      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.gpuName))
        .range([height, 0])
        .padding(0.1);

      const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d) => yScale(d.gpuName))
        .attr("width", (d) => xScale(d[property]))
        .attr("height", yScale.bandwidth())
        .attr("fill", color(property));

      const xAxis = d3.axisBottom(xScale);
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      const yAxis = d3.axisLeft(yScale);
      svg.append("g").attr("class", "y-axis").call(yAxis);

      // chart title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(property);
    });
  }
}
