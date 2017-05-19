RendererTemplates.geojson_polygons('vt_groundwater' ,{
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_reclass&format=image/png"),

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:groundwater_reclass&maxFeatures=50&outputFormat=application%2Fjson"),
  popupContents: function (feature) {
    return "<strong>" + feature.properties.site_name + "</strong></br>" +
           " " + feature.properties.acres + " acres<br/>"+
           " " + feature.properties.town + "<br/>"  +
           "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
