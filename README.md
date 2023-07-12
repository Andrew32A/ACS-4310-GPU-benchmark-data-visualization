# GPU Benchmark Data

This project allows users to compare the performance of different GPUs using benchmark data from 2023. The GPUs can be searched by their names, and their key properties are displayed on the screen. Furthermore, the application provides a comparison chart which helps users make informed decisions when choosing a GPU.

## Project Structure

The project consists of the following main files:

- `index.html`: Contains the HTML structure of the application.
- `scripts.js`: Contains all the JavaScript code that drives the application.
- `styles.css`: Contains all the styles that are applied to the HTML elements.
- `benchmarks.csv`: Contains the GPU benchmark data.

## Features

1. Search for GPUs by name.
2. Display GPU properties: G3Dmark, G2Dmark, price, GPU value, TDP, power performance, test date.
3. Comparison charts that help users to compare different GPUs based on their properties.

## Setup & Usage

To use this project, follow these steps:

1. Clone this repository to your local machine.
2. Open the `index.html` file in your browser.
3. Use the search bars to search for the GPUs you want to compare.

## Dependencies

This project uses D3.js for data visualization and chart creation. The D3.js library is imported via a CDN link in the HTML file.

```html
<script defer src="https://d3js.org/d3.v7.min.js"></script>
```

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
