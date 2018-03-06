RendererTemplates.geojson_points("sea_level_rise", {
  parameters: {
    opacity: false,
    likelihoods: [
        17,
        50,
        83,
        99],
   years: [
        2020,
        2030,
        2040,
        2050,
        2060,
        2070,
        2080,
        2090,
        2100
        ],
    options: {
      year_indx: 3,
      likelihood_indx: 2,
    }
  },

  url: "http://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:tide_gauge_slr&maxFeatures=1000&outputFormat=application%2Fjson",

  selectData: function (active_layer, all_data) {
    let year = active_layer.parameters.years[active_layer.parameters.options.year_indx];
    let likelihood = active_layer.parameters.likelihoods[active_layer.parameters.options.likelihood_indx];
    let all_vals = [];
    let max = 0;
    all_data.forEach((feature) => {
      all_vals = all_vals.concat([feature.properties.p17, feature.properties.p50,
                                  feature.properties.p83, feature.properties.p99]);
    });
    max = _.max(all_vals);
    let data = _.reduce(all_data, function (all, feature) {
      if (year === feature.properties.year) {
          let val = feature.properties["p"+likelihood];

          let new_feature = _.cloneDeep(feature);
          new_feature.properties.value = [likelihood, val, ( val / max)];
          new_feature.properties.all_data = all_data
          all.push(new_feature);
      }

      return all;
    }, []);

    return data;
  },
  pointToLayer: function (active_layer, feature, latlng) {
    let v = feature.properties.value;
    let height = v[2] * 100;
    // Forces signing on a number, returned as a string
    return L.marker(latlng, {
        icon: L.divIcon({
            className: 'tide-guage-slr-icon',
            iconAnchor: [0, 100],
            html: `<div class='bar likelihood likelihood-${v[0]}'>
                <div class='bar' style='height: ${height}%; width: 100%;'> </div>
                <div class='label'>${Renderers.utils.addPlusSign(v[1])} ft</div>
            </div>`
            })
    });

  },
  onEachGeometry: (all_data, active_layer, feature, layer) => {
    layer.on({
      click: (e) =>  {
        let year = feature.properties.year;
        let likelihood = active_layer.parameters.likelihoods[active_layer.parameters.options.likelihood_indx];
        let cur_station_id = feature.properties.station_id;
        let table_data = {};

        _.each(all_data.features, (dat) => {
          if (dat.properties.station_id === cur_station_id) {
            table_data[dat.properties.year] = dat;
          }
        });

        let sorted_table_data = [];
        _.each(_.keys(table_data).sort(), (k) => {
          sorted_table_data.push(table_data[k]);
        });
        Views.ControlPanel.fire("layer-show-singleton-details",
            active_layer, {name: feature.properties.name, table_data: sorted_table_data, year: year, likelihood: likelihood});
      }
    });
  },
  info_template: `
        <div class='col-xs-2'>
          <label> {{{name}}}</label>
        </div>
        <div class='col-xs-10'>
          <table class='table slr-table'>
            <thead>
              <tr>
                <th style='text-align: center;'
                    colspan='{{u.object_entries_count(table_data) + 1}}'> Relative mean seal level (feet NAVD88) for {{name}} </th>
              </tr>
              <tr>
                <th> Scenario </th>
                {{#table_data}}
                  <th> {{properties.year}}</th>
                {{/table_data}}
              </tr>
            </thead>
            <tbody>
              <tr class="{{likelihood === 13 ? 'active-scenario' : ''}}">
                <td>Intermediate </td>
                {{#table_data}}
                  <td class='{{year === properties.year ? 'active-year' : ''}}'> {{properties.p17}} </td>
                {{/table_data}}
              </tr>
              <tr class="{{likelihood === 50 ? 'active-scenario' : ''}}">
                <td>Intermediate High</td>
                {{#table_data}}
                  <td class='{{year === properties.year ? 'active-year' : ''}}'> {{properties.p50}} </td>
                {{/table_data}}
              </tr>
              <tr class="{{likelihood === 83 ? 'active-scenario' : ''}}">
                <td>High</td>
                {{#table_data}}
                  <td class='{{year === properties.year ? 'active-year' : ''}}'> {{properties.p83}} </td>
                {{/table_data}}
              </tr>
              <tr class="{{likelihood === 99 ? 'active-scenario' : ''}}">
                <td>Extreme</td>
                {{#table_data}}
                  <td class='{{year === properties.year ? 'active-year' : ''}}'> {{properties.p99}} </td>
                {{/table_data}}
              </tr>
            </tbody>
          </table>
  `,
  legend_template: `
      <div class='detail-block opacity'>
        <label  decorator='tooltip:Use slider to adjust Year'> Year: </label>
        <input type="range" value="{{parameters.options.year_indx}}"
          min="0"
          max="{{parameters.years.length-1}}">
        {{parameters.years[parameters.options.year_indx]}}
      </div>

      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a likelihood'> Scenario: </label>
        <select value='{{parameters.options.likelihood_indx}}'>
          <option value='0'>Intermediate</option>
          <option value='1'>Intermediate-High</option>
          <option value='2'>High</option>
          <option value='3'>Extreme (Maximum physically plausible)</option>
        </select>
      </div>

      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <svg width="12" height="12">
          <rect width="12" height="12" style="fill:blue;stroke-width:3;stroke:blue" />
        </svg>
        Relative Mean Sea Level (feet NAVD88)
      </div>
  `,
});
