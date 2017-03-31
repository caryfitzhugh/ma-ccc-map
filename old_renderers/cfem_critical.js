Renderers.cfem_critical = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("img\/hazus_critical.png");
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {

      var layer = new L.TileLayer.WMS(CDN("https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer/WmsServer?"), {
        layers: 0,
        format: 'image%/png',
        transparent: true,
        opacity: 0,
        zIndex: -1
      });

      layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  }

};
