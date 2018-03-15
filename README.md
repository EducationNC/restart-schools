# Restart Schools

A data application displaying information about approved restart schools in North Carolina as of December 2017.

## To Do
- add county-by-county zoom on the map. https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2
- fix search click thing

## Getting Started

* Download this repository
* Run `python -m SimpleHTTPServer 8000` and open `localhost:8000` in the browser of your choice

### Prerequisites

No prerequisites required to run this application.

## Deployment

This application can be viewed outside of its story location on Heroku at [restart-schools.herokuapp.com](restart-schools.herokuapp.com).

## Original data sources

Original data sources for this application can be found in [this google sheet](https://docs.google.com/spreadsheets/d/13fINa1qRKsLznJwTONoMgswjGEUh2hc7iXwNWy228CM/edit?usp=sharing).

## To update the data

1. export [app_data](https://docs.google.com/spreadsheets/d/13rmGj4I6474HTwWnTejrxGKnU7yPt5lh_60iTVKCy0k/edit#gid=0) as a CSV and convert to JSON
    - rename the file basic_data.js and store the JSON into `const ALL_DATA`
2. recalculate state-level and restart-level school performance grade medians
    - _restart:_ use the vl_ spg sheets in app_data to get each year's grade per school and then do a median formula in app_data/main
    - _statewide:_ in the vl_ spg sheets, do the median formula
    - save medians into app_data/median_svg
    - put the statewide medians into the spg_data var in calc.js around line 536
3. save overall spg data
    - export app_data as CSV and convert into keyed JSON, keyed on the school_code field
    - save as spg_restart.js and save the JSON into `const spg_restart`
    - **make sure the spg fields are named to match the vars in calc.js**
4. update school population pullouts
    - make sure app_data/pivot_districtpop is up-to-date
    - copy over changes to app_data/school_pop_pullouts and export as csv
    - convert to JSON and save into `const SCHOOL_POP` in school_pop_pullouts.js.
5. update race/ethn statewide and restart level
    - calculate median of race/ethn values in app_data/main
      -  input those values into restart_race.json
    - calculate median of race/ethn values in vl_race_etn_17
      - input those values into race_state.json

## Built With

* [Bootstrap 4](https://v4-alpha.getbootstrap.com/getting-started/download/)

## Authors

* **Lindsay Carbonell** - [EducationNC](https://github.com/EducationNC)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Other Credit
- TopoJSON for N.C. counties from GitHub user [deldersveld](https://github.com/deldersveld/topojson/blob/master/countries/us-states/NC-37-north-carolina-counties.json).
- Map built with help from [this d3 tutorial](http://duspviz.mit.edu/d3-workshop/mapping-data-with-d3/) from DUSPViz
