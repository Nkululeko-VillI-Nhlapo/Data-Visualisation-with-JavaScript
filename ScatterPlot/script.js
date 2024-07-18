// Define the URL for the data
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Create a new XMLHttpRequest object
let req = new XMLHttpRequest();

// Array to store the data
let values =[];

// Variables for scales
let xScale;
let yScale;

// Variables for axes
let xAxis;
let yAxis;

// Set the dimensions of the SVG canvas
let width = 800;
let height = 600;
let padding = 40;

// Select the SVG element using D3
let svg = d3.select('svg');

// Select the tooltip element using D3
let tooltip = d3.select('#tooltip');

// Function to generate scales for x and y axes
let generateScales = () => {
    // X-axis scale
    xScale = d3.scaleLinear()
        .domain([d3.min(values, (item) => {
            return item['Year'];
        }) - 1, d3.max(values, (item) => {
            return item['Year'];
        }) + 1])
        .range([padding, width - padding]);

    // Y-axis scale
    yScale = d3.scaleTime()
        .domain([d3.min(values, (item) => {
            return new Date(item['Seconds'] * 1000);
        }), d3.max(values, (item) => {
            return new Date(item['Seconds'] * 1000);
        })])
        .range([padding, height - padding]);
};

// Function to draw the canvas
let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
};

// Function to draw data points
let drawPoints = () => {
    // Create circles for each data point
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '5')
        .attr('data-xvalue', (item) => {
            return item['Year'];
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000);
        })
        .attr('cx', (item) => {
            return xScale(item['Year']);
        })
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000));
        })
        .attr('fill', (item) => {
            // Set fill color based on doping status
            if (item['URL'] === "") {
                return 'lightgreen';
            } else {
                return 'orange';
            }
        })
        .on('mouseover', (item) => {
            // Show tooltip on mouseover
            tooltip.transition()
                .style('visibility', 'visible');

            // Set tooltip text based on doping status
            if (item['Doping'] != "") {
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + item['Doping']);
            } else {
                tooltip.text(item['Year'] + ' - ' + item['Name'] + ' - ' + item['Time'] + ' - ' + 'No Allegations');
            }

            // Set data-year attribute for tooltip
            tooltip.attr('data-year', item['Year']);
        })
        .on('mouseout', (item) => {
            // Hide tooltip on mouseout
            tooltip.transition()
                .style('visibility', 'hidden');
        });
};

// Function to generate x and y axes
let generateAxes = () => {
    // X-axis
    xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));

    // Y-axis
    yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'));

    // Append x-axis to the SVG
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')');

    // Append y-axis to the SVG
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)');
};

// Open the connection and define the onload callback
req.open('GET', url, true);
req.onload = () => {
    // Parse the JSON response and store in the values array
    values = JSON.parse(req.responseText);
    console.log(values);

    // Call functions to draw the visualization
    drawCanvas();
    generateScales();
    drawPoints();
    generateAxes();
};

// Send the request
req.send();
