RendererTemplates.geojson_points("hospitals", {
  parameters: {
    opacity: false,
    options: {

    }
  },
  url: CDN(GEOSERVER + "/ma/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ma:hospitals&maxFeatures=500&outputFormat=application%2Fjson"),

  pointToLayer: function (active_layer, feature, latlng) {
    var icon_url;
    icon_url = './img/hospital.png'
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl: icon_url,
            iconSize: [21, 24],
            iconAnchor: [11, 24],
            popupAnchor: [0, -22]
        }),
        title: feature.properties.shortname
    });
  },

  popupContents: function (feature) {
    var index = feature.properties.reason_cls

    return "<strong>" + feature.properties.shortname + "</strong></br>" +
           "Address: " + feature.properties.address + ", " + feature.properties.town + "<br/>"+
            "Emergency Room:" + feature.properties.er_status  + "<br/>"+
             "Trauma Center: " + feature.properties.trauma +  "<br/>"+
              "Teaching: " + feature.properties.teaching + "<br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  },
  legend_template: `
      <div class='detail-block show-confidence' style='float: left; clear: both;'>
          <div style='width: 50%; float: left;'>
            <img src={{'./img/hospital.png'}}>
            <strong>{{value}}</strong>
          </div>
      </div>
  `,
});
