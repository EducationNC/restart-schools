$(document).ready(function(){

  var schools = [];

  for (i in ALL_DATA){
    schools.push(ALL_DATA[i].official_school_name);
  }


  $( "#school_search" ).autocomplete({
    source: schools
  });

  $( "#school_search" ).autocomplete({
    minLength: 0,
    source: schools,
    focus: function( event, ui ) {
      $( "#school_search" ).val( ui.item.label );
      return false;
    },
    select: function( event, ui ) {
      $('.data-lister').empty();
      var selected_school_name = ui.item.label
      find_school(selected_school_name, null)

      return false;
    }
  })
  .autocomplete( "instance" )._renderItem = function( ul, item ) {
    return $( "<li>" )
      .append( "<div>" + item.label + "</div>" )
      .appendTo( ul );
  };



      var pymChild = new pym.Child();

      pymChild.sendHeight()


      var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
          var matches, substringRegex;

          // an array that will be populated with substring matches
          matches = [];

          // regex used to determine if a string contains the substring `q`
          substrRegex = new RegExp(q, 'i');

          // iterate through the pool of strings and for any string that
          // contains the substring `q`, add it to the `matches` array
          $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
              matches.push(str);
            }
          });

          cb(matches);
        };
      };

      $('#the-basics .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
      },
      {
        name: 'schools',
        source: substringMatcher(schools)
      });

      pymChild.sendHeight()

     
  // function filterData(school_code){
              
  //   $('.data-lister').hide();
    
  //   $('.data-lister[data-school_code="' + school_code + '"]').show();

  //   $('html, body').animate({scrollTop: $('#data-list').offset().top}, 300);
  // }

  

  $('#the-basics .typeahead').change(function(){
    //console.log($(this).val())
    $('.data-lister').hide();

    find_school($(this).val(), null);
    
    //$('.data-lister[data-official_school_name="' + $(this).val() + '"]').show();
 
    // data-official_school_name
  })

  function find_school(selected_school_name, selected_school_code){
    console.log('find')
    console.log(typeof(selected_school_name))

    
    
    for (i in ALL_DATA){
      var school = ALL_DATA[i];

      if (selected_school_name){
        if (school.official_school_name == selected_school_name){
          build_section(school, "#lister_" + school.school_code)
         }
      }

      if (selected_school_code){
        if (school.school_code == selected_school_code){
          build_section(school, "#lister_" + school.school_code)
         }
      }
      
      pymChild.sendHeight()
      
    }
  }

  

  Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
  }


  function percent_table(){

    for (i in SCHOOL_POP){
      $('.percent-table').append('<tr data-fip="' + SCHOOL_POP[i].fip + '" class="map-hover-item"><td class="table-text">' + SCHOOL_POP[i].district + '</td><td class="table-num">' + SCHOOL_POP[i].percent_restart_by_pop + '</td></tr>');
    }
    
    
  }

  percent_table();


  function line_plot(selector, isJustAxis, range_val1, range_val2) {
    var width = 600,
    height = 100;

    var data = [0, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100];

    var svg = d3.select(selector)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([0, width - 100]);

    var x_axis = d3.axisBottom()
                  .scale(scale);

    var graphic = svg.append("g")
    .attr("transform", "translate(10, 40)");

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

  function nc_map(selector, json_file, coord){

    var schools_width = $(selector).width()
    schools_height = $(selector).height();

      var schools_svg = d3.select(selector);

      var projection = d3.geoAlbers()
      .center([7, 35.73])
      .rotate([85.8,.5])
      .scale(5500);

      var geoPath = d3.geoPath()
      .projection(projection);


      var q = d3_queue.queue();
      q
      .defer(d3.json, "data/" + json_file)
      .await(ready);

      function ready(error, counties){

        //var g = schools_svg.append("g");

        //g.on("click", reset);

        var background = schools_svg.append("g");
        var foreground = schools_svg.append("g");
        //var active = d3.select(null);

        

        var schools = schools_svg.append( "g" )
          .attr("x", 0)
          .attr("y", 0);
          //for zoom
        //   .on("click", stopped, true);

        // var zoom = d3.zoom()
        //   .scaleExtent([1,8])
        //   .on("zoom", zoomed);
        
        // schools_svg
        //   .call(zoom);

        background.append("g")
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
          //for zoom
          //.on("click", clicked); 

        foreground.selectAll( "path" )
          .data( restartschools.features )
          .enter()
          .append( "path" )
          .attr("class", function(d,i){ return "school_dot";})
          .attr("data-school_code", function(d,i){ return d.properties.school_code;})
        .on("click", function(d){$('#school_search').val(''); $('.data-lister').hide(); find_school(null,d.properties.school_code); $('html, body').animate({scrollTop: $('#data-list').offset().top}, 300);})
          .attr( "stroke", "transparent" )
          .attr( "fill", "#777" )
          .attr( "d", geoPath );

      
      /***for zoom***/
          // function clicked(d) {
          //   if (active.node() === this) return reset();
          //   active.classed("active", false);
          //   active = d3.select(this).classed("active", true);

          //   var bounds = geoPath.bounds(d),
          //       dx = bounds[1][0] - bounds[0][0],
          //       dy = bounds[1][1] - bounds[0][1],
          //       x = (bounds[0][0] + bounds[1][0]) / 2,
          //       y = (bounds[0][1] + bounds[1][1]) / 2,
          //       scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / schools_width, dy / schools_height))),
          //       translate = [schools_width / 2 - scale * x, schools_height / 2 - scale * y];

          //   schools_svg.transition()
          //       .duration(750)
          //       .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); 
          //     }

          //     function reset() {
          //       active.classed("active", false);
          //       active = d3.select(null);
              
          //       schools_svg.transition()
          //           .duration(750)
          //           .call( zoom.transform, d3.zoomIdentity );
          //     }

          // function zoomed() {
          //   g.style("stroke-width", 1.5 / d3.event.scale + "px");
          //   g.attr("transform", d3.event.transform);
          // }

          // function stopped() {
          //   if (d3.event.defaultPrevented) d3.event.stopPropagation();
          // }

        
    }

  


   

   
    

      
    

     
 
  

     
    } //nc_map


      //BASIC BAR CHART - https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998

      function basic_bar(selector, isRawJson, json){
        var bar_svg = d3.select(selector),
        bar_margin = {top: 20, right: 20, bottom: 30, left: 100},
        bar_width = +bar_svg.attr("width") - bar_margin.left - bar_margin.right,
        bar_height = +bar_svg.attr("height") - bar_margin.top - bar_margin.bottom;
          
        var bar_x = d3.scaleLinear().range([0, bar_width]);
        var bar_y = d3.scaleBand().range([bar_height, 0]);
        
        var g = bar_svg.append("g")
            .attr("transform", "translate(" + bar_margin.left + "," + bar_margin.top + ")");
        
        if (!isRawJson){
        d3.json(json, function(error, data) {
            if (error) throw error;
          
            data.sort(function(a, b) { return a.value - b.value; });
          
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
                .style('fill', '#6F257F');
                
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
                .style('fill', '#6F257F');
                
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
  
  var line_x = d3.scaleLinear().range([0, line_width]),
  line_y = d3.scaleLinear().range([line_height, 0]),
  
  line_z = d3.scaleOrdinal(d3.schemeCategory10);
  
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
        .text("School Performance Score");
  
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
        console.log(d)
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
  
  line_svg.append("text")
    .text("statewide")
    .attr("transform", "translate(" + (line_width+60) + "," + line_y(60) + ")")
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif");

  line_svg.append("text")
    .text("school")
    .attr("transform", "translate(" + (line_width+60) + "," + line_y(40) + ")")
    .attr("dy", "0.35em")
    .style("font", "10px sans-serif");
  
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

  }
   
      function type(d, _, columns) {
        // d.date = parseTime(d.date);
        d.date = d.date;
        for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
      }
    } //line_chart

      //build those d3
      nc_map("#schools-map svg", "nc-counties.json", "", false);
      
            function build_section(school, div_id){

              console.log("build")
              
              var keys = Object.keys(school);
              //1a. create the data wrappers
              $('#data-list').append('<div class="data-lister" id="lister_' + school.school_code + '"><div class="lister__title_wrapper"><h2 class="lister__school_name" id="open_' + school.school_code + '">' + school.official_school_name + '</h2><h4 class="lister__school_district">' + school.district + '</h4></div></div>');
      
              //1b. iterate thru the data keys
              for (j in keys) {
                thisKey = keys[j];
                $('#lister_' + school.school_code).attr('data-' + thisKey, school[thisKey]);
              }
      
              $('#school-list').append('<p>' + school.official_school_name + '</p>');
      
              thisDiv = $(div_id);

              thisDiv.append('<h3 class="lister__map_descr" style="grid-row:2;">' + school.official_school_name + ' is located in the ' + school.district + ' district, which contains a total of <span class="bold">' + school.district_restart_count + ' restart school(s)</span>. <span class="bold">' + school.district_restart_pop + ' students</span> in this county are in schools approved for restart, which is about <span class="bold">' + (school.district_percent_restart*100).toPrecision(2) + ' percent</span> of the district\'s student population. <span class="bold">' + school.percent_economically_disadvantaged + '</span> of students are economically disadvantaged.</h3>');
      
            
              //selector, json_file, isSingle
              var coord = [school.longitude, school.latitude];
              nc_map("#map_" + school.school_code, "nc-counties.json", coord,  true)

      
              //TODO: student performance
              thisDiv.append('<h3 class="lister__subhead">School Performance</h3><p class="lister__descr">Grades are based on the school’s achievement score on state tests (80 percent) and students\' academic growth (20 percent). The performance scores are converted to a 100-point scale.</p><svg id="spg_' + school.school_code + '" width="500" height="300" viewbox="0 0 500 300"></svg>');

              var thisSchoolCode = school.school_code;
             
              
              if (thisSchoolCode.toString().length != 6){
                thisSchoolCode = (thisSchoolCode).pad(6);
  
              }
              
              var thisSchoolCode = thisSchoolCode.toString();
        

              var spgschool = spg_restart[thisSchoolCode]
 
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

              thisDiv.append('<h3 class="lister__subhead">Racial/Ethnic Breakdown</h3><svg id="race_' + school.school_code + '" width="400" height="200" viewbox="0 0 400 200"></svg>');
              var race_ethn = [
                {"label": "Asian ", "value": school.asian_percentage},
                {"label": "Hispanic ", "value": school.hispanic_percentage},
                {"label": "Black ", "value": school.black_percentage},
                {"label": "White ", "value": school.white_percentage},
                {"label": "Two or More Races ", "value": school.two_percentage}
              ]

              basic_bar("#race_" + school.school_code, true, race_ethn);           

      
            }
  
    }); //doc ready