RendererTemplates.wms = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },

    update_legend: Renderers.update_legend(opts),
    get_feature_info_xml_url: opts.get_feature_info_xml_url,
    get_feature_info_url: opts.get_feature_info_url,
    _layers: {},
  }

  renderer.render = function (map, active_layer, z_index) {
    var current_wms_opts = opts.wms_opts;
    // First check if the opts have changed (are they a function?)
    if (typeof opts.wms_opts === 'function') {
      current_wms_opts = opts.wms_opts(active_layer);
    }

    if (!renderer._layers[stringify(current_wms_opts)]) {
      var layer = new L.TileLayer.WMS(opts.url, current_wms_opts);
      layer.on("tileload", function (loaded) {
        Views.ControlPanel.fire("tile-layer-loaded", active_layer);
      });
      layer.on("tileerror", function (err) {
        Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
      });
      layer.addTo(map);
      active_layer.leaflet_layer_ids.push(layer._leaflet_id);
      renderer._layers[stringify(current_wms_opts)] = layer._leaflet_id;
    }

    renderer.update_legend(active_layer);

    var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      if (renderer._layers[stringify(current_wms_opts)] === layer._leaflet_id) {
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
