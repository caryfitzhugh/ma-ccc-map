RendererTemplates.geojson_points("power_plants", {
  parameters: {
    opacity: false,
    options: {
      power_plants_to_key: {
        "solar": "Solar",
        "natural gas": "Natural Gas",
        "petroleum": "Petroleum",
        "hydroelectric":"Hydroelectric",
        "biomass":"Biomass",
        "wind":"Wind",
        "nuclear":"Nuclear",
        "coal":"Coal",
        "pumped storage":"Pumped Storage"
      }
    }
  },
  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:power_plants&maxFeatures=500&outputFormat=application%2Fjson"),

  pointToLayer: function (active_layer, feature, latlng) {
    var icon_url;
    icon_url = './img/PowerPlant_' + feature.properties.primsource + '.png'
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

    return "<strong>Name: " + feature.properties.plant_name + "</strong></br>" +
           "Description: " + feature.properties.source_des + "<br/>"+
           "Specs: " + feature.properties.tech_desc + "<br/>"+
           "<a href='https://www.eia.gov/electricity/data/browser/#/plant/" + feature.properties.plant_code + "' target='_blank_'>View in Electricity Data Browser</a><br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  },
  legend_template: `
      <div class='detail-block show-confidence' style='float: left; clear: both;'>
        {{#u.to_sorted_values_from_hash(parameters.options.power_plants_to_key)}}
          <div style='width: 50%; float: left;'>
            <img src={{'./img/PowerPlant_' + key + '.png'}}>
            <strong>{{value}}</strong>
          </div>
        {{/u.to_sorted_values_from_hash(parameters.options.power_plants_to_key)}}
      </div>
  `,
});
