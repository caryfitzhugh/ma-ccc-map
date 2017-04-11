RendererTemplates.geojson_points("invasives", {
  url: CDN("https://opendata.arcgis.com/datasets/b1ae7b7b110447c3b452d9cacffeed36_174.geojson"),
  update_legend: "./img/hospital.png",
  pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
          icon: L.icon({
              iconUrl: './img/Invasive.png',
              iconSize: [24, 28],
              iconAnchor: [12, 28],
              popupAnchor: [0, -25]
          }),
          title: feature.properties.InvasiveName
      });
  },
  popupContents: function (feature) {
    return "<strong>Species: " + feature.properties.InvasiveName + "</strong></br>" +
           " Observation Date:" + feature.properties.ObservationDate + "<br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
