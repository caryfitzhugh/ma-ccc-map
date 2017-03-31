/*global L, Renderers, GEOSERVER */
Renderers.boundary_counties = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url:
     Renderers.defaults.legend_url.constant(CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:county_boundary&format=image/png")),

  create_leaflet_layers: Renderers.defaults.create.wms(
        CDN (GEOSERVER + "/vt/wms/"),
        {
          layers: 'vt:county_boundary',
          format: 'image/png',
          transparent: true,
          opacity: 1,
          zIndex: 100
        }),

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/vt/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=vt:county_boundary&"+
              "QUERY_LAYERS=vt:county_boundary&"+
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
};
