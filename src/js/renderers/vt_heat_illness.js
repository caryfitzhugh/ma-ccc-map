RendererTemplates.wms("vt_heat_illness", {
  update_legend: function (active_layer) {
    active_layer.legend_url = CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:heat_illness&time="+
                                  active_layer.parameters.time + "&format=image/png");
  },
  url: CDN (GEOSERVER + "/vt/wms/"),

  wms_opts: function (active_layer) {
    return    {
        layers: 'vt:heat_illness',
        time: active_layer.parameters.time,
        format: 'image/png',
        transparent: true,
        zIndex: 100
      }
  },
  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/vt/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=vt:heat_illness&"+
              "TIME="+ active_layer.parameters.time +"&"+
              "QUERY_LAYERS=vt:heat_illness&"+
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
