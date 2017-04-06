RendererTemplates.wms = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },

    update_legend: function (active_layer) {
      if (typeof opts.update_legend === "string") {
        active_layer.legend_url = opts.update_legend;
      } else if (opts.update_legend) {
        opts.update_legend(active_layer);
      }
    },
    render: function (map, active_layer, z_index) {
      if (_.isEmpty(active_layer.leaflet_layer_ids)) {
        var layer = new L.TileLayer.WMS(opts.url, opts.wms_options);
        layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
        layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
        layer.addTo(map);
        active_layer.leaflet_layer_ids = [layer._leaflet_id];
      }

      renderer.update_legend(active_layer);

      var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
      var leaflet_ids = active_layer.leaflet_layer_ids;
      var layers = Renderers.lookup_layers(map, leaflet_ids);

      _.each(layers, function (layer) {
        layer.setOpacity(opacity);
        layer.setZIndex(z_index);
      });

    },
    get_feature_info_xml_url: opts.get_feature_info_xml_url,
    get_feature_info_url: opts.get_feature_info_url,
  }

  Renderers[layer_id] = renderer;
}
