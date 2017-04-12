RendererTemplates.geojson_lines = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },

    update_legend: Renderers.update_legend(opts),
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
      _.each(layer._layers, function (line) {
        line.setStyle({"opacity": opacity});
        if (opts.each_line) { console.log(opts.each_line)
          opts.each_line(line); }
      });
    });
  }

  Renderers[layer_id] = renderer;
}
