// Sample data with 5 bars
const data = [
    { date: "2000-01-01", gdp: 120 },
    { date: "2001-01-01", gdp: 200 },
    { date: "2002-01-01", gdp: 150 },
    { date: "2003-01-01", gdp: 300 },
    { date: "2004-01-01", gdp: 180 },
  ];
  
  // Chart dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  
  // Create SVG container
  const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X and Y scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, width])
    .padding(0.1);
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.gdp)])
    .range([height, 0]);
  
  // X and Y axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  // Append axes to SVG
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  
  svg.append("g")
    .attr("id", "y-axis")
    .call(yAxis);
  
  // Create bars
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d.date)
    .attr("data-gdp", d => d.gdp)
    .attr("x", d => xScale(d.date))
    .attr("y", d => yScale(d.gdp))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.gdp))
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
  
  // Tooltip
  const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  // Tooltip mouseover event handler
  function handleMouseOver(event, d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip.html(`Date: ${d.date}<br>GDP: ${d.gdp}`)
      .attr("data-date", d.date)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px");
  }
  
  // Tooltip mouseout event handler
  function handleMouseOut() {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }
  