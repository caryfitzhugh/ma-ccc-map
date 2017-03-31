Renderers.nfhl = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "img\/nfhlLegend.png";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.esri.dynamicMapLayer({
            url: CDN("http://www.hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"),
            // No longer defaults to image, but JSON
            layers: [
              0,
           //   1,
           //   2,
           //   3,
           //   4,
           //   5,
           //  6,
           //  7,
           //  8,
           //  9,
           //  10,
           //  11,
           //  12,
           //  13,
           //  14,
           //  15,
             16,
           //  17,
           //  18,
           //  19,
           //  20,
           //  21,
           //  22,
           //  23,
           //  24,
           //  25,
           //  26,
           //   27,
              28,
           //  29,
           //  30,
           //  21,
           //  32
              ],
            f:"image",
            clickable: false,
            attribution: 'FEMA'});

      layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  }
};
