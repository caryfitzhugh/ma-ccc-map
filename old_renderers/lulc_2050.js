Renderers.lulc_2050 = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "img\/lulc_2050.png";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.esri.dynamicMapLayer({
            url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer"),
            // No longer defaults to image, but JSON
            layers: [208],
            f:"image",
            clickable: false,
            attribution: 'NYS DEC'});

      layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  }
};
