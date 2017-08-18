RendererTemplates.ma_climate_data('ma_degree_days', {
  clone_layer_name: function(active_layer) {
    let p = active_layer.parameters.options;
    var name =  "MA Degree Days " + p.metric + " Y:" + active_layer.parameters.years[p.year_indx] + " S:" + p.season + " by " + p.summary;
    return name;
  },
  legend_template: `
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a Summary Area'> Summary: </label>
      <select value='{{parameters.options.summary}}'>
        {{#u.to_sorted_values_from_hash(parameters.all_summaries)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.all_summaries)}}
      </select>
    </div>
    <div class='detail-block opacity'>
      <label  decorator='tooltip:Use slider to adjust Year'> Year: </label>
      <input type="range" value="{{parameters.options.year_indx}}"
        min="0"
        max="{{parameters.years.length-1}}">
      {{parameters.years[parameters.options.year_indx]}}
    </div>
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a Scenario'> Scenario: </label>
      <select value='{{parameters.options.scenario}}'>
        {{#u.to_sorted_values_from_hash(parameters.all_scenarios)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.all_scenarios)}}
      </select>
    </div>
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a Season'> Season: </label>
      <select value='{{parameters.options.season}}'>
        {{#u.to_sorted_values_from_hash(parameters.all_seasons)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.all_seasons)}}
      </select>
    </div>
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a Metric'> Metric: </label>
      <select value='{{parameters.options.metric}}'>
        {{#u.to_sorted_values_from_hash(parameters.all_metrics)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.all_metrics)}}
      </select>
    </div>

    {{#{metrics: parameters.metrics_ranges[parameters.options.metric],
        legend: parameters.all_metrics[parameters.options.metric],
        precision: 0,
        colors: parameters.color_ranges[parameters.options.metric]} }}
      {{> map_color_block_legend_template }}
    {{/{metrics: parameters.metrics_ranges[parameters.options.metric], foo: 1} }}
  `,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/degree_days.json",
  onLoadedData: (layer_data, active_layer) => {
    // Snag all the years which have the 'obs' field
    let obs_years = _.uniq(
      _.flatten(
        _.map(layer_data, (root) => {
          return _.compact(_.map(root, (yr_data, yr) => {
              if (yr_data['obs']) {
                return parseInt(yr,10)
              } else {
                return null;
              }
          }));
      }))).sort();
    active_layer.parameters.years = obs_years;

    // Calculate the color brewer bands.
    // Get min / max values for all these metrics across all the years / seasons / etc.
    let metrics_ranges = {};
    _.each(layer_data, (root) => {
      _.each(root, (years) => {
        _.each(years, (yr_data) => {
          _.each(yr_data, (season) => {
            _.each(season, (value, metric) => {
              if (!metrics_ranges[metric]) {
                metrics_ranges[metric] = {min: value, max: value};
              }

              if (metrics_ranges[metric].min > value) {
                metrics_ranges[metric].min = value;
              }

              if (metrics_ranges[metric].max < value) {
                metrics_ranges[metric].max = value;
              }
            });
          });
        });
      });
    });

    _.each(metrics_ranges, (values, key) => {
      metrics_ranges[key].range = values.max - values.min;
    });

    active_layer.parameters.metrics_ranges = metrics_ranges;
  },
  onEachGeometry: (layer_data, active_layer, feature, layer) => {
    let p = active_layer.parameters.options;
    let ma_trans = RendererTemplates.ma_climate_data_translation;
    let colorize = RendererTemplates.ma_climate_data_colorize;

    try {
      let year_data = layer_data[ma_trans[feature.properties.name]][active_layer.parameters.years[p.year_indx]];
      let value = year_data['obs'][p.season][p.metric];

      let color = colorize(active_layer.parameters.metrics_ranges[p.metric], value, active_layer.parameters.color_ranges[p.metric]);
      layer.setStyle({fillColor: color, color: color});
    } catch( e) {
      console.log('failed to find value for ', p.metric, feature.properties.name, layer_data);
      let rgb = `transparent`;//rgb(${gray}, ${gray}, ${gray})`
      layer.setStyle({fillColor: rgb, color: rgb});
    }
  },

  parameters: {
    opacity: 100,
    color_ranges: {
      'h': colorbrewer.Oranges[9],
      'g': colorbrewer.Purples[9],
      'c': colorbrewer.Blues[9],
    },
    all_metrics: {
      "g" : "Growing Degree Day Accumulation",
      "h" : "Heating Degree Day Accumulation",
      "c" : "Cooling Degree Day Accumulation",
    },
    all_summaries: {
      "county": "County",
      "state": "State",
      //"watershed": "HUC8 Watershed",
      //"6km": "6km Bounding Box",
    },
    all_scenarios: {
      "med": "Medium",
      "max": "High",
      "min": "Low",
      "obs": "Observed",
    },
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
      scenario: 'med',
      metric: "g",
      summary: 'state',
    },
  }
});
