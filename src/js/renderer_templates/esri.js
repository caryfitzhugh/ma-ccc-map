RendererTemplates.esri = function (layer_id, opts) {
  function get_esri_opts(active_layer) {
    var esri_opts = opts.esri_opts;
    if (typeof opts.esri_opts === 'function') {
      esri_opts = opts.esri_opts(active_layer);
    }
    return esri_opts;
  }

  var renderer = RendererTemplates.base(layer_id, opts,
    {
      render: function (map, active_layer, z_index) {
        Renderers.create_leaflet_layer(
          map,
          active_layer,
          get_esri_opts(active_layer),
          () => {
            var layer = new L.esri.dynamicMapLayer(get_esri_opts(active_layer));
            layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
            layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
            return layer;
          });

        var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
        var layers = Renderers.get_all_leaflet_layers(map,active_layer);
        var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_esri_opts(active_layer))

        _.each(layers, function (layer) {
          // Hide the ones which aren't active
          if (active_leaflet_layer._leaflet_id === layer._leaflet_id) {
            layer.setOpacity(opacity);
            layer.setZIndex(z_index);
          } else {
            layer.setOpacity(0);
            layer.setZIndex(-1);
          }
        });
      },
      remove: function (map, active_layer) {
        var layers = Renderers.get_all_leaflet_layers(map,active_layer);
        _.each(layers, function (ll) {
          if (map.hasLayer(ll)) {
            map.removeLayer(ll);
          }
        });
      }
    });
  Renderers[layer_id] = renderer;
}
