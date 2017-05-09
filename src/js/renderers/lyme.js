/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("lyme", {

  update_legend: {
    url: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:lyme&format=image/png"),
    text: "2015 Incidence of Lyme Disease per 100,000 Persons",
  },

  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts: {
          layers: 'vt:lyme',
          format: 'image/png',
          transparent: true,
          opacity: 1,
          zIndex: 100
        },

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/vt/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=vt:lyme&"+
              "QUERY_LAYERS=vt:lyme&"+
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
