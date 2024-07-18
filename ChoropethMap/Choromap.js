// URLs for the county and education data
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

// Variables to store data
let countyData
let educationData

// Selecting SVG board and tooltip elements using D3
let board = d3.select('#board')
let tooltip = d3.select('#tooltip')

// Function to draw the choropleth map
let drawMap = () => {
    // Bind county data to path elements
    board.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) => {
            // Retrieve education data for the county
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })
            // Set fill color based on education percentage
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 15) {
                return 'tomato'
            } else if (percentage <= 30) {
                return 'orange'
            } else if (percentage <= 45) {
                return 'lightgreen'
            } else {
                return 'limegreen'
            }
        })
        .attr('data-fips', (countyDataItem) => {
            return countyDataItem['id']
        })
        .attr('data-education', (countyDataItem) => {
            // Set data-education attribute based on education percentage
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })
        .on('mouseover', (countyDataItem) => {
            // Show tooltip on mouseover
            tooltip.transition()
                .style('visibility', 'visible')

            // Retrieve and display information in the tooltip
            let id = countyDataItem['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })

            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' +
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

            tooltip.attr('data-education', county['bachelorsOrHigher'])
        })
        .on('mouseout', (countyDataItem) => {
            // Hide tooltip on mouseout
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

// Fetch county data using D3.json
d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            // Convert TopoJSON to GeoJSON and store county data
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            // Fetch education data using D3.json
            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        // Store education data and draw the map
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)
