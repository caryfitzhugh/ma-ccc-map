RendererTemplates.ma_historical_climate_data = function (layer_id, opts) {
  RendererTemplates.ma_climate_data(layer_id, {
    clone_layer_name: function(active_layer) {
      let p = active_layer.parameters.options;
      var name =  opts.title + " " + p.metric + " Y:" + active_layer.parameters.years[p.year_indx] + " S:" + p.season + " by " + p.summary;
      return name;
    },
    info_template: `
        <div class='col-xs-2'>
          <label> {{name}} <br>
          </label>
        </div>
        <div class='col-xs-2'>
          {{geojson.name}}
        </div>
        <div class='col-xs-4'>
          {{{active_layer.parameters.all_metrics[active_layer.parameters.options.metric]}}} ({{active_layer.parameters.all_seasons[active_layer.parameters.options.season]}} Average {{active_layer.parameters.years[active_layer.parameters.options.year_indx]-5}}-{{active_layer.parameters.years[active_layer.parameters.options.year_indx]+4}})
        </div>
        <div class='col-xs-4'>
          {{geojson.data_value}}${opts.info_legend || ""}
        </div>
    `,
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
              <option value='{{key}}'>{{{value}}}</option>
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
          if (years.obs) {
            _.each(years.obs, (season) => {
              // We should only be looking at "OBS"
              _.each(season, (value, metric) => {
                if (!metrics_ranges[metric]) {
                  metrics_ranges[metric] = [];
                }
                metrics_ranges[metric].push(value);
              });
            });
          }
        });
      });

      _.each(metrics_ranges, (values, key) => {
        values.sort();
        let max = d3.max(values)
        let min = d3.min(values);
        let color_buckets = active_layer.parameters.color_ranges[key].length;
        let quantiles = d3.range(0, color_buckets).map((q) =>  d3.quantile(values,(1/color_buckets) * q));

        metrics_ranges[key] = {
          quantiles: quantiles,
          min: min, max: max, range: max-min};
      });


      active_layer.parameters.metrics_ranges = metrics_ranges;
    },
    onEachGeometry: (layer_data, active_layer, feature, layer) => {
      let p = active_layer.parameters.options;
      let ma_trans = RendererTemplates.ma_climate_data_translation;
      let colorize = RendererTemplates.ma_climate_data_colorize;

      try {
        let loc = ma_trans[feature.properties.name];
        let year = active_layer.parameters.years[p.year_indx];
        let year_data = layer_data[loc][year];

        let value = year_data['obs'][p.season][p.metric];
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
        summary: 'county',
      },
    }
  });
};
