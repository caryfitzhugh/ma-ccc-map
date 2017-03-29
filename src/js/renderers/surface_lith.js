Renderers.surface_lith = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("http://rmgsc.cr.usgs.gov/arcgis/services/ecosys_US/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1");
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.TileLayer.WMS(CDN("http://rmgsc.cr.usgs.gov/arcgis/services/ecosys_US/MapServer/WmsServer?"), {
                      layers: 0,
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
