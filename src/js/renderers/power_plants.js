RendererTemplates.geojson_points("power_plants", {
  parameters: {
    opacity: 100,
    options: {
    }
  },
  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:power_plants&maxFeatures=500&outputFormat=application%2Fjson"),
  update_legend: null,
  pointToLayer: function (feature, latlng) {
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

    var power_plants_to_key = {
      "solar": "Solar",
      "natural gas": "Natural Gas",
      "petroleum": "Petroleum",
      "hydroelectric":"Hydroelectric",
      "biomass":"Biomass",
      "wind":"Wind",
      "nuclear":"Nuclear",
      "coal":"Coal",
      "pumped storage":"Pumped Storage"
    };

    var index = feature.properties.reason_cls
    //var desc = beach_closures_descriptions[index];
    //console.log(index,power_plants_to_key[index])
    return "<strong>Name: " + feature.properties.plant_name + "</strong></br>" +
           "Description: " + feature.properties.source_des + "<br/>"+
           "Specs: " + feature.properties.tech_desc + "<br/>"+
           "<a href='https://www.eia.gov/electricity/data/browser/#/plant/" + feature.properties.plant_code + "' target='_blank_'>View in Electricity City Browser</a><br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <img src='{{icon_url}}'/>
      </div>
  `
});
