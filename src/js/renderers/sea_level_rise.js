RendererTemplates.geojson_points("sea_level_rise", {
  parameters: {
    opacity: false,
    rcps: [4.5,
           8.5],
    likelihoods: [
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
      year_indx: 3,
      likelihood_indx: 1,
      rcp_indx: 1,
    }
  },

  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:tide_guage_slr&maxFeatures=1000&outputFormat=application%2Fjson"),

  selectData: function (active_layer, all_data) {
    let year = active_layer.parameters.years[active_layer.parameters.options.year_indx];
    let rcp = active_layer.parameters.rcps[active_layer.parameters.options.rcp_indx];
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
        if (rcp === feature.properties.rcp) {
          let val = feature.properties["p"+likelihood];

          let new_feature = _.cloneDeep(feature);
          new_feature.properties.value = [likelihood, val, ( val / max)];
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

  popupContents: function (feature) {
    var index = feature.properties.reason_cls

    return `<h5>${feature.properties.name}</h5>
           <strong>Year: </strong>${feature.properties.year}<br/>
           <strong>Emissions Scenario: </strong>${feature.properties.rcp}<br/>
           <table>
              <thead> <tr> <th> Likelihood</th><th> Value </th></tr></thead>
              <tbody>
                <tr><td>Likely (17%)</td><td>${feature.properties.p17}</td> </tr>
                <tr><td>Median (50%)</td><td>${feature.properties.p50}</td> </tr>
                <tr><td>Likely (83%)</td><td>${feature.properties.p83}</td> </tr>
                <tr><td>Exceptionally Unlikely to Exceed (99.9%)</td><td>${feature.properties.p99}</td> </tr>
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
        <label decorator='tooltip:Choose an emissions Model'> Emissions Scenario: </label>
        <select value='{{parameters.options.rcp_indx}}'>
          <option value='0'>Medium</option>
          <option value='1'>High</option>
        </select>
      </div>

      <div class='detail-block show-confidence'>
        <label decorator='tooltip:Choose a likelihood'> Likelihood: </label>
        <select value='{{parameters.options.likelihood_indx}}'>
          <option value='0'>Likely - Lower</option>
          <option value='1'>Median</option>
          <option value='2'>Likely - Upper</option>
          <option value='3'>Exceptionally Unlikely to Exceed</option>
        </select>
      </div>

      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <svg width="12" height="12">
          <rect width="12" height="12" style="fill:blue;stroke-width:3;stroke:blue" />
        </svg>
        Projected Sea Level Rise (ft)
      </div>
  `,
});
