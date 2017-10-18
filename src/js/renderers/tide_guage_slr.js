RendererTemplates.geojson_points("tide_guage_slr", {
  parameters: {
    opacity: false,
    year: "2000",
    percentile: "17",
    rcp: "4.5",
    options: {
      rcp: {
        "4.5": "4.5",
        "8.5": "8.5"
      },
      percentile: {
        "17": "17",
        "50": "50",
        "83": "83",
        "99": "99"
      },

      year: {
        "2000": "2000",
        "2010": "2010",
        "2020": "2020",
        "2030": "2030",
        "2040": "2040",
        "2050": "2050"

      }
    }
  },
  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:tide_guage_slr&maxFeatures=1000&outputFormat=application%2Fjson"),

  pointToLayer: function (feature, latlng) {
    var icon_url;
    icon_url = './img/PowerPlant_hydroelectric.png'
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl: icon_url,
            iconSize: [21, 24],
            iconAnchor: [11, 24],
            popupAnchor: [0, -22]
        }),
        title: feature.properties.plant_name
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
      <div class='detail-block show-confidence'>
        {{#u.to_sorted_values_from_hash(parameters.options.tide_guage_slr_to_key)}}
          <div style='width: 50%; float: left;'>
            <img src={{'./img/PowerPlant_' + key + '.png'}}>
            <strong>{{value}}</strong>
          </div>
        {{/u.to_sorted_values_from_hash(parameters.options.tide_guage_slr_to_key)}}
      </div>
  `,
});
