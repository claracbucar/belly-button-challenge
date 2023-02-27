// Get data from URL:
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Add options to dropdown menu
d3.json(url).then(function(data) {
    var dropDown = d3.select("#selDataset")
    var options = dropDown.selectAll("option")
        .data(data.names)
        .enter()
        .append("option");
    options.text(function(d) {
        return d;
        })
        .attr("value", function(d) {
        return d;
        });
    var samples = data.samples
            });

function getTopIndex(vals){
    var idx = []
    for (var i = 0; i< vals.length; i++){
        idx.push(i)
    }
    var comparator = function(arr) {
        return function(a, b) {
            return ((arr[a] < arr[b]) ? 1 : ((arr[a] > arr[b]) ? -1 : 0));
        };
    };
    idx = idx.sort(comparator(vals))
    return idx
}

function getTopValues(idx, vals, n){
    var subset = []
    for (var i = 0; i< n-1; i++){
        subset.push(vals[i])
    }
    return subset
}

// Update bar plot whenever a new option is selected
function optionChanged(value){
    d3.json(url).then(function(data){
        const i = data.names.indexOf(value);
        var sample = data.samples[i];

        // Generate bar plot
        var idx = getTopIndex(sample.sample_values)
        sample_values = getTopValues(idx, sample.sample_values, 10)
        otu_labels = getTopValues(idx, sample.otu_labels, 10)
        otu_ids = getTopValues(idx, sample.otu_ids, 10)

        var plot_data = [
            {
                x: sample_values,
                y: otu_ids.map(function(el){return 'OTU ' + el.toString()}),
                text: otu_labels,
                type: 'bar',
                orientation: 'h'
            }
            ];
            Plotly.newPlot('bar', plot_data);
        
        // Generate bubble plot
        var colorMap = {}
        var parsedLabels = []
        var j = 0
        console.log(sample.otu_labels.length)
        for (var k=0; k<sample.otu_labels.length; k++){
            if (!parsedLabels.includes(sample.otu_labels[k])){
                colorMap[sample.otu_labels[k]] = j;
                j++;
                parsedLabels.push(sample.otu_labels[k])
            };
        }

        var plot_data = [
            {
                x: sample.otu_ids,
                y: sample.sample_values,
                text: sample.otu_labels,
                mode: 'markers',
                marker: {
                    size : sample.sample_values,
                    color: sample.otu_labels.map(function(el){return colorMap[el]}),
                    colorscale:[['0.0', 'rgb(255, 0, 0)'], ["1.0", 'rgb(0,0,0)']]
                }
            }
            ];
            Plotly.newPlot('bubble', plot_data);
        
        // Generate metadata box
        var metaData = data.metadata[i]
        var textOutput = ''
        for (const [key, value] of Object.entries(metaData)){
            textOutput = textOutput + '\r\n' + key.toString() + ':' + value.toString()
        }
        d3.select('#sample-metadata')
        .append("text")
        .text(textOutput);
    });
};