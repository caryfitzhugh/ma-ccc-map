/*global L, Renderers, MAP_SERVER_HOST */
RendererTemplates.wms("superfund", {
  update_legend: {
    url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&format=image/png"),
    text: "Superfund site boundary (click for info)",
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts: {
    layers: 'superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2',
    format: 'image/png',
    transparent: true,
    opacity: 0,
    zIndex: -1},

  get_feature_info_url: function (active_layer) {
    return CDN("http://sedac.ciesin.columbia.edu/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&"+
          "QUERY_LAYERS=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&"+
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
