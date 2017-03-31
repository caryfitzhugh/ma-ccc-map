/*global L, Renderers, GEOSERVER */
Renderers.boundary_huc8 = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },

  update_legend_url:
     Renderers.defaults.legend_url.constant(CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:huc8&format=image/png")),

  create_leaflet_layers: Renderers.defaults.create.wms(
        CDN (GEOSERVER + "/vt/wms/"),
        {
          layers: 'vt:huc8',
          format: 'image/png',
          transparent: true,
          opacity: 1,
          zIndex: 100
        }),

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/vt/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=vt:huc8&"+
              "QUERY_LAYERS=vt:huc8&"+
              "STYLES=&"+
              "BBOX=<%= bbox %>&"+
              "FEATURE_COUNT=5&"+
              "HEIGHT=<%= height %>&"+
              "WIDTH=<%= width %>&"+
              "FORMAT=text%2Fhtml&"+
              "INFO_FORMAT=application%2Fjson&"+
              "SRS=EPSG%3A4326&"+
              "X=<%= x %>&Y=<%= y %>");
  }
};
