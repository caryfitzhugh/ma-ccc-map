RendererTemplates.wms = function (layer_id, opts) {
  function get_wms_opts(active_layer) {
    var wms_opts = opts.wms_opts;
    if (typeof opts.wms_opts === 'function') {
      wms_opts = opts.wms_opts(active_layer);
    }
    return wms_opts;
  }

  var renderer = Object.assign({},
    RendererTemplates.base(layer_id, opts));

  renderer.render = function (map, active_layer, z_index) {
    Renderers.update_templates(active_layer, opts);
    Renderers.create_leaflet_layer(
      map,
      active_layer,
      get_wms_opts(active_layer),
      () => {
        var layer = new L.TileLayer.WMS(opts.url, get_wms_opts(active_layer));
        layer.on("tileload", function (loaded) {
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        });
        layer.on("tileerror", function (err) {
          Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
        });
        return layer;
      });

    var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
    var layers = Renderers.get_all_leaflet_layers(map,active_layer);
    var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_wms_opts(active_layer))

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
  };

  Renderers[layer_id] = renderer;
}
