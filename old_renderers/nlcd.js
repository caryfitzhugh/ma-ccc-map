Renderers.nlcd = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("http://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=1&FORMAT=image/gif&SCALE=55467893.20400156");
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.TileLayer.WMS(CDN("http://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?"), {
                      layers: 33,
                      format: 'image/png',
                      opacity: 0,
                      zIndex: -1,
                      transparent: true });
      layer.addTo(map);
      layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  }
  /*get_feature_info_url: function (active_layer) {
    return CDN("http://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?") +
          "SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=&"+
          // NOT SURE ON LAYERS?
          "QUERY_LAYERS=&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=50&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "INFO_FORMAT=application%2Fgeojson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
   }*/
};
