RendererTemplates.geojson_points = function (layer_id, opts) {
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
    create_leaflet_layers: function (map, active_layer) {
      if (_.isEmpty(active_layer.leaflet_layer_ids)) {
        active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
        $.ajax({
          cache: true,
          dataType: "json",
          url: opts.url,
          success: function (data) {
            var layer = new L.GeoJSON(data, {
              pointToLayer: opts.pointToLayer,
              onEachFeature: opts.onEachFeature || function (feature, layer) {
                if (opts.popupContents) {
                  layer.bindPopup(opts.popupContents(feature));
                }
              },
            });
            Renderers.add_to_map(map, active_layer, layer);
          },
          error:   function (err) {
            if (err.status !== 200) {
              Renderers.add_layer_error(active_layer);
            }
          }
        });
      }
    }
  };

  renderer.render = function (map, active_layer, z_index) {
    renderer.update_legend(active_layer);
    renderer.create_leaflet_layers(map, active_layer);

    var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      _.each(layer._layers, function (point) {
        point.setOpacity(opacity);
      });
    });
  }

  Renderers[layer_id] = renderers;
}
