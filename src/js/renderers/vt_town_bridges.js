
Renderers.vt_town_bridges = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: Renderers.defaults.legend_url.constant(
    CDN("http://maps.vcgi.vermont.gov/arcgis/services/EGC_services/OPENDATA_VCGI_TRANSPORTATION_SP_NOCACHE_v1/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=2&FORMAT=image/png")),

  create_leaflet_layers: Renderers.defaults.create.wms(
    CDN("http://maps.vcgi.vermont.gov/arcgis/services/EGC_services/OPENDATA_VCGI_TRANSPORTATION_SP_NOCACHE_v1/MapServer/WMSServer?"),
    {
      layers: 2,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true }),

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
};
