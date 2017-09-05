RendererTemplates.ma_projected_climate_data = function (layer_id, opts) {
  RendererTemplates.ma_climate_data(layer_id, {
    clone_layer_name: function(active_layer) {
      let p = active_layer.parameters.options;
      var name =  opts.title + " " + p.scenario + " " + p.metric + " Y:" + active_layer.parameters.years[p.year_indx] + " S:" + p.season + " by " + p.summary;
      return name;
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{geojson.name}} </label>
        </div>
        <div class='col-xs-6'>
          {{active_layer.parameters.years[active_layer.parameters.options.year_indx]}}
          {{active_layer.parameters.all_seasons[active_layer.parameters.options.season]}}

          ${opts.info_legend || ""}
          {{{active_layer.parameters.all_metrics[active_layer.parameters.options.metric]}}}
        </div>
        <div class='col-xs-4'>
          {{geojson.data_value}}
        </div>
    `,
    legend_template: `
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Summary Area'> Summary: </label>
        <select value='{{parameters.options.summary}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_summaries)}}
            <option value='{{key}}'>{{{value}}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_summaries)}}
        </select>
      </div>
      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Scenario'> Scenario: </label>
        <select value='{{parameters.options.scenario}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_scenarios)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_scenarios)}}
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
        <label decorator='tooltip:Choose a Season'> Season: </label>
        <select value='{{parameters.options.season}}'>
          {{#u.to_sorted_values_from_hash(parameters.all_seasons)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.all_seasons)}}
        </select>
      </div>

      {{#u.object_entries_count(parameters.all_metrics || []) > 1}}
        <div class='detail-block show-confidence'>
          <label decorator='tooltip:Choose a Metric'> Metric: </label>
          <select value='{{parameters.options.metric}}'>
            {{#u.to_sorted_values_from_hash(parameters.all_metrics)}}
              <option value='{{key}}'>{{value}}</option>
            {{/u.to_sorted_values_from_hash(parameters.all_metrics)}}
          </select>
        </div>
      {{/u.object_entries_count(parameters.all_metrics || []) > 1}}

      {{#{metrics: parameters.metrics_ranges[parameters.options.metric],
          legend: '` + opts.legend + `',
          precision: '` + opts.legend_precision + `',
          colors: parameters.color_ranges[parameters.options.metric]} }}
        {{> map_color_block_legend_template }}
      {{/{metrics: parameters.metrics_ranges[parameters.options.metric], foo: 1} }}
    `,
    data_url: opts.data_url,
    onLoadedData: (layer_data, active_layer) => {
      // Snag all the years which have the 'min' field
      let min_years = _.uniq(
        _.flatten(
          _.map(layer_data, (root) => {
            return _.compact(_.map(root, (yr_data, yr) => {
                if (yr_data['min']) {
                  return parseInt(yr,10)
                } else {
                  return null;
                }
            }));
        }))).sort();
      active_layer.parameters.years = min_years;

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
        let value = year_data[p.scenario][p.season][p.metric];
        feature.properties.data_value = value;

        let color = colorize(active_layer.parameters.metrics_ranges[p.metric], value, active_layer.parameters.color_ranges[p.metric]);
        layer.setStyle({fillColor: color, color: color});
      } catch( e) {
        feature.properties.data_value = null;

        console.log('failed to find value for ', p.metric, feature.properties.name, layer_data);
        let rgb = `transparent`;//rgb(${gray}, ${gray}, ${gray})`
        layer.setStyle({fillColor: rgb, color: rgb});
      }
    },

    parameters: {
      opacity: 100,
      color_ranges: opts.color_ranges,
      all_metrics: opts.all_metrics,
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
        metric: Object.keys(opts.all_metrics)[0],
        scenario: 'med',
        summary: 'county',
      },
    }
  });
};
