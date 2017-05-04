RendererTemplates.geojson_lines('vt_boundary' ,{
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:state_boundaryline&format=image/png"),

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:state_boundaryline&maxFeatures=50&outputFormat=application%2Fjson"),

  each_line: function (line) {
        //line.setStyle({"opacity": 15});
      }
});
