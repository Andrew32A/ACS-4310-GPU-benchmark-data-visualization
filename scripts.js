const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const suggestionsList = document.getElementById("suggestions");
const chartContainer = document.getElementById("chart");
const cardContainer = document.getElementById("cardContainer");
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
searchBar.addEventListener("input", function () {
  const inputValue = searchBar.value.toLowerCase();
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
});

searchButton.addEventListener("click", displayGPUData);

document.addEventListener("click", function (event) {
  if (!searchBar.contains(event.target)) {
    suggestionsList.style.display = "none";
  }
});

suggestionsList.addEventListener("click", function (event) {
  searchBar.value = event.target.textContent;
  suggestionsList.style.display = "none";
  displayGPUData();
});

function displayGPUData() {
  const gpuName = searchBar.value.trim();
  const selectedGPU = dataset.find(
    (item) => item.gpuName.toLowerCase() === gpuName.toLowerCase()
  );

  if (selectedGPU) {
    const gpuData = Object.entries(selectedGPU).filter(
      ([key]) => key !== "gpuName" && key !== "category"
    );

    // clear previous chart
    chartContainer.innerHTML = "";

    // create card with GPU information
    cardContainer.innerHTML = `
        <div class="card">
          <h2>${selectedGPU.gpuName}</h2>
          <p><span class="label">G3Dmark:</span> <span class="value">${selectedGPU.G3Dmark}</span></p>
          <p><span class="label">G2Dmark:</span> <span class="value">${selectedGPU.G2Dmark}</span></p>
          <p><span class="label">Price:</span> <span class="value">${selectedGPU.price}</span></p>
          <p><span class="label">GPU Value:</span> <span class="value">${selectedGPU.gpuValue}</span></p>
          <p><span class="label">TDP:</span> <span class="value">${selectedGPU.TDP}</span></p>
          <p><span class="label">Power Performance:</span> <span class="value">${selectedGPU.powerPerformance}</span></p>
          <p><span class="label">Test Date:</span> <span class="value">${selectedGPU.testDate}</span></p>
        </div>
      `;

    // create a bar chart
    const chart = d3
      .select("#chart")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const xScale = d3
      .scaleBand()
      .domain(gpuData.map(([key]) => key))
      .range([0, 400])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(gpuData, ([, value]) => parseFloat(value))])
      .range([300, 0]);

    chart
      .selectAll("rect")
      .data(gpuData)
      .enter()
      .append("rect")
      .attr("x", ([key]) => xScale(key))
      .attr("y", ([, value]) => yScale(parseFloat(value)))
      .attr("width", xScale.bandwidth())
      .attr("height", ([, value]) => 300 - yScale(parseFloat(value)))
      .attr("fill", "steelblue");
  }
}
