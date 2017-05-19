RendererTemplates.geojson_polygons = function (layer_id, opts) {
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

      _.each(layer._layers, function (polygon) {
        polygon.setStyle({"fillOpacity": opacity, "opacity": opacity});
        if (opts.each_polygon) { opts.each_polygon(polygon); }
      });
    });
  }

  Renderers[layer_id] = renderer;
}
