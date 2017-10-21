RendererTemplates.geojson_points("tide_guage_slr", {
  parameters: {
    opacity: false,
    rcps: [4.5,
           8.5],
    percentiles: [
        17,
        50,
        83,
        99],
   years: [
        2000,
        2010,
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
      year_indx: 0,
      percentile_indx: 0,
      rcp_indx: 0,
    }
  },

  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:tide_guage_slr&maxFeatures=1000&outputFormat=application%2Fjson"),

  selectData: function (active_layer, all_data) {
    let year = active_layer.parameters.years[active_layer.parameters.options.year_indx];
    let rcp = active_layer.parameters.rcps[active_layer.parameters.options.rcp_indx];
    let percentile = active_layer.parameters.percentiles[active_layer.parameters.options.percentile_indx];
    let all_vals = [];
    let max = 0;
    all_data.forEach((feature) => {
      all_vals = all_vals.concat([feature.properties.p17, feature.properties.p50,
                                  feature.properties.p83, feature.properties.p99]);
    });
    max = _.max(all_vals);

    let data = _.reduce(all_data, function (all, feature) {
      if (year === feature.properties.year) {
        if (rcp === feature.properties.rcp) {
          let val = feature.properties["p"+percentile];

          let new_feature = _.cloneDeep(feature);
          new_feature.properties.value = [percentile, val, ( val / max)];
          all.push(new_feature);
        }
      }

      return all;
    }, []);

    return data;
  },
  pointToLayer: function (active_layer, feature, latlng) {
    let v = feature.properties.value;
    let height = v[2] * 100;
    return L.marker(latlng, {

        icon: L.divIcon({
            className: 'tide-guage-slr-icon',
            html: `<div class='bar percentile percentile-${v[0]}'>
                <div class='bar' style='height: ${height}%; width: 100%;'> </div>
                <div class='label'>${v[1]}</div>
            </div>`
            })
    });
  },

  popupContents: function (feature) {
    var index = feature.properties.reason_cls

    return `<strong>Name: ${feature.properties.name}</strong></br>
           <strong>Year:</strong>${feature.properties.year}<br/>
           <strong>RCP:</strong>${feature.properties.rcp}<br/>
           <table>
              <thead> <tr> <th> Percentile</th><th> Value </th></tr></thead>
              <tbody>
                <tr><td>17%</td><td>${feature.properties.p17}</td> </tr>
                <tr><td>50%</td><td>${feature.properties.p50}</td> </tr>
                <tr><td>83%</td><td>${feature.properties.p83}</td> </tr>
                <tr><td>99%</td><td>${feature.properties.p99}</td> </tr>
              </tbody>
           </table>` +
           Renderers.utils.zoom_to_location_link( feature.geometry );
  },
  legend_template: `
      <div class='detail-block opacity'>
        <label  decorator='tooltip:Use slider to adjust Year'> Year: </label>
        <input type="range" value="{{parameters.options.year_indx}}"
          min="0"
          max="{{parameters.years.length-1}}">
        {{parameters.years[parameters.options.year_indx]}}
      </div>

      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Model'> Model: </label>
        <select value='{{parameters.options.rcp_indx}}'>
          {{#u.to_sorted_values_from_hash(parameters.rcps)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.rcps)}}
        </select>
      </div>

      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a Percentile'> Percentile: </label>
        <select value='{{parameters.options.percentile_indx}}'>
          {{#u.to_sorted_values_from_hash(parameters.percentiles)}}
            <option value='{{key}}'>{{value}}</option>
          {{/u.to_sorted_values_from_hash(parameters.percentiles)}}
        </select>
      </div>
  `,
});
