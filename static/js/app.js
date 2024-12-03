// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data["metadata"]
    const sampleNum = Number(sample)

    // Filter the metadata for the object with the desired sample number
    const filteredMetadata = metadata.filter((a) => { return a["id"] === sampleNum })[0]

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataHtml = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    metadataHtml.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    let keys = Object.keys(filteredMetadata)
    let values = Object.values(filteredMetadata)

    // Looping through all of the attributes in the metadata array, then adding them to the dashboard using the '.append()' method
    for (let i = 0; i < keys.length; i++) {
      const newElement = metadataHtml.append("p")
      // This was added so that the key values added match the styling given in the example images from the challenge
      newElement.text(`${keys[i].toUpperCase()} : ${values[i]}`)
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  // Pulling data from the API endpoint
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Get the samples field
    // Filter the samples for the object with the desired sample number
    const desiredSample = data["samples"].filter((a) => { return a["id"] === sample })

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = desiredSample[0]["otu_ids"]
    const otu_labels = desiredSample[0]["otu_labels"]
    const sample_values = desiredSample[0]["sample_values"]

    // Bubble chart code
    // Build a Bubble Chart
    // We have to specify that this is a scatter chart with markers (otherwise we couldn't set the size or color of the markers)
    const bubbleDataWrapper = [{
      x : otu_ids,
      y : sample_values,
      type : "scatter",
      mode : "markers",
      marker : {
        size : sample_values,
        color : otu_ids
      },
      text : otu_labels
    }]

    // Defining a layout object so that a title is added
    const bubbleLayout = {
      title : "Bacteria Cultures Per Samples"
    }

    // Defining the class of the HTML element that we are adding the chart to
    const bubbleHtmlClass = "bubble"

    // Render the Bubble Chart
    Plotly.newPlot(bubbleHtmlClass, bubbleDataWrapper, bubbleLayout)

    // Bar chart code
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.map((item) => { return `OTU ${item}` }).slice(0, 10).reverse()
    const x_vals = sample_values.slice(0, 10).reverse()

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Had to set the orientation to "h" (horizontal) so that it would match the example chart given in the assignment
    const barDataWrapper = [{
      x : x_vals,
      y : yticks,
      orientation : "h",
      type : "bar",
      text : otu_labels
    }]
    
    // Defining a layout object so that a title is added
    const barLayout = {
      title : "Top 10 Bacteria Cultures Found"
    }

    // Defining the class of the HTML element that we are adding the chart to
    const barHtmlClass = "bar"

    // Render the Bar Chart
    Plotly.newPlot(barHtmlClass, barDataWrapper, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data["names"]

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdownElement = d3.select("#selDataset")

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (sampleName of names) {
      // Appending the name to the list of names visible in the dropdown menu (then changing its text value to the appropriate name)
      const element = dropdownElement.append("option")
      element.text(sampleName)
    }

    // Get the first sample from the list
    const firstSample = data["samples"][0]["id"]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample)
    buildCharts(firstSample)
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();
