/*global _ , L, Views */
var Renderers = {
  defaults: {
    create:  {
      geojson: function (url) {
        return function (map, active_layer) {
          if (_.isEmpty(active_layer.leaflet_layer_ids)) {
            Renderers.add_raw_geojson(map, active_layer, url);
          }
        }
      }
    },
    render: {
      geojson: function(layer_id, options) {
        options = options || {};
        return function (map, active_layer, z_index) {
            // Make sure the right layers are created!
            Renderers[layer_id].create_leaflet_layers(map, active_layer);
            Renderers[layer_id].update_legend_url(active_layer);

            var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
            var leaflet_ids = active_layer.leaflet_layer_ids;
            var layers = Renderers.lookup_layers(map, leaflet_ids);
            _.each(layers, function (layer) {
                _.each(layer._layers, function (polygon) {
                    polygon.setStyle({"fillOpacity": opacity, "opacity": opacity});
                    if (options.each_polygon) { options.each_polygon(polygon); }
                });
              });
        };
      },
    },
    legend_url: {
      empty: function() {
        return function (active_layer) {
          active_layer.legend_url = null;
        }
      }
    }
  },
  add_to_map: function (map, active_layer, addable) {
    addable.addTo(map);
    active_layer.leaflet_layer_ids = [addable._leaflet_id];
    Views.ControlPanel.fire("tile-layer-loaded", active_layer);
  },
  add_layer_error: function (active_layer) {
    Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
  },
  add_raw_geojson: function (map, active_layer, url) {
      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
      $.ajax({
        cache: true,
        dataType: "json",
        url: url,
        success: function (data) {
          var layer = new L.GeoJSON(data);
          Renderers.add_to_map(map, active_layer, layer);
        },
        error:   function (err) {
          if (err.status !== 200) {
            Renderers.add_layer_error(active_layer);
          }
        }
      });

  },
  lookup_layers: function (map, leaflet_layer_ids) {
    var leaflet_layers = [];
    map.eachLayer(function (layer) {
      if (_.contains(leaflet_layer_ids, layer._leaflet_id)) {
        leaflet_layers.push(layer);
      }
    });
    return leaflet_layers;
  },
  remove: function (map, active_layer) {
    var renderer = Renderers[active_layer.renderer_id];
    if (renderer && renderer.remove) {
      renderer.remove(map, active_layer);
    } else {
      var leaflet_layers = [];
      map.eachLayer(function (layer) {
        if (_.contains(active_layer.leaflet_layer_ids, layer._leaflet_id)) {
          leaflet_layers.push(layer);
        }
      });

      _.each(leaflet_layers, function (leaflet_layer) {
        if (map.hasLayer(leaflet_layer)) {
          map.removeLayer(leaflet_layer);
        }
      });
    }
  },
  render: function (map, active_layer, z_index) {
    var renderer = Renderers[active_layer.renderer_id];

    if (renderer && renderer.render) {
      renderer.render(map, active_layer, z_index);
    } else {
      // This should add any needed leaflet leayers
      // and set the legend_url
      renderer.create_leaflet_layers(map, active_layer);
      renderer.update_legend_url(active_layer);

      var leaflet_layers = [];
      map.eachLayer(function (layer) {
        if (_.contains(active_layer.leaflet_layer_ids, layer._leaflet_id)) {
          leaflet_layers.push(layer);
        }
      });

      var opacity = active_layer.is_hidden ? 0 : active_layer.parameters.opacity;
      _.each(leaflet_layers, function (leaflet_layer) {
        leaflet_layer.setOpacity(opacity / 100.0);
        leaflet_layer.setZIndex(z_index);
      });
    }
  },
  // This is used by map layer dialogs to "Zoom to " something
  zoom_to: function (center, zoom) {
    Views.ControlPanel.fire("map-set-view", center, zoom);
  }
};
