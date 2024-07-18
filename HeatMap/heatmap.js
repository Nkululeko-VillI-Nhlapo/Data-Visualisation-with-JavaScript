//Define the URL for the JSON data

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest()

//// Variables to store base temperature and data values
let baseTemp
let values =[]

//// Variables for scales
let xScale
let yScale

// Variables for axes
let xAxis
let yAxis

// Dimensions for the SVG
let width = 1200
let height = 600
let padding = 60

// Select SVG and tooltip elements using D3
let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

// Function to generate scales based on data
let generateScales = () => {

    
    let minYear = d3.min(values, (item) => {
        return item['year']
    })
    
    let maxYear = d3.max(values, (item) => {
        return item['year']
    })

    // Calculate min and max years from the data
    xScale = d3.scaleLinear()
                .domain([minYear, maxYear + 1])
                .range([padding, width - padding])

    // Create yScale using time scale
    yScale = d3.scaleTime()
                .domain([new Date(0,0,0,0, 0, 0, 0), new Date(0,12,0,0,0,0,0)])
                .range([padding, height - padding])
}


// Function to set dimensions for the SVG
let drawBoard = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

// Function to draw cells (rectangles) based on data
let drawCells = () => {

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('fill', (item) => {
            let variance = item['variance']
            if(variance <= -1){
                return 'SteelBlue'
            }else if(variance <= 0){
                return 'LightSteelBlue'
            }else if(variance <= 1){
                return 'Orange'
            }else{
                return 'Crimson'
            }
        })
        .attr('data-year', (item) => {
            return item['year']
        })
        .attr('data-month', (item) => {
            return item['month'] - 1
        })
        .attr('data-temp', (item) => {
            return baseTemp + item['variance']
        })
        .attr('height', (item)=> {
            return (height - (2 * padding)) / 12
        })
        .attr('y', (item) => {
            return yScale(new Date(0, item['month']-1, 0, 0, 0, 0, 0))
        })
        .attr('width', (item) => {
            let minYear = d3.min(values, (item) => {
                return item['year']
            })
            
            let maxYear = d3.max(values, (item) => {
                return item['year']
            })

            let yearCount = maxYear - minYear

            return (width - (2 * padding)) / yearCount
        })
        .attr('x', (item) => {
            return xScale(item['year'])
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ]
        
            tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1 ] + ' : ' + item['variance'])

            tooltip.attr('data-year', item['year'])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
        
}

// Function to generate x and y axes
let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%B'))

    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
    
}

// Setting up the XMLHttpRequest to fetch data
req.open('GET', url, true)
req.onload = () => {
     // Parse the JSON data
    let data = JSON.parse(req.responseText)
    baseTemp = data.baseTemperature
    values = data.monthlyVariance

    // Log base temperature and values to the console
    console.log(baseTemp)
    console.log(values)

    // Call functions to draw the visualization
    drawBoard()
    generateScales()
    drawCells()
    generateAxes()
}
// Send the XMLHttpRequest
req.send() 