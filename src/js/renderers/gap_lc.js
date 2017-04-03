
Renderers.gap_lc = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: Renderers.defaults.legend_url.constant(
    CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=0&FORMAT=image/png")),

  create_leaflet_layers: Renderers.defaults.create.wms(
    CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer?"),
    {
      layers: 0,
      format: 'image/png',
      opacity: 0,
      zIndex: -1,
      transparent: true }),

  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://gis1.usgs.gov/arcgis/services/gap/GAP_Land_Cover_NVC_Formation_Landuse/MapServer/WmsServer?") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=0&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=0&"+
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
