RendererTemplates.wms("croplands", {
  update_legend: {
    url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-croplands-2000&format=image/png"),
    text: "Amount of active cropland within grid cell.",
  },

  url:  CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts: {
    layers: 'aglands:aglands-croplands-2000',
    format: 'image/png',
    opacity: 0,
    zIndex: -1,
    transparent: true },
  get_feature_info_url: function (active_layer) {
    return CDN("http://sedac.ciesin.columbia.edu/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=aglands:aglands-croplands-2000&"+
          "QUERY_LAYERS=aglands:aglands-croplands-2000&"+
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
