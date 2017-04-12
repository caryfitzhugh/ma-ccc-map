/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("high_priority_terrestrial", {
  update_legend:
     CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=2&FORMAT=image/gif&SCALE=55467893.20400156"),

  url:  CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?"),
  wms_opts:  {
      layers: 2,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true
    },

  get_feature_info_url: function (active_layer) {
    return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=2&"+
              "QUERY_LAYERS=2&"+
              "STYLES=&"+
              "BBOX=<%= bbox %>&"+
              "FEATURE_COUNT=5&"+
              "HEIGHT=<%= height %>&"+
              "WIDTH=<%= width %>&"+
              "FORMAT=application%2Fjson&"+
              "INFO_FORMAT=application%2Fjson&"+
              "SRS=EPSG%3A4326&"+
              "X=<%= x %>&Y=<%= y %>");
  }
});
