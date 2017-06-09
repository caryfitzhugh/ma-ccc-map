RendererTemplates.esri = function (layer_id, opts) {
  function get_esri_layers(active_layer) {
    if (opts.esri_layers) {
      return opts.esri_layers(active_layer).sort();
    } else {
      return opts.esri_opts.layers.sort();
    }
  };

  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },
    clone_layer_name: opts.clone_layer_name,
    parameters: opts.parameters,

    render: function (map, active_layer, z_index) {
      Renderers.update_templates(active_layer, opts);

      var esri_layer_ids = get_esri_layers(active_layer);

      Renderers.create_leaflet_layer(map, active_layer, {'esri_layer_ids': esri_layer_ids}, () => {
        esri_opts = _.merge({}, {
              layers: esri_layer_ids,
              f:"image",
              clickable: false
        }, opts.esri_opts);

        var layer = new L.esri.dynamicMapLayer(esri_opts);
        layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
        layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
        layer.addTo(map);
        return layer;
      });

      var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      var esri_layer_ids = get_esri_layers(active_layer);
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, {'esri_layer_ids': esri_layer_ids})

      _.each(layers, function (layer) {
        layer.setOpacity(opacity);
        layer.setZIndex(z_index);
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
      var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
      var layers = Renderers.lookup_layers(map, leaflet_ids);
      _.each(layers, function (ll) {
        if (map.hasLayer(ll)) {
          map.removeLayer(ll);
        }
      });
    },
    get_feature_info_xml_url: opts.get_feature_info_xml_url,
    get_feature_info_url: opts.get_feature_info_url,
  }
  Renderers[layer_id] = renderer;
}
