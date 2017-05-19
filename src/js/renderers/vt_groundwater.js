RendererTemplates.geojson_lines('vt_groundwater' ,{
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_reclass&format=image/png"),

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:groundwater_reclass&maxFeatures=50&outputFormat=application%2Fjson"),
});
RendererTemplates.wms("vt_groundwater", {
  update_legend: {
    url: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_reclass&format=image/png"),
  },
  url: CDN(GEOSERVER + "/wms"),

  wms_opts: {
    layers: 'vt:groundwater_reclass',
    format: 'image/png',
    transparent: true,
    opacity: 0,
    zIndex: 100},

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          "LAYERS=vt:groundwater_reclass",
          "QUERY_LAYERS=vt:groundwater_reclass",
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }
});
