/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("spa_surface_water", {
  update_legend:
     CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=10&FORMAT=image/gif&SCALE=55467893.20400156"),

  url:  CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer?"),
  wms_opts:  {
      layers: 10,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true
    },

  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=10&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=10&"+
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
