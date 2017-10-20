RendererTemplates.geojson_points("tide_guage_slr", {
  parameters: {
    opacity: false,
    rcps: [4.5,
           8.5],
    percentiles: [
        "All",
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
        2050
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

    return _.reduce(all_data, function (all, feature) {
      if (year === feature.properties.year) {
        if (rcp === feature.properties.rcp) {
          all.push(feature);
        }
      }

      return all;
    }, []);
  },
  pointToLayer: function (active_layer, feature, latlng) {
    // Find
    let percentile = active_layer.parameters.percentiles[active_layer.parameters.options.percentile_indx];
    let values = [];
    let params = active_layer.parameters;
    if (percentile === 'All') {
      values.push(['17', feature.properties.p17])
      values.push(['50', feature.properties.p50])
      values.push(['83', feature.properties.p83])
      values.push(['99', feature.properties.p99])
    } else {
      values.push([percentile, feature.properties["p"+percentile]]);
    }
    return L.marker(latlng, {
        icon: L.divIcon({
            className: 'tide-guage-slr-icon',
            html: values.map((v) => {
                return `<div class='bar percentile percentile-${v[0]}'> ${v[1]} </div>`;
              }).join(" ")
            })
    });
  },

  popupContents: function (feature) {
    var index = feature.properties.reason_cls

    return "<strong>Name: " + feature.properties.name + "</strong></br>" +
           "Year: " + feature.properties.year + "<br/>"+
          "</br>"+
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
