/*global _ , L, Views */
var RendererTemplates = { }

var Renderers = {
  find_geojson_polygon_by_point: function (evt, layer) {
    var point_to_check ={ type: 'Point', coordinates: [ evt.latlng.lng, evt.latlng.lat] };
    var match = _.find(layer._layers, function (element) {
      return gju.pointInPolygon(point_to_check, element.feature.geometry);
    });
    return match;
  },
  update_legend: function(opts) {
    return  function (active_layer) {
      if (typeof opts.update_legend === "string") {
        active_layer.legend_url = opts.update_legend;
      } else  if (!opts.update_legend) {
        // Leave empty
        active_layer.legend_url = null;
      } else  if (typeof opts.update_legend === "object") {
        active_layer.legend_url = opts.update_legend.url;
        active_layer.legend_url_text = opts.update_legend.text;
      } else if (opts.update_legend) {
        opts.update_legend(active_layer);
      } else {
        active_layer.legend_url = null;
      }
    };
  },
  geojson_add_to_map: function (map, active_layer, addable) {
    addable.addTo(map);
    active_layer.leaflet_layer_ids = [addable._leaflet_id];
    Views.ControlPanel.fire("tile-layer-loaded", active_layer);
  },
  add_layer_error: function (active_layer) {
    Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
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
  },
  utils: {
    zoom_to_location_link: function (geometry) {
      return "<a href='#' onclick='Renderers.zoom_to([" + geometry.coordinates[1] + "," + geometry.coordinates[0] + "], 15);'>Zoom to feature</a>";
    }
  },
};
