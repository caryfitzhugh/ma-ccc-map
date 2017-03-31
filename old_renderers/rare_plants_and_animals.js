/*global _, Renderers, L, narccap, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.rare_plants_and_animals = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];

    delete al.parameters.legend_data;
    delete al.parameters.species_timeframes;
    delete al.parameters.species_names;
    delete al.parameters.all_legend_data;
  },
  get_layer_id: function (active_layer) {
    var layer_id = Renderers.rare_plants_and_animals.species_groups[active_layer.parameters.species_group][active_layer.parameters.time];
    return layer_id;
  },
  update_legend_data: function (active_layer) {
    var layer_id = Renderers.rare_plants_and_animals.species_groups[active_layer.parameters.species_group][active_layer.parameters.time];
    var legend = _.find(active_layer.parameters.all_legend_data, {layerId: layer_id});
    var augmented_legend = _.cloneDeep(legend);

    if (augmented_legend) {
      augmented_legend.legend.push({
        contentType: "image/gif",
        imageData: "R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
        label: "None"
      });
    }
    active_layer.parameters.legend_data = augmented_legend;
  },
  clone_layer_name: function (active_layer) {
    var p = _.pick(active_layer.parameters, ["species_group", "time"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " " + p.species;
    return name;
  },
  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["species_group", "time"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    return active_leaflet_layer;
  },

  legend_cache: null,

  get_feature_info_url: function (active_layer, map) {
    return CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_species_maptree/MapServer/identify") +
      "?f=json" +
      "&tolerance=5" +
      "&returnGeometry=true" +
      "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
      "&maxAllowableOffset=150" +
      "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
      "&geometryType=esriGeometryPoint" +
      "&sr=4326" +
      "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
      "&layers=visible%3A" + Renderers.rare_plants_and_animals.get_layer_id(active_layer);
  },
  species_groups: {
    "All":  {
      "Future" : 17,
      "Current": 27,
      "Change" : 37
    },
    "Animals": {
      "Future" : 18,
      "Current": 28,
      "Change" : 38
    },
    "Plants": {
      "Future" : 19,
      "Current": 29,
      "Change" : 39
    },
    "Invertebrates": {
      "Future" : 20,
      "Current": 30,
      "Change" : 40
    },
    "Vertebrates": {
      "Future" : 21,
      "Current": 31,
      "Change" : 41
    },
    "Birds": {
      "Future" : 22,
      "Current": 32,
      "Change" : 42
    },
    "Aerial Insects": {
      "Future" : 23,
      "Current": 33,
      "Change" : 43
    },
    "Federally Listed": {
      "Future" : 24,
      "Current": 34,
      "Change" : 44
    },
    "NY State Listed": {
      "Future" : 25,
      "Current": 35,
      "Change" : 45
    }
  },
  cache: null,

  get_legend_data: function (callback) {
    // callback(error, geojson_data?)
    if (Renderers.rare_plants_and_animals.legend_cache) {
      callback(null, Renderers.rare_plants_and_animals.legend_cache);
    } else {
      $.ajax({
        url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_species_maptree/MapServer/legend"),
        data: {f: "pjson"},
        dataType: "jsonp",
        success: function (data) {
          Renderers.rare_plants_and_animals.legend_cache = data;
          callback(null, data);
        },
        error:   function (err) {
          if (err.status !== 200) {
            callback(err, []);
          }
        }
      });
    }
  },

  create_leaflet_layers: function (map, active_layer) {
    // active_layer is the data from the Legends tab., parameters, all that stuff.
    var p = _.pick(active_layer.parameters, ["species_group","time"]);
    var active_leaflet_layer = Renderers.rare_plants_and_animals.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      // This prevents race-conditions, where we try to load the same layer multiple times.
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

      // Copy these over into the view.
      var species_names = _.keys(Renderers.rare_plants_and_animals.species_groups).sort();
      var species_timeframes = {};
      _.each(species_names, function (name) {
        var types = _.keys(Renderers.rare_plants_and_animals.species_groups[name]).sort();
        species_timeframes[name] = types;
      });

      active_layer.parameters.species_names = species_names;
      active_layer.parameters.species_timeframes = species_timeframes;

      // Load some Data
      Renderers.rare_plants_and_animals.get_legend_data(
        function (error, legend_data) {
          if (error) {
            console.log("Error!", error);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          } else {
              var layer_id = Renderers.rare_plants_and_animals.get_layer_id(active_layer);
              var new_layer = new L.esri.dynamicMapLayer({
                    url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_species_maptree/MapServer"),
                    layers: [layer_id],
                    f:"image",
                    format: "png32",
                    transparent: true,
                    dpi: 96,
                    clickable: false,
                    attribution: 'NYS DEC'});

                new_layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
                new_layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
                new_layer.addTo(map);

                // Lookup the active placeholder
                active_leaflet_layer = Renderers.rare_plants_and_animals.active_leaflet_layer(map, active_layer);
                active_leaflet_layer.leaflet_id = new_layer._leaflet_id;

                // Legend

                active_layer.parameters.all_legend_data = legend_data.layers;
          }
        }
      );
    }
  },
  remove: function (map, active_layer) {
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);
    _.each(layers, function (ll) {
      if (map.hasLayer(ll)) {
        map.removeLayer(ll);
      }
    });
  },

  render: function (map, active_layer, z_index) {
    // Make sure the right layers are created!
    Renderers.rare_plants_and_animals.create_leaflet_layers(map, active_layer);
    Renderers.rare_plants_and_animals.update_legend_data(active_layer);

    var active_svg_layer = Renderers.rare_plants_and_animals.active_leaflet_layer(map, active_layer);
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      // Right here we hide / show the layer
      var opacity = active_layer.parameters.opacity;
      if (active_layer.is_hidden ||
          layer._leaflet_id !== active_svg_layer.leaflet_id) {
        opacity = 0;
      }

      layer.setOpacity(opacity / 100.0);
      layer.setZIndex(z_index);
    });
  }
};
