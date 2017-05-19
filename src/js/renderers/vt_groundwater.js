RendererTemplates.geojson_lines('vt_groundwater' ,{
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_reclass&format=image/png"),

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:groundwater_reclass&maxFeatures=50&outputFormat=application%2Fjson"),
});
