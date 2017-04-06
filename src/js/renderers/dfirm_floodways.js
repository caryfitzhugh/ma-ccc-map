
RendererTemplates.wms("dfirm_floodways", {
  update_legend:
    CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_EMERGENCY_SP_NOCACHE_v2/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=1&FORMAT=image/png"),


  url: CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_EMERGENCY_SP_NOCACHE_v2/MapServer/WMSServer?"),
  wms_opts:  {
      layers: 1,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true },

  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_EMERGENCY_SP_NOCACHE_v2/MapServer/WMSServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=1&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=1&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=application%2Fjson&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }
});
