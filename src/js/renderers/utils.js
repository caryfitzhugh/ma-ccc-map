/*global _ , L, Views */
var Renderers = {
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
