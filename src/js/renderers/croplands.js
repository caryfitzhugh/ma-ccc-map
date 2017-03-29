Renderers.croplands = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-croplands-2000&format=image/png");
    active_layer.legend_url_text = "% of cell area in crops";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.TileLayer.WMS(CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"), {
                      layers: 'aglands:aglands-croplands-2000',
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
};
