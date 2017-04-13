RendererTemplates.esri_feature_layer = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },

    update_legend: Renderers.update_legend(opts),

    create_leaflet_layers: function (map, active_layer) {
      if (_.isEmpty(active_layer.leaflet_layer_ids)) {
        active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
        var layer = L.esri.featureLayer(_.merge({
          url: opts.url,
        }, opts.esri_opts))
        layer.addTo(map);
        active_layer.leaflet_layer_ids = [layer._leaflet_id];

        // Proxy the click event through to the map!
        layer.on("click", function (evt) { LeafletMap.fire('click', evt, true);});

        layer.on("load", function () {
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        });
        layer.on("requesterror", function () {
          Renderers.add_layer_error(active_layer);
        });
      }
    },

    find_geo_json: function (map, active_layer, evt) {
      var details_at_point = [];
      var leaflet_ids = active_layer.leaflet_layer_ids;
      var layers = Renderers.lookup_layers(map, leaflet_ids);

      _.each(layers, function (layer) {
        var match = Renderers.find_geojson_polygon_by_point(evt, layer);

        if (match) {
          if (opts.find_geojson_match) {
            var data = opts.find_geojson_match(active_layer, match)
            if (data) {
              details_at_point.push(data);
            }
          }
        }
      });

      return {
        features: details_at_point,
        geojson: details_at_point.length > 0,
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
        if (opts.each_line) { opts.each_line(line); }
      });
    });
  }

  Renderers[layer_id] = renderer;
}
