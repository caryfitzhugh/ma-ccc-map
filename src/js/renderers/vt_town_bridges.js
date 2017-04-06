RendererTemplates.wms("vt_town_bridges", {
  update_legend: CDN("http://maps.vcgi.vermont.gov/arcgis/services/EGC_services/OPENDATA_VCGI_TRANSPORTATION_SP_NOCACHE_v1/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=2&FORMAT=image/png"),

  url:  CDN("http://maps.vcgi.vermont.gov/arcgis/services/EGC_services/OPENDATA_VCGI_TRANSPORTATION_SP_NOCACHE_v1/MapServer/WMSServer?"),
  wms_opts:  {
      layers: 2,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true },

  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://maps.vcgi.vermont.gov/arcgis/services/EGC_services/OPENDATA_VCGI_TRANSPORTATION_SP_NOCACHE_v1/MapServer/WMSServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=2&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=2&"+
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
