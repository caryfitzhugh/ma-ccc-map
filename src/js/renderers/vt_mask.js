RendererTemplates.geojson_polygons('vt_mask' ,{
  update_legend: null,

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:state_mask&maxFeatures=50&outputFormat=application%2Fjson"),

  each_polygon: function (polygon) {
        polygon.setStyle({"color": "#000"});
      }
});
