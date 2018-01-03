$(document).ready(function(){

    //SCHOOLS MAP
    var schools_width = window.innerWidth-300,
    schools_height = window.innerHeight;

      var schools_svg = d3.select( "#schools-map svg" );
        // .attr( "width", schools_width )
        // .attr( "height", schools_height );

      var projection = d3.geoAlbers()
      .center([7, 35.73])
      .rotate([85.8,.5])
      .scale(5500);
      // .translate([schools_width / 2, schools_height / 2]);

      var geoPath = d3.geoPath()
      .projection(projection);

      var q = d3_queue.queue();
      q
      .defer(d3.json, "data/nc-counties.json")
      .await(ready);

      function ready(error, counties){

      schools_svg.append("g")
          .attr("x", 0)
          .attr("y", 0)
          .selectAll("path")
          .data( topojson.feature(counties, counties.objects.counties).features)
          .enter()
          .append("path")
          .attr( "d", geoPath )
          .attr("class",function(d){
            return "fip_" + d.properties.COUNTYFP + " county";
          })
          .attr( "fill", function(d){
              return "#5656";
          })
          ; 
      }

      var schools = schools_svg.append( "g" )
      .attr("x", 0)
      .attr("y", 0);

      schools.selectAll( "path" )
        .data( restartschools.features )
        .enter()
        .append( "path" )
        .attr("class", "school")
        .attr( "fill", "#900" )
        .attr( "stroke", "#999" )
        .attr( "d", geoPath );

      schools.selectAll( "path" )
        .data( restartschools.features )
        .enter()
        .append( "path" )
        .attr("class", "school")
        .attr( "fill", "#900" )
        .attr( "stroke", "#999" )
        .attr( "d", geoPath );


      //BASIC BAR CHART - https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998

      function basic_bar(selector, json_file){
        //"#bar-chart svg"
        //restart_race.json
        var bar_svg = d3.select(selector),
        bar_margin = {top: 20, right: 20, bottom: 30, left: 100},
        bar_width = +bar_svg.attr("width") - bar_margin.left - bar_margin.right,
        bar_height = +bar_svg.attr("height") - bar_margin.top - bar_margin.bottom;
      
        // var tooltip = d3.select("body").append("div").attr("class", "toolTip");
          
        var bar_x = d3.scaleLinear().range([0, bar_width]);
        var bar_y = d3.scaleBand().range([bar_height, 0]);
        
        var g = bar_svg.append("g")
            .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");
          
        d3.json("data/" + json_file, function(error, data) {
            if (error) throw error;
          
            data.sort(function(a, b) { return a.value - b.value; });
          
            // bar_x.domain([0, d3.max(data, function(d) { return d.value; })]);
            bar_x.domain([0,1]);
            bar_y.domain(data.map(function(d) { return d.label; })).padding(0.1);
        
            g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + bar_height + ")")
                .call(d3.axisBottom(bar_x).ticks(5).tickFormat(function(d) { return parseFloat(d)*100 + '%'; }).tickSizeInner([-bar_height]));
        
            g.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(bar_y));
        
            var bar = g.selectAll(".bar")
                .data(data)
              .enter().append("rect")
                
                .attr("class", "bar")
                .attr("x", 0)
                .attr("height", bar_y.bandwidth())
                .attr("y", function(d) { return bar_y(d.label); })
                .attr("width", function(d) {  return bar_x(d.value); })
                .style('fill', '#BFDEFF')
                .on('mouseover', function () {
                    d3.select(this).transition().style('fill', '#2B24FF');
                })
                .on('mouseout', function () {
                    d3.select(this).transition().style('fill', '#BFDEFF');
                });
                
                g.append("g")
                .attr("transform", "translate(10,-60)")
                .selectAll("text")
                .data(data).enter()
                .append("text")
                  .attr("class", "label")
                  .attr("y", bar_height / 2)
                  .attr("dy", ".35em") //vertical align middle
                  .text(function(d){
                      return Math.floor(d.value*100) + "%";
                  })
                  .attr("transform",function(d){
                    return "translate(" + bar_x(d.value) + "," + bar_y(d.label) + ")";
                  });
        });
      }

      basic_bar("#bar-chart #bar-1", "restart_race.json");
      basic_bar("#bar-chart #bar-2", "restart_race.json");

      


//MULTI-SERIES LINE CHART - https://bl.ocks.org/mbostock/3884955

  var line_svg = d3.select("#line-chart svg"),
  line_margin = {top: 20, right: 80, bottom: 30, left: 50},
  line_width = line_svg.attr("width") - line_margin.left - line_margin.right,
  line_height = line_svg.attr("height") - line_margin.top - line_margin.bottom,
  line_g = line_svg.append("g").attr("transform", "translate(" + line_margin.left + "," + line_margin.top + ")");
  
  var parseTime = d3.timeParse("%Y");
  
  // var line_x = d3.scaleTime().range([0, line_width]),
  var line_x = d3.scaleLinear().range([0, line_width]),
  line_y = d3.scaleLinear().range([line_height, 0]),
  
  line_z = d3.scaleOrdinal(d3.schemeCategory10);
  
  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return line_x(d.date); })
      .y(function(d) { return  line_y(d.temperature); });
  
  d3.tsv("data/example.tsv", type, function(error, data) {
    if (error) throw error;
  
    var cities = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.date, temperature: d[id]};
        })
      };
    });
  
    // line_x.domain(d3.extent(data, function(d) { return d.date; }));
    line_x.domain([2013,2016]);
  
    line_y.domain([ 0,100
      // d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
      // d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
    ]);
  
    line_z.domain(cities.map(function(c) { return c.id; }));
  
    line_g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + line_height + ")")
        .call(d3.axisBottom(line_x).ticks(3).tickFormat(function(d) { return parseInt(d); }));
  
    line_g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(line_y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Student Performance Grade");
  
    var city = line_g.selectAll(".city")
      .data(cities)
      .enter().append("g")
        .attr("class", "city");
  
    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) {  return line_z(d.id); });
  
    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + line_x(d.value.date) + "," + parseInt(line_y(d.value.temperature)+10) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
    

    // line_svg.append("g").selectAll("circle")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("r", 2)
    //     .attr("cx", function(d, i){ console.log(i); line_x(d.date);})
    //     .attr("cy", function(d){ line_y(d.temperature);})
    //     .attr("fill", "none")
    //     .attr("stroke", "black");

       });
      
      function type(d, _, columns) {
        // d.date = parseTime(d.date);
        d.date = d.date;
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
      }


  
    }); //doc ready