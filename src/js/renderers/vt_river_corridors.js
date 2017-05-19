RendererTemplates.wms('vt_river_corridors' ,{
  update_legend: CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer?request=GetLegendGraphic&LAYER=20"),
  url: CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer"),
  wms_opts: {
    layers: 20,
    format: 'image/png',
    transparent: true,
    opacity: 1,
    zIndex: 100,
  },
  /*
  get_feature_info_url: function (active_layer) {
    return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_WATER_SP_NOCACHE_v2/MapServer/WMSServer"+
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=20&"+
              "QUERY_LAYERS=20&"+
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
  */
});
