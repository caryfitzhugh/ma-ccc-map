/*global _ , L, Views */
var RendererTemplates = { }

var Renderers = {
  opacity: function (active_layer) {
    if (active_layer.is_hidden) {
      return 0;
    } else if (active_layer.parameters.opacity === false) {
      return 100.0;
    } else {
      return active_layer.parameters.opacity / 100.0;
    }
  },
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
  random: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  update_templates: (al, opts) => {
    if (!al.templates) {
      al.templates = {}
      var legend_key = Renderers.random();
      if (opts.legend_template && !Ractive.partials[legend_key]) {
        Ractive.partials[legend_key] = opts.legend_template;
        al.templates.legend = legend_key;
      }
      var info_key = Renderers.random();
      if (opts.info_template && !Ractive.partials[info_key]) {
        Ractive.partials[info_key] = opts.info_template;
        al.templates.info = info_key;
      }
      var wizard_key = Renderers.random();
      if (opts.wizard_template && !Ractive.partials[wizard_key]) {
        Ractive.partials[wizard_key] = opts.wizard_template;
        al.templates.wizard = wizard_key;
      }
    }
  },
  is_loading_leaflet_layer: (active_layer, attributes) => {
    active_layer.loading_layers = active_layer.loading_layers || {};
    return active_layer.loading_layers[stringify(attributes)];
  },
  loading_leaflet_layer: (active_layer, attributes) => {
    active_layer.loading_layers = active_layer.loading_layers || {};
    active_layer.loading_layers[stringify(attributes)] = true;
  },
  loaded_leaflet_layer: (active_layer, attributes) => {
    active_layer.loading_layers = active_layer.loading_layers || {};
    active_layer.loading_layers[stringify(attributes)] = false;
  },
  create_leaflet_layer_async: (map, active_layer, attributes, load_layer, completed) => {
    if (!Renderers.get_leaflet_layer(map, active_layer, attributes) &&
        !Renderers.is_loading_leaflet_layer(active_layer, attributes)) {
      Renderers.loading_leaflet_layer(active_layer, attributes);

     load_layer()
     .then((layer) => {
        layer.addTo(map);
        Renderers.save_leaflet_layer(active_layer, layer._leaflet_id, attributes);
        completed();
     });
    } else {
      completed();
    }
  },
  create_leaflet_layer: (map, active_layer, attributes, load_layer) => {
    if (!Renderers.get_leaflet_layer(map, active_layer, attributes) &&
        !Renderers.is_loading_leaflet_layer(active_layer, attributes)) {
      Renderers.loading_leaflet_layer(active_layer, attributes);
      var layer = load_layer();
      layer.addTo(map);
      Renderers.save_leaflet_layer(active_layer, layer._leaflet_id, attributes);
    }
  },
  save_leaflet_layer: (active_layer, layer_id, attributes) => {
    active_layer.leaflet_layer_ids.push(
      Object.assign({},
                    {id: stringify(attributes)},
                    {leaflet_id: layer_id}));
    Renderers.loaded_leaflet_layer(active_layer, attributes);
  },
  get_all_leaflet_layers: function(map, active_layer) {
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids,"leaflet_id");
    return Renderers.lookup_layers(map, leaflet_ids);
  },
  get_leaflet_layer: function (map, active_layer, attributes)  {
    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids, {id:stringify(attributes)});

    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  get_layer: function (map, layer_type, attributes) {
    var leaflet_layers = [];
    map.eachLayer(function (layer) {
      // Does the id match? (if
      if (layer._leaflet_id === attributes.id)
      if (_.contains(leaflet_layer_ids, layer._leaflet_id)) {
        leaflet_layers.push(layer);
      }
    });
    return leaflet_layers;
  },
  lookup_layers: function (map, leaflet_layer_ids, extra_attributes) {
    var leaflet_layers = [];
    map.eachLayer(function (layer) {
      if (_.contains(leaflet_layer_ids, layer._leaflet_id)) {
        leaflet_layers.push(layer);
      }
    });
    return leaflet_layers;
  },
  layer_to_pane_name: (active_layer) => {
    return active_layer.id.replace(/\W/,'.');
  },
  remove: function (map, active_layer) {
    var layers = Renderers.get_all_leaflet_layers(map,active_layer);
    _.each(layers, function (ll) {
      if (map.hasLayer(ll)) {
        map.removeLayer(ll);
      }
    });

    // Don't worry about deleting the pane.
    //  Leaflet doesn't support it correctly, and even a few hundred empty DIVs won't be a big deal.
  },
  render: function (map, active_layer, z_index) {
    var renderer = Renderers[active_layer.renderer_id];
    // Create the pane if not created
    var pane_name = Renderers.layer_to_pane_name(active_layer);

    var pane = map.getPane(pane_name);
    if (!pane) {
      pane = map.createPane(pane_name);
      pane.style.pointerEvents = 'none';
    }
    pane.style.zIndex = z_index;
    pane.style.opacity = Renderers.opacity(active_layer);

    renderer.render(map, active_layer, pane_name);
  },
  // This is used by map layer dialogs to "Zoom to " something
  zoom_to: function (center, zoom) {
    Views.ControlPanel.fire("map-set-view", center, zoom);
  },
  zoom_to_bounding_box: function (bbox_string) {
    [west, south, east, north] = bbox_string.split(',').map(parseFloat);
    Views.ControlPanel.fire("map-set-bbox", west, south, east, north);
  },
  utils: {
    zoom_to_location_link: function (geometry) {
      if (geometry.type === "Point") {
        return "<a href='#' onclick='Renderers.zoom_to([" + geometry.coordinates[1] + "," + geometry.coordinates[0] + "], 15);'>Zoom to feature</a>";
      } else if (geometry._northEast) {
        return `<a href='#' onclick='Renderers.zoom_to_bounding_box("${geometry.toBBoxString()}");'>Zoom to feature</a>`;
      }
    }
  },
};
