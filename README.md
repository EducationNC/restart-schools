# Restart Schools

<!-- <img src="apple_ruler.png" /> -->

A data application displaying information about approved restart schools in North Carolina as of December 2017.

## To Do
- add county-by-county zoom on the map. https://bl.ocks.org/mbostock/2206590
- get individual pull-outs for: Barwell, Haw River, Goldsboro High, Coker-Wimberly
- list out where all the data sources for the application are
- check rounding on percentages

## Getting Started

* Download this repository
* Open index.html in the browser of your choice

### Prerequisites

No prerequisites required to run this application.

## Deployment

This graphic will be built directly into the WordPress CMS and tested outside of the CMS in this repository.
Also can be viewed temporarily on Heroku at [restart-schools.herokuapp.com](restart-schools.herokuapp.com).

## To update the data

1. export [app_data](https://docs.google.com/spreadsheets/d/13rmGj4I6474HTwWnTejrxGKnU7yPt5lh_60iTVKCy0k/edit#gid=0) as a CSV and convert to JSON
  - rename the file basic_data.js and store the JSON into `const ALL_DATA`
2. recalculate state-level and restart-level school performance grade medians
  - _restart:_ use the vl_ spg sheets in app_data to get each year's grade per school and then do a median formula on restart schools
  - _statewide:_ in the vl_ spg sheets, do the median formula
  - save medians into app_data/median_svg
  - put the statewide medians into the spg_data var in calc.js around line 536
3. save overall spg data
  - export app_data as CSV and convert into keyed JSON, keyed on the school_code field
  - save as spg_restart.js and save the JSON into `const spg_restart`
  - **make sure the spg fields are named to match the vars in calc.js**
4. SCHOOL POPULATION PULLOUTS
5. RACE/ETHNICITY: STATEWIDE AND SCHOOL-LEVEL

## Built With

* [Bootstrap 4](https://v4-alpha.getbootstrap.com/getting-started/download/)

## Authors

* **Lindsay Carbonell** - [EducationNC](https://github.com/EducationNC)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Other Credit
- TopoJSON for N.C. counties from GitHub user [deldersveld](https://github.com/deldersveld/topojson/blob/master/countries/us-states/NC-37-north-carolina-counties.json).
- Map built with help from [this d3 tutorial](http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/) from DUSPViz
