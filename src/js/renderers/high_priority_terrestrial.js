/*global LayerInfo, Renderers, _ */
Renderers.high_priority_terrestrial = function (name, display_layer) {
  return RendererTemplates.wms(name, {
    update_legend: {
      url: CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&" +
              "LAYER=" + display_layer  +
              "&FORMAT=image/gif&SCALE=55467893.20400156"),
    },
    url: CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?"),
    wms_opts: {
      layers: display_layer,
      minZoom: 7,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true
    },
    get_feature_info_xml_url: function (active_layer) {
      return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer") +
            "?SERVICE=WMS&VERSION=1.1.1&"+
            "REQUEST=GetFeatureInfo&"+
            // NOT SURE ON LAYERS?
            "LAYERS=" + display_layer +
            // NOT SURE ON LAYERS?
            "&QUERY_LAYERS=" + display_layer +
            "&STYLES=&"+
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
};
