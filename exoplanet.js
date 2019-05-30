/**
 * Here I separate JS code from HTML code to make it more readable
 */

//fire the planet visualization here
exoplanetLauncher("dataset.csv");

function barchartDataProcessor(data, divId){
    //Sample data with discoveryYear and numberOfPlanet
    var sampleData = [{ //In json format
        discoveryYear: '2000', numberOfPlanet: 73
        },
        {
        discoveryYear: '2001', numberOfPlanet: 92
        },
        {
        discoveryYear: '2002', numberOfPlanet: 67
        },
        {
        discoveryYear: '2003', numberOfPlanet: 80
        },
        {
        discoveryYear: '2004', numberOfPlanet: 75
        },
        {
        discoveryYear: '2005', numberOfPlanet: 86
        },
        {
        discoveryYear: '2006', numberOfPlanet: 68
        },
        {
        discoveryYear: '2007', numberOfPlanet: 93
        },
        {
        discoveryYear: '2008', numberOfPlanet: 173
        },
        {
        discoveryYear: '2009', numberOfPlanet: 267
        },
        {
        discoveryYear: '2010', numberOfPlanet: 220
        },
        {
        discoveryYear: '2011', numberOfPlanet: 115
        },
        {
        discoveryYear: '2012', numberOfPlanet: 86
        },
        {
        discoveryYear: '2013', numberOfPlanet: 127
        },
        {
        discoveryYear: '2014', numberOfPlanet: 348
        },
        {
        discoveryYear: '2015', numberOfPlanet: 150
        },
        {
        discoveryYear: '2016', numberOfPlanet: 500
        }];
    // logger('==barchart data==')
    // logger(sampleData);
    /** I only have planetDiscoveryYear in the data coming. So to know the number
     * of planet there will be need for me to group the data based on year and
     * then count the number of planet that fall in each date range. Also, some 
     * planets have no discovery year recorded.
     */
    //grouping the data by year
    let temp = d3.nest()
                .key(function(d){ return d.planetDiscoveryYear; })
                .entries(data)
                .sort(function(a,b){ return d3.ascending(a.key,b.key)});
    //reformat the data
    let processedData = temp.map(function(d){
        return{
            discoveryYear: d.key != ""?d.key:"No Date", //substitute empty date with No Date
            numberOfPlanet: d.values.length
        }
    })
    logger('==Planet Barchart Data Ready==')
    logger(processedData);

    //Instantiate the chart
    var barChart = drawBarChart().data(processedData)
                                  .divId(divId);
    //initiate the chart
    d3.select(divId).call(barChart);
  
  }//end processor
  
function drawBarChart(){
    //updatables
    let data;
    let divId;  
  
    function drawBar(selection){
      selection.each(function(){
  
        let containerWidth = parseInt(($(divId).parent().css('width')));
        let svgWidth = containerWidth,svgHeight = containerWidth*.65;
            margin = {top: 20, bottom: 50, right: 10, left: 50},
            width = svgWidth - margin.left, height = svgHeight - margin.bottom;        

        let color = d3.scaleOrdinal(d3.schemeCategory10);//all colors to come from here

        //Layout the chart: create SVG and a group 'g' as master container
        var chart = d3.select(this) //"this" is selection passed from dataprocessor above
              .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .attr('class', 'chart')            
        var gChart = chart.append("g")
                .attr('class', 'chart-container')
                .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

        /** This section is for chart scaling */
        //set scaleBand and domain for x-axis       
        var x = d3.scaleBand().rangeRound([0, width], 0.05);
        x.domain(data.map(function(d) { return d.discoveryYear; }));
        //set linearscale for the y-axis        
        var y = d3.scaleLinear().range([height, 0]);
        y.domain([0, d3.max(data, function(d){ return d.numberOfPlanet; })]);

        /** This section is for configuring the axes */
        //set up the X-Y axis
        var gAxis = gChart.append('g')
                .attr('class', 'axes')
        var xAxis = gAxis.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .style('color','grey')
                // .style('font-size', '.5em')
            xAxis.selectAll("text")
                      .style('font-weight', 'bold')
                      .style("text-anchor", "middle")
        var yAxis = gAxis.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y).ticks(5).tickFormat(function(d){ return d; }))              
                .style('font-size', '.9em')
                .style('font-weight', 'bold')
                .style('color', 'grey')
            yAxis.append("text")
                .attr('class', 'ytitle')
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                // .attr('dx', '-1.5em')
                .attr("text-anchor", "end")
                .style('fill', 'grey')
                .text('No. of Planet')
  
        //setup the bar with rect and put them in a group
        var gBars = gChart.append('g')
                .attr('class', 'bars')
        var bar = gBars.selectAll('.bar').data(data, function(d){ return d})
        
        var rectBar = bar.enter().append('g')
                .attr('class', 'bar')
            rectBar.append("rect")
                .attr('class', 'rect-bar')
            //   .merge(bar)
                .style("fill", function(d){ return color(d.discoveryYear);})
                .style('opacity', .75)
                .attr("x", function(d) { return x((d.discoveryYear)); })
                .attr('y', height)
                .transition().duration(2000).ease(d3.easeExp)
                .attr("y", function(d) { return y(d.numberOfPlanet); })
                .attr("width", x.bandwidth() - 5)
                .attr("height", function(d) { return height - y(d.numberOfPlanet); })
            rectBar.append('text')
                .attr('class', 'bar-label')
            //   .merge(bar)
                .attr('transform', function(d){ return (' translate('+ x(d.discoveryYear) +','+ (y(d.numberOfPlanet) ) +') rotate(-90)')})
                .transition().duration(2000).ease(d3.easeExp)
                .style("fill", function(d){ return color(d.discoveryYear)})
                .style('font-size', '12px')
                .style('writing-mode', 'tb')
                .attr('text-anchor', 'middle')
                .attr('dy', '1.8em')
                .attr('dx', '.55em')
                .text(function(d){ return d.numberOfPlanet; })
            // logger('Bar chart should be on the screen now')
  
            var t = d3.transition()
                        .duration(500)
                        .ease(d3.easeBackIn);
  
      });    
    }//end drawBar
  
    drawBar.data = function(value){
      if(!arguments.length)
        return drawBar;
      data = value;
      return drawBar;
    }
    drawBar.divId = function(value){
      if(!arguments.length)
        return drawBar;
      divId = value;
      return drawBar;
    }
  
    return drawBar;
  }//end drawBarChart

function exoplanetLauncher(csvFileSource){
    /** Since not all the columns of the data is needed there is need
     * to retrieve just the relevance ones and ignore the others.
     * NOTE: The CSV file has been clean to remove the comment lines (#-rows)
     * and include the column names
     */
    //Load the CSV file and create a callback function to return the data
    d3.csv(csvFileSource).then(function(rawData){
        //Retrieve the needed columns
        let filteredData = rawData.map(function(d){
            return{
                planetIdentifier: d['Primary identifier of planet'],
                planetMass: d['Planetary mass'],
                planetRadius: d['Radius'],
                planetDiscoveryYear: d['Discovery year'],
                planetStatus: d['Planet detection status']
            }
        })
        logger('==Rawdata loaded and filtered==');
        logger(filteredData);
        return filteredData;
    }).then(function(data){
        /** A simplified data created above can now be used in the respective charts */
        barchartDataProcessor(data, '#planet-bar');
    })
}  

//Logger function to log important stuff
function logger(param){
    console.log(param);
}
  