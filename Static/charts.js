function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("Static/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("Static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("Static/samples.json").then((data) => { 
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array.
    var samplesarray = data.samples; 
    var metadataarray = data.metadata;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var filtersample = samplesarray[0];
    console.log(filtersample)

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filtermetadata = metadataarray[0];
    console.log(filtermetadata)

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstsamplesarray = samplesarray.filter(sample => sample.id === 940)[0];
    console.log(firstsamplesarray)
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstmetadataarray = metadataarray.filter(sample => sample.id === 940)[0];
    console.log(firstmetadataarray)

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = filtersample.otu_ids;
    console.log(ids)
    var labels = filtersample.otu_labels.slice(0,10).reverse();
    console.log(labels)
    var sample_values = filtersample.sample_values;
    console.log(sample_values)
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreqdata = filtermetadata.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse();
    var x = sample_values.slice(0,10).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace = {
      type: 'bar',
      x: x,
      y: yticks,
      text: labels,
      orientation: 'h'
    };
    barData = [trace];
    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Sample_Values'},
			yaxis: {},
			autosize: false,
			width: 450,
			height: 600
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart. 
    var trace2 = {
			x: ids,
			y: sample_values,
			text: labels,
			mode: 'markers',
			marker: {
				color: ids,
				size: sample_values,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111', 'rgb(215,50,39)'],
          ['0.222', 'rgb(244,100,67)'],
          ['0.333', 'rgb(253,174,97)'],
          ['0.444', 'rgb(254,224,144)'],
          ['0.555', 'rgb(224,243,248)'],
          ['0.667', 'rgb(171,217,233)'],
          ['0.777', 'rgb(116,173,209)'],
          ['0.888', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ],
        showscale: true
			}
		};
    var bubbleData = [trace2];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
			title: '<b>Bacteria Cultures per Sample<b>',
			xaxis: { title: "Otu_Id"},
			yaxis: { title: "Sample_Values"}, 
			hovermode: true,
    
		};
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var trace3 = 
			{
				domain: { x: [0, 1], y: [0, 1] },
				value: wfreqdata,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week</br>'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 10], tickwidth: 1, tickcolor: 'black' },
          bar: { color: 'black'},
					steps: [
            { range: [0, 2], color: 'rgb(255, 50, 0)' },
            { range: [2, 4], color: 'rgb(255, 140, 30)' },
            { range: [4, 6], color: 'rgb(240, 240, 0)' },
            { range: [6, 8], color: 'rgb(100, 250, 80)' },
            { range: [8, 10], color: 'rgb(80, 140, 60)' }
          ],
				}
			};
		var gaugeData = [trace3];
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
