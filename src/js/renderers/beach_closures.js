RendererTemplates.geojson_points("beach_closures", {
  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:lake_beach_closures&maxFeatures=50&outputFormat=application%2Fjson"),
  update_legend: "./img/Beach.png",
  pointToLayer: function (feature, latlng) {
    var icon_url;
    if(feature.properties.status2014=='N/A') {
      icon_url= "./img/Beach.png";
    }
    else icon_url = './img/Beach_' + feature.properties.status2014 + '.png';
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl: icon_url,
            iconSize: [21, 24],
            iconAnchor: [11, 24],
            popupAnchor: [0, -22]
        }),
        title: feature.properties.name
    });
  },
  popupContents: function (feature) {
    return "<strong>Name: " + feature.properties.name + "</strong></br>" +
           "Status (2014): " + feature.properties.status2014 + "<br/>"+
           "Number of closures: " + feature.properties.num_cls + "<br/>"+
           "Reason for closure: " + feature.properties.reason_cls + "<br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
