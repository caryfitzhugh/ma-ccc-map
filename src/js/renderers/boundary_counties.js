/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("boundary_counties", {

  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:county_boundary&format=image/png"),

  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts: {
          layers: 'vt:county_boundary',
          format: 'image/png',
          transparent: true,
          opacity: 1,
          zIndex: 100
        },

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
});
