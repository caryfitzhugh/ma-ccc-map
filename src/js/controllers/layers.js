/*global Renderers, Views, Ractive, console, _, Controllers*/
Controllers.Layers = {
  test_pickler: function () {
    _.each(Renderers, function (renderer) {
      if (renderer.pickle) {
        renderer.pickle({leaflet_layer_ids: [], parameters: {}});

      }
    });
  },
  update_layers_parameters: function (cp, active_layer) {
    var al_index = _.findIndex(cp.get("layers.active"), {id: active_layer.id});

    cp.set("layers.active."+al_index+".parameters", active_layer.parameters);
  },
  mark_layer_as_loaded: function (cp, active_layer, success, force_reload) {
    var this_layer = cp.get("layers_loading_states." + active_layer.layer_default_id) || { loaded: 0, errors: 0};

    // Only do this if it's the first success (or an error)
    if (this_layer.loaded === 0 || !success || force_reload) {
      if (success) {
        this_layer.loaded = this_layer.loaded + 1;
      } else {
        this_layer.errors = this_layer.errors + 1;
      }
      cp.set("layers_loading_states."+active_layer.layer_default_id, this_layer);

      var al_index = _.findIndex(cp.get("layers.active"), {id: active_layer.id});

      cp.set("layers.active."+al_index, active_layer);
    }
  },
  sort_active_layers: function (active_layers) {
    return _.sortBy(active_layers, function (active_layer) {
      var index = _.findIndex(active_layers, active_layer);
      var sort_string = "";
      if (active_layer.sort_key) {
        sort_string = sort_key.toString();
      } else if (active_layer.parameters.no_sorting) {
        sort_string = "A" + active_layer.name;
      } else {
        sort_string = "Z";
        sort_string = sort_string + _.padLeft(index, 25, "0");
      }
      return sort_string;
    });
  },
  is_active_layer: function (active_layers, layer_default_id) {
    return !!_.find(active_layers, {"layer_default_id": layer_default_id, "copied_source": null});
  },
  counter: 0,
  new_active_layer: function (map, layer_default, parameters) {
    var renderer = Renderers[layer_default.renderer_id || layer_default.id];
    Controllers.Layers.counter = Controllers.Layers.counter + 1;

    var parameters = Object.assign({},
                                   renderer.parameters || {},
                                   layer_default.parameters || {},
                                   parameters || {});

    var active_layer = { id: "layer:" + Controllers.Layers.counter,
             layer_default_id: layer_default.id,
             parameters: parameters,
             renderer_id: layer_default.id,
             leaflet_layer_ids: [],
             is_collapsed: false,
             is_hidden: false,
             name: layer_default.name,
             legend_url: null,
             copied_source: null};
    return active_layer;
  },
  pickle_active_layer: function (active_layer) {
    var pickled = _.cloneDeep(active_layer);
    pickled.leaflet_layer_ids = [];
    var renderer = Renderers[pickled.renderer_id];
    if (renderer) {
      renderer.pickle(pickled);
    }

    if (pickled.legend_url) {
      pickled.legend_url = null;
    }
    return pickled;
  },

  add_imported_layer: function (cp, filename, data) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    Controllers.Layers.counter = Controllers.Layers.counter + 1;
    var layer_id = "imported_layer:" + Controllers.Layers.counter;

    cp.push('layers.defaults', {folder: "User Imports", id: layer_id, name: filename});
    RendererTemplates.imported_geojson(layer_id, { templates: {},
                                       name: filename,
                                       data: (data.type ? data : JSON.parse(data)) });

    Controllers.Layers.toggle_layer_active(cp, layer_id);
    cp.push('layers.available_ids', layer_id);
  },
  add_cloned_layer: function (cp, active_layer, name) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    var cloned_layer = _.cloneDeep(active_layer);
    Controllers.Layers.counter = Controllers.Layers.counter + 1;
    cloned_layer.id = "cloned_layer:" + Controllers.Layers.counter;
    cloned_layer.leaflet_layer_ids = [];
    cloned_layer.copied_source = active_layer.id;
    cloned_layer.name = Renderers[active_layer.renderer_id].clone_layer_name(active_layer);
    cloned_layer.is_collapsed = true;

    new_active_layers.unshift(cloned_layer);
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  remove_active: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.remove(new_active_layers, {"id": evt.context.id});
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  visible_all_layers: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.each(new_active_layers, function (layer) {
      layer.is_hidden = false;
    });
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  hide_all_layers: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.each(new_active_layers, function (layer) {
      layer.is_hidden = true;
    });
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  expand_all_layers: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.each(new_active_layers, function (layer) {
      layer.is_collapsed = false;
    });
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  collapse_all_layers: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.each(new_active_layers, function (layer) {
      layer.is_collapsed = true;
    });
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  toggle_active_collapsed: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    var layer = _.find(new_active_layers, "id", evt.context.id);
    layer.is_collapsed = !layer.is_collapsed;
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  make_active_hidden: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.find(new_active_layers, "id", evt.context.id).is_hidden = true;
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  make_active_visible: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    _.find(new_active_layers, "id", evt.context.id).is_hidden = false;
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  move_active_to_top: function (cp, evt) {
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    var layer = _.find(new_active_layers, {"id":  evt.context.id});
    _.remove(new_active_layers, {"id": evt.context.id});
    new_active_layers.unshift(layer);

    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  add_custom_layer: function (cp, defaults, params) {
    // Find out if it's active or not (in layers.active)
    var new_active_layers = _.cloneDeep(cp.get("layers.active", []));
    let renderer_id = defaults.id;
    var existing_layer = _.find(new_active_layers, {"layer_default_id": renderer_id, "name": defaults.name, "copied_source": null});

    if (existing_layer) {
        // Do nothing, it's here already
    } else {
      var new_layer = Controllers.Layers.new_active_layer(cp.get("map"), defaults, params);
      new_active_layers.unshift(new_layer);

      cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
      cp.set("active_layers_added_count", cp.get("active_layers_added_count") + 1);
    }

  },
  toggle_layer_active: function (cp, layer_default_id) {
    // Find out if it's active or not (in layers.active)
    var layer_defaults    = cp.get("layers.defaults");
    var new_active_layers = _.cloneDeep(cp.get("layers.active"));
    var existing_layer = _.find(new_active_layers, {"layer_default_id": layer_default_id, "copied_source": null});

    if (existing_layer) {
      //   UGH, mutation! CLJS here i come. :(
      _.remove(new_active_layers, existing_layer);
    } else {
      var new_layer = Controllers.Layers.new_active_layer(cp.get("map"), _.find(layer_defaults, "id", layer_default_id));
      new_active_layers.unshift(new_layer);
    }
    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
    cp.set("active_layers_added_count", cp.get("active_layers_added_count") + 1);
  },

  force_layers_active: function (cp, desired_active_layer_ids) {
    var layer_defaults    = cp.get("layers.defaults");
    var new_active_layers = _.map(desired_active_layer_ids, function (layer_default_id) {
      // Find looks sequentially, finding the first record.
      // So by combining the layer search into existing + default, we will find the existing layer
      // First, if it exists, otherwise we find the default one
      var existing_layer = _.find(cp.get("layers.active"), {"layer_default_id": layer_default_id, "copied_source": null});
      var new_layer = existing_layer;
      if (!new_layer) {
        new_layer = Controllers.Layers.new_active_layer(cp.get("map"), _.find(layer_defaults, "id", layer_default_id));
      }
      return new_layer;
    });

    cp.set("layers.active", Controllers.Layers.sort_active_layers(new_active_layers));
  },
  set_available_layer_ids: function (cp, available_layer_ids) {
    var layer_defaults    = cp.get("layers.defaults");
    // You want to set the available layers correctly.
    // Remove any active layers that are no longer available
    var valid_available_ids = _.filter(available_layer_ids,
          function (id) { return _.find(layer_defaults, "id", id); });
    cp.set("layers.available_ids", available_layer_ids);
  },

  ensure_active_are_available: function (cp) {
    var active = cp.get("layers.active") || [];
    var available = cp.get("layers.available_ids");

    cp.set("layers.active", _.filter(active, function (layer) {
      return _.contains(available, layer.id) || _.contains(available, layer.renderer_id);
    }));
  },

  add_tree_node:  function (all_layers, node, folder_name, layer_id, force_expanded) {
    if (folder_name.length === 0) {
      node.children = node.children.concat(layer_id);
    } else {
      var this_level_name = folder_name.shift();
      var child_layer = _.find(node.children, function (sublayer) { return sublayer.folder_name === this_level_name; });

      if (!child_layer) {
        child_layer = {folder_name: this_level_name, is_expanded: force_expanded, children: []};
        node.children = node.children.concat(child_layer);
      }
      Controllers.Layers.add_tree_node(all_layers, child_layer, folder_name, layer_id, force_expanded);
    }
    node.children = _.sortBy(node.children, function (child_id_or_folder) {
      var child = _.find(all_layers, "id", child_id_or_folder);
      var res = "";
      if (child) {
        res =  "A" + child.name;
      } else {
        res = "Z" + child_id_or_folder.folder_name;
      }
      return res;
    });

    return node;
  },
  update_layer_tree: function (cp) {
    // Whenever there are changes to available layer ids, the tree needs to be updated
    // Root is always expanded.
    var new_tree = {folder_name: null, is_expanded: true, children: []};
    var avail_layer_ids = cp.get("layers.available_ids");
    var layer_defaults  = cp.get("layers.defaults");
    var search_string   = cp.get("layers.search_string").toLowerCase();
    var current_sectors = cp.get('sectors.selected');

    _.each(avail_layer_ids, function (id) {
      var layer = _.find(layer_defaults, "id", id);
      if (layer) {
        var add_layer = null;
        var force_expanded = false;

        if (_.isEmpty(search_string)) {
          add_layer = true;
        } else {
          add_layer =
            _.includes((layer.name || "").toLowerCase(), search_string) ||
            _.includes((layer.description || "").toLowerCase(), search_string) ||
            (layer.id.toLowerCase() === search_string);

          force_expanded = add_layer;
        }

        if (add_layer && current_sectors.length > 0) {
          add_layer = _.any(layer.sectors, (layer_sector) => {
            return _.any(current_sectors, (current_sector) => {
              let cs =current_sector.toLowerCase()  ;
              let ls = layer_sector.toLowerCase();
              return cs === ls;
            });
          });
        }

        if (add_layer) {
          new_tree = Controllers.Layers.add_tree_node(layer_defaults,
                        new_tree,
                        layer.folder.split("."),
                        id,
                        force_expanded);
        }
      }
    });
    cp.set("layers.tree", new_tree);
  },

  deactivate_all: function (cp) {
    cp.set("layers.active", []);
  }
};
