var vt_groundwater_withdrawls_legend = [
  {v:0,c: "#433433"}
];

RendererTemplates.geojson_polygons('vt_groundwater_withdrawls' ,{
  update_legend: function (active_layer) {
    active_layer.parameters.legend_range = vt_groundwater_withdrawls_legend;
  },

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:groundwater_withdrawls_2020&maxFeatures=50&outputFormat=application%2Fjson"),
  each_polygon: function (polygon) {
    polygon.setStyle({"color": vt_groundwater_withdrawls_legend[0].c,
                     "fillColor": vt_groundwater_withdrawls_legend[0].c});
  },
  popupContents: function (feature) {
    return "<strong>Tract " + feature.properties.tract + "</strong></br>" +
           " 2005 " + feature.properties.water_05 + "<br/>"  +
           " 2020 " + feature.properties.water_20 + " <br/>"+
           "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
