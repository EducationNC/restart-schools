$(document).ready(function(){


  function line_plot(selector, isJustAxis, range_val1, range_val2) {
    var width = 600,
    height = 100;

    var data = [0, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];

    // Append SVG 
    var svg = d3.select(selector)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([0, width - 100]);

    // Add scales to axis
    var x_axis = d3.axisBottom()
                  .scale(scale);

    var graphic = svg.append("g")
    .attr("transform", "translate(10, 40)");

    //Append group and insert axis
    graphic.append("g")
      .call(x_axis);

  if (!isJustAxis){
    graphic.append("g")
      .append("line")
      .attr("x1", scale(range_val1))
      .attr("x2", scale(range_val2))
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    graphic.append("g")
      .append("circle")
      .attr("r", 3)
      .attr("transform", "translate(" + scale(range_val1) + ",0)");

    graphic.append("g")  
      .append("circle")
      .attr("r", 3)
      .attr("transform", "translate(" + scale(range_val1) + ",0)");

    graphic.append("g")
      .append("text")
      .attr("class", "line-plot-label")
      .text("Between " + range_val1 + " and " + range_val2 + ".")
      .attr("x", scale(range_val1))
      .attr("y", -15);
    }
    

  }

  line_plot("#scale1", true, 45, 50);
  line_plot("#scale2", false, 60, 65);
  line_plot("#scale3", false, 90, 100); 

  function nc_map(selector, json_file, coord, isSingle){
    //TODO: figure out how to size this shit: https://stackoverflow.com/questions/9566792/scale-svg-to-container-without-mask-crop
    var schools_width = $(selector).width()
    schools_height = $(selector).height();

      var schools_svg = d3.select(selector);
        // .append("div")
        // .classed("svg-container", true)
        // .append("svg")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 600 400")
        // .classed("svg-content-responsive", true); 

      var projection = d3.geoAlbers()
      .center([7, 35.73])
      .rotate([85.8,.5])
      .scale(5500);
      // .translate([schools_width / 2, schools_height / 2]);

      var geoPath = d3.geoPath()
      .projection(projection);


      var q = d3_queue.queue();
      q
      .defer(d3.json, "data/" + json_file)
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
          }); 
     
      }


      var schools = schools_svg.append( "g" )
      .attr("x", 0)
      .attr("y", 0);

      if (isSingle){
        schools_svg.selectAll("circle")
          .data([coord]).enter()
          .append("circle")
          .attr("cx", function (d) { return projection(d)[0]; })
          .attr("cy", function (d) { return projection(d)[1]; })
          .attr("r", "3px")
          .attr("fill", "red")
      } else {
        schools.selectAll( "path" )
        .data( restartschools.features )
        .enter()
        .append( "path" )
        .attr("class", "school")
        .attr( "stroke", "transparent" )
        .attr( "fill", "#555" )
        .attr( "d", geoPath );
      }

      // $('')
      // .transition()
      // .attr("r", 8)
      // .attr("r", 50)
      // .duration(1200);
     
    } //nc_map


      //BASIC BAR CHART - https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998

      function basic_bar(selector, isRawJson, json){
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
        
        if (!isRawJson){
        d3.json(json, function(error, data) {
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
      } //isRawJson
    else {
      var data = json;
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
    }
  } //basic-Bar


//MULTI-SERIES LINE CHART - https://bl.ocks.org/mbostock/3884955

function line_chart(selector, file_name, isJson, json_data){

  var line_svg = d3.select(selector),
  line_margin = {top: 20, right: 80, bottom: 30, left: 50},
  line_width = line_svg.attr("width") - line_margin.left - line_margin.right,
  line_height = line_svg.attr("height") - line_margin.top - line_margin.bottom,
  line_g = line_svg.append("g").attr("transform", "translate(" + line_margin.left + "," + line_margin.top + ")");
  
  var parseTime = d3.timeParse("%Y");
  
  // var line_x = d3.scaleTime().range([0, line_width]),
  var line_x = d3.scaleLinear().range([0, line_width]),
  line_y = d3.scaleLinear().range([line_height, 0]),
  
  line_z = d3.scaleOrdinal(d3.schemeCategory10);
  
  // console.log("line_width: " + line_height)

  var line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) { return line_x(d.date); })
      .y(function(d) { return  line_y(d.score); });
  
  if (!isJson){
  d3.tsv("data/" + file_name, type, function(error, data) {
    if (error) throw error;
  
    var schools = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.date, score: d[id]};
        })
      };
    });
    line_x.domain([2013,2016]);
  
    line_y.domain([ 0,100 ]);
  
    line_z.domain(schools.map(function(c) { return c.id; }));
  
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
  
    var school = line_g.selectAll(".school")
      .data(schools)
      .enter().append("g")
        .attr("class", "school");
  
    school.append("path")
        .attr("class", "line")
        .attr("d", function(d) {  return line(d.values); })
        .style("stroke", function(d) {  return line_z(d.id); });

    school.append("g")
    .selectAll(".dot")
      .data(function(d){
        return d.values
      })
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, i){
        return line_x(parseInt(d.date));
      })
      .attr("cy", function(d){
        return line_y(d.score);
      })
      .attr("fill", "blue");
  
    school.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[0]}; })
        .attr("transform", function(d) { return "translate(" + line_x(d.value.date) + "," + parseInt(line_y(d.value.score)+10) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
  }); //d3.tsv
} else {
  var schools = json_data;
  line_x.domain([2013,2016]);
  
  line_y.domain([ 0,100 ]);

  line_z.domain(schools.map(function(c) { return c.id; }));

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

  var school = line_g.selectAll(".school")
    .data(schools)
    .enter().append("g")
      .attr("class", "school");

  school.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {  return line_z(d.id); });
  
  school.append("g")
    .selectAll(".dot")
      .data(function(d){
        return d.values
      })
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("cx", function(d, i){
        return line_x(parseInt(d.date));
      })
      .attr("cy", function(d){
        return line_y(d.score);
      })
      .attr("fill", "blue");

  // school.append("text")
  //     .datum(function(d) { console.log(d.values[0]); return {id: d.id, value: d.values[0]}; })
  //     .attr("class", "label")
  //     .attr("transform", function(d) { console.log(line_x(d.value.date) + " refresh"); return "translate(370," + parseInt(line_y(d.value.score)+10) + ")"; })
  //     .attr("x", 3)
  //     .attr("dy", "0.35em")
  //     .style("font", "10px sans-serif")
  //     .text(function(d) { return d.id; });
  }
  
    // line_svg.append("g").selectAll("circle")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("r", 2)
    //     .attr("cx", function(d, i){ line_x(d.date);})
    //     .attr("cy", function(d){ line_y(d.score);})
    //     .attr("fill", "none")
    //     .attr("stroke", "black");


      
      function type(d, _, columns) {
        // d.date = parseTime(d.date);
        d.date = d.date;
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
      }
    } //line_chart

      //build those d3
      basic_bar("#bar-chart #bar-1", false, "data/restart_race.json");
      basic_bar("#bar-chart #bar-2", false, "data/restart_race_state.json");
      nc_map("#schools-map svg", "nc-counties.json", "", false);
      nc_map("#highlight-map svg", "nc-counties.json", "", false);
      // line_chart("#line-chart svg", "example.tsv", false, "");


            //WAYPOINTS
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint1'),
              handler: function () {
                // $('#schools-map svg').toggleClass("fixed");
      
              }
            })
      
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint1a'),
              handler: function () {
                $('#percent-table-wrapper').toggleClass("shadow-drop-2-center");
      
              }
            })
      
            //trigger the line chart
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint2'),
              handler: function () {
                // $('#line-chart').toggleClass("inline-block");
                // $('#schools-map svg').toggleClass("fixed");
                // $('#line-chart svg').toggleClass("fixed");
                
                $('#percent-table-wrapper').toggleClass("shadow-drop-2-center");
      
              }
            })
      
            //trigger the bar chart
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint3'),
              handler: function () {
                // $('#line-chart').toggleClass("inline-block");
                // $('#bar-chart').toggleClass("inline-block");
                // $('#line-chart svg').toggleClass("fixed");
                // $('#bar-chart svg').toggleClass("fixed");
      
              }
            })
      
            // var waypoint = new Waypoint({
            //   element: document.getElementById('waypoint4'),
            //   handler: function () {
      

      
            //   }
            // })
      
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint5'),
              handler: function () {
                // $('#scale1 img').toggleClass("inline-block");
                // $('#scale1 img').toggleClass("fixed");
                // $('#scale2 img').toggleClass("inline-block");
                // $('#scale2 img').toggleClass("fixed");
      
              }
            })
      
            var waypoint = new Waypoint({
              element: document.getElementById('waypoint6'),
              handler: function () {
                // $('#scale2 img').toggleClass("inline-block");
                // $('#scale2 img').toggleClass("fixed");
      
              }
            })
      
      
            $('.map-hover-item').hover(function (e) {
              var thisFip = $(this).data('fip');
              if ($(this).data('fip2') != null) {
                thisFip2 = $(this).data('fip2');
                $('.fip_' + thisFip2).toggleClass('county-highlight');
              }
      
              $('.fip_' + thisFip).toggleClass('county-highlight');
      
            });
      
            //TODO: POPULATE THE BOTTOM EXPLORER
      
            function build_scaffolding(){
              for (i in ALL_DATA) {
              //1) build the data into the DOM
              var school = ALL_DATA[i];
              var keys = Object.keys(school);
              //1a. create the data wrappers
              $('#data-list').append('<div class="data-lister" id="waypoint_' + school.school_code + '"><div><h2 class="lister__school_name" id="open_' + school.school_code + '">' + school.official_school_name + '<i id="caret_' + school.school_code + '" class="fa fa-caret-right" aria-hidden="true"></i></h2><h4 class="lister__school_district">' + school.district + '</h4></div></div>');
      
              //1b. iterate thru the data keys
              for (j in keys) {
                thisKey = keys[j];
                $('#waypoint_' + school.school_code).attr('data-' + thisKey, school[thisKey]);
              }
      
              $('#school-list').append('<p>' + school.official_school_name + '</p>');
      
              build_section(school, "#waypoint_" + school.school_code);
      
      
              window["waypoint_" + school.school_code] = new Waypoint({
                element: document.getElementById("waypoint_" + school.school_code),
                offset: 100,
                handler: function () {
                  var school = this.element.dataset;
                  // Waypoint.disableAll();
                  // Waypoint.enableAll();
                  // $('.data-lister').removeClass("peek");
                  // $('#waypoint_' + school.school_code).toggleClass("peek");
                  
                }
              })

              $('#open_' + school.school_code).click(function(){
                var school_code = $(this).parent().data('school_code');
                $(this).parent().parent().toggleClass("expand");
                console.log($('#caret_' + school_code).attr("class"));
                $('#caret_' + school_code).toggleClass("fa-caret-right");
                $('#caret_' + school_code).toggleClass("fa-caret-down");
       
                
                Waypoint.refreshAll()

              });
      
              
            } 
          } //build_scaffolding
      
            build_scaffolding();
   
      
            function build_section(school, div_id){
      
              thisDiv = $(div_id);

              //PEEK
              // thisDiv.append('<div class="lister__peek"><p>This is a lil preview of the content</p></div>')
      
      
              //TODO: style
              // thisDiv.append('<h4 class="lister__school_district">' + school.district + '</h4>');

                //TODO: add address label
                thisDiv.append('<svg id="map_' + school.school_code + '" viewbox="0 100 960 300"></svg>');
    
              //TODO: style
              thisDiv.append('<h3 class="lister__subhead">Restart Status Notes</h3><h4 class="lister__approved_on">Approved for restart status on ' + school.board_approved + ', 2017.</h4>')
      
            
              //selector, json_file, isSingle
              var coord = [school.longitude, school.latitude];
              nc_map("#map_" + school.school_code, "nc-counties.json", coord,  true)
      
              //TODO: elements of flex (build structure in a sheet to accept this)
      
              //TODO: student performance
              thisDiv.append('<h3 class="lister__subhead">Student Performance</h3><svg id="spg_' + school.school_code + '" width="500" height="300" viewbox="0 0 500 300"></svg>');

              var spgschool = all_spg["" + school.school_code][0]
 
              var spg_data = [
                {
                  "id": school.official_school_name,
                  "values": [
                    {
                      "date": "2016",
                      "score": spgschool.spg_grade_1617
                    },
                    {
                      "date": "2015",
                      "score": spgschool.spg_grade_1516
                    },
                    {
                      "date": "2014",
                      "score": spgschool.spg_grade_1415
                    },
                    {
                      "date": "2013",
                      "score": spgschool.spg_grade_1314
                    }
                  ]
                },
                {
                  "id": "Statewide",
                  "values": [
                    {
                      "date": "2016",
                      "score": 65
                    },
                    {
                      "date": "2015",
                      "score": 64
                    },
                    {
                      "date": "2014",
                      "score": 62
                    },
                    {
                      "date": "2013",
                      "score": 62
                    }
                  ]
                }
              ];


              line_chart("#spg_" + school.school_code, "", true, spg_data);


    
              //TODO: maintain bar order here
              thisDiv.append('<h3 class="lister__subhead">Racial/Ethnic Breakdown</h3><svg id="race_' + school.school_code + '" width="400" height="200" viewbox="0 0 400 200"></svg>');
              var race_ethn = [
                {"label": "Asian ", "value": school.asian_percentage},
                {"label": "Hispanic ", "value": school.hispanic_percentage},
                {"label": "Black ", "value": school.black_percentage},
                {"label": "White ", "value": school.white_percentage},
                {"label": "Two or More Races ", "value": school.two_percentage}
              ]

              basic_bar("#race_" + school.school_code, true, race_ethn);


      
              //TODO: econom disadv (add the bar)
              thisDiv.append('<h3 class="lister__subhead">Percentage Economically Disadvantaged</h3><h4 class="lister__econ_disadv">' + school.percent_economically_disadvantaged + ' of students are economically disadvantaged.</h4><div id="econdis_' + school.school_code + '"></div>');

              line_plot('#econdis_' + school.school_code,false,40,45);
              

      
            }
  
    }); //doc ready