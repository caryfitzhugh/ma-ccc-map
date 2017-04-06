RendererTemplates.geojson_points("hospitals", {
  url: CDN("https://opendata.arcgis.com/datasets/128c419772234581ac4209e4e429f882_5.geojson"),
  update_legend: "./img/hospital.png",
  pointToLayer: function (feature, latlng) {
      return L.marker(latlng, {
          icon: L.icon({
              iconUrl: './img/hospital.png',
              iconSize: [32, 36],
              iconAnchor: [24, 56],
              opacity: 0,
              popupAnchor: [-8, -36]
          }),
          title: feature.properties.name
      });
  },
  popupContents: function (feature) {
    return "<strong>" + feature.properties.HOSPITAL + "</strong></br>" +
           " " + feature.properties.NEWSTR + "<br/>"+
           " " + feature.properties.CITST + " " + feature.properties.ZIP + "<br/>"  +
           " " + feature.properties.PHONE
           +"</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
