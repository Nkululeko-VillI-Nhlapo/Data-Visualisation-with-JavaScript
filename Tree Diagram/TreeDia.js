// Define the URL for the movie data JSON file
let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

// Variable to store the movie data
let movieData

// Select the 'board' and 'tooltip' elements using D3.js
let board = d3.select('#board')
let tooltip = d3.select('#tooltip')

// Function to draw the TreeMap
let drawTreeMap = () => {
    // Create a hierarchy of the movie data using D3's hierarchy function
    let hierarchy = d3.hierarchy(movieData, (node) => {
        return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })

    // Create a treemap layout using D3's treemap function
    let createTreeMap = d3.treemap().size([1000, 600])
    createTreeMap(hierarchy)

    // Extract the leaves (individual movies) from the hierarchy
    let movieTiles = hierarchy.leaves()

    // Log the extracted movie tiles to the console
    console.log(movieTiles)

    // Create a group for each movie tile and append a rectangle and text
    let block = board.selectAll('g')
        .data(movieTiles)
        .enter()
        .append('g')
        .attr('transform', (movie) => {
            return 'translate(' + movie['x0'] + ', ' + movie['y0'] + ')'
        })

    // Append a rectangle for each movie tile
    block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (movie) => {
            // Set the fill color based on the movie category
            let category = movie['data']['category']
            if (category === 'Action') {
                return 'yellow'
            } else if (category === 'Drama') {
                return 'lightgreen'
            } else if (category === 'Adventure') {
                return 'coral'
            } else if (category === 'Family') {
                return 'lightblue'
            } else if (category === 'Animation') {
                return 'pink'
            } else if (category === 'Comedy') {
                return 'khaki'
            } else if (category === 'Biography') {
                return 'tan'
            }
        })
        // Set data attributes for tooltip information
        .attr('data-name', (movie) => {
            return movie['data']['name']
        })
        .attr('data-category', (movie) => {
            return movie['data']['category']
        })
        .attr('data-value', (movie) => {
            return movie['data']['value']
        })
        // Set width and height based on treemap layout
        .attr('width', (movie) => {
            return movie['x1'] - movie['x0']
        })
        .attr('height', (movie) => {
            return movie['y1'] - movie['y0']
        })
        // Add mouseover and mouseout event listeners for tooltip display
        .on('mouseover', (movie) => {
            tooltip.transition().style('visibility', 'visible')

            // Format revenue with commas
            let revenue = movie['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            // Set tooltip content
            tooltip.html(
                '$ ' + revenue + '<hr />' + movie['data']['name']
            )

            // Set data attribute for tooltip
            tooltip.attr('data-value', movie['data']['value'])
        })
        .on('mouseout', (movie) => {
            tooltip.transition().style('visibility', 'hidden')
        })

    // Append text for each movie tile
    block.append('text')
        .text((movie) => {
            return movie['data']['name']
        })
        .attr('x', 5)
        .attr('y', 20)
}

// Use D3's json function to load the movie data asynchronously
d3.json(movieDataUrl).then(
    (data, error) => {
        if (error) {
            console.log(error)
        } else {
            // Store the loaded data in the movieData variable
            movieData = data
            // Log the loaded movieData to the console
            console.log(movieData)
            // Call the drawTreeMap function to render the treemap
            drawTreeMap()
        }
    }
)
