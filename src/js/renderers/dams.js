RendererTemplates.geojson_points("dams", {
  url: CDN("https://opendata.arcgis.com/datasets/75b9d3671f474323a22165ba5a4c2677_161.geojson"),
  update_legend: "./img/Dam.png",
  pointToLayer: function (feature, latlng) {
    var icon_url;
    if(String(feature.properties.DamHazClass).length <5) {
      icon_url= "./img/Dam.png";
    }
    else icon_url = './img/Dam_' + feature.properties.DamHazClass + '.png';
    return L.marker(latlng, {
        icon: L.icon({
            iconUrl: icon_url,
            iconSize: [21, 24],
            iconAnchor: [11, 24],
            popupAnchor: [0, -22]
        }),
        title: feature.properties.DamName
    });
  },
  popupContents: function (feature) {
    return "<strong>Name: " + feature.properties.DamName + "</strong></br>" +
           "Status:" + feature.properties.DamStatus + "<br/>"+
           "Hazard Class:" + feature.properties.DamHazClass + "<br/>"+
          "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
