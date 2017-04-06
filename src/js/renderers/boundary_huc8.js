/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("boundary_huc8", {
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:huc8&format=image/png"),
  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts:
        {
          layers: 'vt:huc8',
          format: 'image/png',
          transparent: true,
          opacity: 1,
          zIndex: 100
        },

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
});
