const leftSearchBar = document.getElementById("leftSearchBar");
const rightSearchBar = document.getElementById("rightSearchBar");
const leftSuggestionsList = document.getElementById("leftSuggestions");
const rightSuggestionsList = document.getElementById("rightSuggestions");
const leftSearchButton = document.getElementById("leftSearchButton");
const rightSearchButton = document.getElementById("rightSearchButton");
const leftCardContainer = document.getElementById("leftCardContainer");
const rightCardContainer = document.getElementById("rightCardContainer");
const vsText = document.getElementById("vsText");
const titleImage = document.getElementById("titleImage");
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

const titles = [
  "G3Dmark",
  "G2Dmark",
  "Price",
  "GPU Value",
  "TDP",
  "Power Performance",
  "Test Date",
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
      <p><span class="label">G3Dmark:</span> <span class="value">${
        selectedGPU.G3Dmark ? selectedGPU.G3Dmark : "Unknown"
      }</span></p>
      <p><span class="label">G2Dmark:</span> <span class="value">${
        selectedGPU.G2Dmark ? selectedGPU.G2Dmark : "Unknown"
      }</span></p>
      <p><span class="label">Price:</span> <span class="value">${
        selectedGPU.price ? "$" + selectedGPU.price : "Unknown"
      }</span></p>
      <p><span class="label">GPU Value:</span> <span class="value">${
        selectedGPU.gpuValue ? selectedGPU.gpuValue : "Unknown"
      }</span></p>
      <p><span class="label">TDP:</span> <span class="value">${
        selectedGPU.TDP ? selectedGPU.TDP : "Unknown"
      }</span></p>
      <p><span class="label">Power Performance:</span> <span class="value">${
        selectedGPU.powerPerformance ? selectedGPU.powerPerformance : "Unknown"
      }</span></p>
      <p><span class="label">Test Date:</span> <span class="value">${
        selectedGPU.testDate ? selectedGPU.testDate : "Unknown"
      }</span></p>
    </div>
    `;

    // create comparison chart
    createComparisonChart();

    // make the left card container visible
    leftCardContainer.style.opacity = "1";

    // add back to search bar event listener
    backToSearchBarLeft();

    // add cursor pointer to left card container
    leftCardContainer.style.cursor = "pointer";

    // hide title
    titleImage.style.display = "none";

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
        <p><span class="label">G3Dmark:</span> <span class="value">${
          selectedGPU.G3Dmark ? selectedGPU.G3Dmark : "Unknown"
        }</span></p>
        <p><span class="label">G2Dmark:</span> <span class="value">${
          selectedGPU.G2Dmark ? selectedGPU.G2Dmark : "Unknown"
        }</span></p>
        <p><span class="label">Price:</span> <span class="value">${
          selectedGPU.price ? "$" + selectedGPU.price : "Unknown"
        }</span></p>
        <p><span class="label">GPU Value:</span> <span class="value">${
          selectedGPU.gpuValue ? selectedGPU.gpuValue : "Unknown"
        }</span></p>
        <p><span class="label">TDP:</span> <span class="value">${
          selectedGPU.TDP ? selectedGPU.TDP : "Unknown"
        }</span></p>
        <p><span class="label">Power Performance:</span> <span class="value">${
          selectedGPU.powerPerformance
            ? selectedGPU.powerPerformance
            : "Unknown"
        }</span></p>
        <p><span class="label">Test Date:</span> <span class="value">${
          selectedGPU.testDate ? selectedGPU.testDate : "Unknown"
        }</span></p>
      </div>
    `;

    // create comparison chart
    createComparisonChart();

    // make the right card container visible
    rightCardContainer.style.opacity = "1";

    // add back to search bar event listener
    backToSearchBarRight();

    // add cursor pointer to right card container
    rightCardContainer.style.cursor = "pointer";

    // hide title
    titleImage.style.display = "none";

    // move the right search bar to the right
    document
      .querySelector(".rightSearchBarContainer")
      .classList.add("movedRight");
  } else {
    alert("No GPU found with the given name on the right search bar!");
  }
}

// event listeners for left and right card containers to go back to the search bars
function backToSearchBarLeft() {
  leftCardContainer.addEventListener("click", handleClickLeft);
}

function backToSearchBarRight() {
  rightCardContainer.addEventListener("click", handleClickRight);
}

const handleClickLeft = (e) => {
  // clear chart container
  chartContainer.innerHTML = "";

  // hide vs text
  vsText.style.opacity = "0";

  // remove cursor pointer from left card container
  leftCardContainer.style.cursor = "default";

  // hide left card container
  leftCardContainer.style.opacity = "0";
  document
    .querySelector(".leftSearchBarContainer")
    .classList.remove("movedLeft");

  // clear search bar and reset GPU data
  leftSearchBar.value = "";
  leftGPUData = null;

  // check if title should be displayed
  shouldDisplayTitle();

  // remove this event listener
  leftCardContainer.removeEventListener("click", handleClickLeft);
};

const handleClickRight = (e) => {
  // clear chart container
  chartContainer.innerHTML = "";

  // hide vs text
  vsText.style.opacity = "0";

  // remove cursor pointer from right card container
  rightCardContainer.style.cursor = "default";

  // hide right card container
  rightCardContainer.style.opacity = "0";
  document
    .querySelector(".rightSearchBarContainer")
    .classList.remove("movedRight");

  // clear search bar and reset GPU data
  rightSearchBar.value = "";
  rightGPUData = null;

  // check if title should be displayed
  shouldDisplayTitle();

  // remove this event listener
  rightCardContainer.removeEventListener("click", handleClickRight);
};

function shouldDisplayTitle() {
  if (leftGPUData === null && rightGPUData === null) {
    titleImage.style.display = "block";
  }
}

function createComparisonChart() {
  if (leftGPUData && rightGPUData) {
    // show vs text
    vsText.style.opacity = "1";

    // clear chart container
    chartContainer.innerHTML = "";

    const margin = { top: 50, right: 20, bottom: 30, left: 40 };
    let width = 420 - margin.left - margin.right;
    let height = 160 - margin.top - margin.bottom;

    properties.forEach((property, i) => {
      const data = [leftGPUData, rightGPUData];
      let maxVal = Math.max(+leftGPUData[property], +rightGPUData[property]);
      let minVal = Math.min(+leftGPUData[property], +rightGPUData[property]);

      // set min value for test date bar chart, everything else is 5% less than the min value
      if (property === "testDate") {
        minVal = 2000;
      } else {
        minVal = minVal - minVal * 0.05;
      }
      const xScale = d3
        .scaleLinear()
        .domain([minVal, maxVal])
        .range([0, width]);

      const yScale = d3
        .scaleBand()
        .domain(data.map((d) => d.gpuName))
        .range([height, 0]) // flip the range
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
        .attr("width", 0) // start with width 0
        .attr("height", yScale.bandwidth())
        .attr("fill", color(property))
        .transition() // start a transition
        .duration(2000) // 2 seconds
        .attr("width", (d) => xScale(d[property])); // and transition the width to its final value

      // adds x axis and checks if value is over 1000 to add k and shorten number
      const xAxis = d3.axisBottom(xScale).tickFormat((d) => {
        if (d >= 1000 && property !== "testDate") {
          return d / 1000 + "k";
        } else {
          return d;
        }
      });
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // adds y axis
      const yAxis = d3.axisRight(yScale); // use axisRight instead of axisLeft
      svg.append("g").attr("class", "y-axis").call(yAxis);

      // chart title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 0 - margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(titles[i]);
    });
  }
}
