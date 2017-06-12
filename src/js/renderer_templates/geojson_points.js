RendererTemplates.geojson_points = function (layer_id, opts) {
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
            Renderers.geojson_add_to_map(map, active_layer, layer);
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
    alert("This is not converted");
    renderer.update_legend(active_layer);
    renderer.create_leaflet_layers(map, active_layer);

    var opacity = Renderers.opacity(active_layer);
    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      layer.setZIndex(z_index);
      _.each(layer._layers, function (point) {
        point.setOpacity(opacity);
        if (opts.each_point) { opts.each_point(point); }
      });
    });
  }

  Renderers[layer_id] = renderer;
}
