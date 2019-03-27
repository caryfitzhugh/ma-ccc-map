const findDataForMAProjectedData = (layer_data, area, season, year, scenario) => {
  let found_value = null;
  // console.log("Looking for " , area, season, year);
  try {
    _.each(layer_data.features, (feature) => {
      if (feature.properties.name === area) {
        // console.log("found ", area);
        _.each(feature.properties.data, (data) => {
          if (data.season === season) {
            // console.log("found ", season);
            data_value = _.find(data.values, (value) => {
              return value.year === year;
            });
            if (data_value) {
              // console.log("found ", year);
              throw {
                value: data_value["delta_" + scenario],
                season: season,
                scenario: scenario,
                year: year,
                area: area,
                season_data: data,
                area_data: feature
              }
            } else {
              // console.log(year , "not found", _.map(data.values, (v) => { return v.year} ));
            }
          } else {
            // console.log(data.season, " != ", season)
          }
        });
      } else {
        // console.log(feature.properties.name, " != ", area);
      }
    })
  } catch (data_value) {
    return data_value;
  }
  // Otherwise NUTIN!
};

RendererTemplates.ma_projected_climate_data = function (layer_id, opts) {
  RendererTemplates.ma_climate_data(layer_id, {

    clone_layer_name: function(active_layer) {
      let p = active_layer.parameters.options;
      var name =  opts.title + " Y:" + active_layer.parameters.years[p.year_indx] + "s S:" + p.season + " by " + p.summary;
      return name;
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{{name}}}</label>
        </div>
        <div class='col-xs-10'>
          <table class='table'>
            <thead>
              <tr>
                <th style='text-align: center;'
                    colspan='{{u.object_entries_count(active_layer.parameters.all_seasons) + 2}}'> {{geojson.name}} {{geojson.geomtype}}
                </th>
              </tr>
              <tr>
                <th> </th>
                <th></th>
                <th class='deltas' style='text-align: center;'
                    colspan='{{u.object_entries_count(active_layer.parameters.all_seasons)}}'>
                      ` + opts.legend + ` </th>
              </tr>
              <tr>
                <th> Season </th>
                <th> Baseline (` + opts.legend_units + `)</th>
                <th> Emissions Scenario </th>
                {{#active_layer.parameters.years}}
                  <th> {{.}}s</th>
                {{/active_layer.parameters.years}}
              </tr>
            </thead>
              <tbody>
                {{#u.sort_by(geojson.location_data.area_data.properties.data, 'season')}}
                  <tr class="{{(season === geojson.location_data.season ? 'active-season' : '')}} {{(("high" == geojson.location_data.scenario) ? 'active-scenario' : '')}}">
                    <td >{{u.capitalize(season)}}</td>
                    <td >{{u.to_fixed(baseline, ${opts.info_precision})}}</td>
                    <td> High RCP8.5 </td>

                    {{#u.sort_by(values, 'year')}}
                      <td class='{{((year === geojson.location_data.year) ? 'active-year' : '')}}'>
                      {{{u.add_sign(u.to_fixed(delta_high, ${opts.info_precision}))}}}</td>
                    {{/sort_by(values, 'year')}}
                  </tr>

                  <tr class="{{(season === geojson.location_data.season ? 'active-season' : '')}} {{(("low" == geojson.location_data.scenario) ? 'active-scenario' : '')}}">

                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td> Medium RCP4.5 </td>

                    {{#u.sort_by(values, 'year')}}
                      <td class='{{((year === geojson.location_data.year) ? 'active-year' : '')}}'>
                      {{{u.add_sign(u.to_fixed(delta_low, ${opts.info_precision}))}}}</td>
                    {{/sort_by(values, 'year')}}
                  </tr>
                {{/u.sort_by(geojson.location_data.area_data.properties.data, 'season')}}
              </tbody>
          </table>
    `,
    legend_template: `
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Scenario'> Scenario: </label>
        <select value='{{parameters.options.scenario}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_scenarios)}}
            <option value='{{key}}'>{{{value}}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_scenarios)}}
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Summary Area'> Summary: </label>
        <select value='{{parameters.options.summary}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_summaries)}}
            <option value='{{key}}'>{{{value}}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_summaries)}}
        </select>
      </div>
      <div class='detail-block opacity'>
        <label  decorator='tooltip:Use slider to adjust Decade'> Decade: </label>
        <input type="range" value="{{parameters.options.year_indx}}"
          min="0"
          max="{{parameters.years.length-1}}">
        {{parameters.years[parameters.options.year_indx]}}s
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Season'> Season: </label>
        <select value='{{parameters.options.season}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_seasons)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_seasons)}}
        </select>
      </div>

      {{#{metrics: parameters.metrics_ranges[parameters.options.season][parameters.options.scenario],
          legend: '` + opts.legend + `',
          inverted: '` + opts.invert_scale + `',
          quantiled: true,
          signed: true,
          precision: '` + opts.legend_precision + `',
          colors: parameters.color_range} }}
        {{> map_color_block_legend_template }}
      {{/{metrics: parameters.metrics_ranges[parameters.options.season]}}
    `,
    data_url: opts.data_url,

    onLoadedData: (layer_data, active_layer) => {
      let baselines = {};

      let years = _.uniq(_.flatten(_.map(layer_data.features, (feature) => {
        return _.flatten(_.map(feature.properties.data, (data) => {
            return _.flatten(_.map(data.values, (value) => {
              // This is because winter years are -1 year.
              return value.year;
            }));
        }));
      }))).sort();

      active_layer.parameters.years = years;

      // Calculate the color brewer bands.
      // Get min / max values for all these metrics across all the years / seasons / etc.
      // track baselines
      let data_values = {};
      _.each(layer_data.features, (feature) => {
        _.each(feature.properties.data, (data) => {
          data_values[data.season] = data_values[data.season] || {'high': [], 'low': []};
          _.each(data.values, (value) => {
            data_values[data.season]['high'].push(value.delta_high);
            data_values[data.season]['low'].push(value.delta_low);
          });
        });
      });

      let color_range = _.cloneDeep(active_layer.parameters.color_range);
      if (opts.invert_scale) {
        color_range.reverse();
      }

      _.each(active_layer.parameters.all_seasons, (name, season) => {
        let all_values = [].concat(data_values[season]['high'].concat(data_values[season]['low']));
        let scale = d3.scaleQuantile().domain(all_values).range(color_range).quantiles();

        if (opts.invert_scale) {
          scale.reverse()
        }
        active_layer.parameters.metrics_ranges[season] = {
          'low': scale,
          'high': scale
        };
      });
      console.log(active_layer.parameters.metrics_ranges);
    },
    onEachGeometry: (layer_data, active_layer, feature, layer) => {
      let p = active_layer.parameters.options;
      //let ma_trans = RendererTemplates.ma_climate_data_translation;
      let colorize = RendererTemplates.ma_climate_data_colorize;

      try {
        let location_data = findDataForMAProjectedData(layer_data,
                                               feature.properties.name,
                                               p.season,
                                               active_layer.parameters.years[p.year_indx],
                                               p.scenario
                                              );

        feature.properties.location_data = location_data;

        let color = colorize(active_layer.parameters.metrics_ranges[p.season][p.scenario],
                             location_data.value,
                             active_layer.parameters.color_range,
                             opts);

        layer.setStyle({fillColor: color, color: color});

      } catch( e) {
        feature.properties.location_data = null;

        let available = _.map(layer_data.features, (f) => { return f.properties.name });

        console.log('failed to find value for ', p.metric,
                    "Feature Name: [", feature.properties.name, "] ",
                    "Available Names:", available,
                    e);

        let rgb = `transparent`;
        layer.setStyle({fillColor: rgb, color: rgb});
      }
    },

    parameters: {
      opacity: 100,
      color_range: opts.color_range,
      metrics_ranges: {},
      all_summaries: {
        "county": "County",
        //"state": "State",
        "basin": "Drainage Basin",
        //"watershed": "HUC8 Watershed",
        //"6km": "6km Bounding Box",
      },
      all_scenarios: {"high": "High RCP8.5", "low": "Medium RCP4.5"},
      all_seasons: {
        "annual": "Annual",
        "fall": "Fall",
        "winter": "Winter",
        "spring": "Spring",
        "summer": "Summer",
      },
      years: [],
      options: {
        year_indx: 0,
        season: 'annual',
        summary: 'county',
        scenario: 'high'
      },
    }
  });
};
