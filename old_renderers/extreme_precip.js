/*global _, Renderers, L, narccap, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.extreme_precip = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
    delete al.legend_data;
    delete al.parameters.all_legend_data;
    delete al.parameters.event_types;
    delete al.parameters.event_timeframes;
  },
  update_legend_data: function (active_layer) {
    var layer_id = Renderers.extreme_precip.event_types[active_layer.parameters.event_type][active_layer.parameters.time];
    var legend = _.find(active_layer.parameters.all_legend_data, {layerId: layer_id});
    active_layer.parameters.legend_data = legend;
  },
  clone_layer_name: function (active_layer) {
    var p = _.pick(active_layer.parameters, ["event_type", "time"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " " + p.species;
    return name;
  },
  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["event_type", "time"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    return active_leaflet_layer;
  },

  get_feature_info_url: function (active_layer, map) {
    var layer_id = Renderers.extreme_precip.event_types[active_layer.parameters.event_type][active_layer.parameters.time];
    return CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer/identify") +
      "?f=json" +
      "&tolerance=1" +
      "&returnGeometry=true" +
      "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
      "&maxAllowableOffset=150" +
      "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
      "&geometryType=esriGeometryPoint" +
      "&sr=4326" +
      "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
      "&layers=visible%3A" + layer_id;
  },

  legend_cache: null,

  event_types: {
    "100 Year Event":  {
      "Future Recurrance" : 153,
      "Future Avg Percent Increase": 154,
      "Current Magnitude" : 155
    },
    "10 Year Event":  {
      "Future Recurrance" : 156,
      "Future Avg Percent Increase": 157,
      "Current Magnitude" : 158
    }
  },
  event_legend_transforms: {
    156: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+(\.\d+)?/);
        if (v) { leg.label = "" + v[0];}
      });
      return legend; },
    153: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) { leg.label = "" + v[0];}
      });
      return legend; },
    154: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+(\.\d+)?/);
        if (v) { leg.label = "" + v[0] + "%"; }
      });
      return legend; },
    157: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) { leg.label = "" + v[0] + "%"; }
      });
      return legend; },
    155: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) {
          var val = (parseInt(v) / 1000.0).toFixed(2).toString();

          leg.label = "" + val + "\"";
        }
      });
      return legend; },
    158: function (legend) {
      _.each(legend, function (leg) {
        var v = leg.label.match(/\d+/);
        if (v) {
          var val = (parseInt(v) / 1000.0).toFixed(2).toString();

          leg.label = "" + val + "\"";
        }
      });
      return legend; },
  },
  cache: null,

  get_legend_data: function (callback) {
    // callback(error, geojson_data?)
    if (Renderers.extreme_precip.legend_cache) {
      callback(null, Renderers.extreme_precip.legend_cache);
    } else {
      $.ajax({
        url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer/legend"),
        data: {f: "pjson"},
        dataType: "jsonp",
        success: function (data) {
          _.each(Renderers.extreme_precip.event_legend_transforms, function (func, id) {
            var indx = _.findIndex(data.layers, {layerId: parseInt(id)});
            data.layers[indx].legend = func(data.layers[indx].legend);
          });

          Renderers.extreme_precip.legend_cache = data;
          callback(null, data);
        },
        error:   function (err) {
          if (err.status !== 200) {
            callback(err, []);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          }
        }
      });
    }
  },
  create_leaflet_layers: function (map, active_layer) {
    // active_layer is the data from the Legends tab., parameters, all that stuff.
    var p = _.pick(active_layer.parameters, ["event_type","time"]);
    var active_leaflet_layer = Renderers.extreme_precip.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      // This prevents race-conditions, where we try to load the same layer multiple times.
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

      // Copy these over into the view.
      var event_types = _.keys(Renderers.extreme_precip.event_types).sort();
      var event_timeframes = { };
      _.each(event_types, function (type) {
        var types = _.keys(Renderers.extreme_precip.event_types[type]).sort();
        event_timeframes[type] = types;
      });

      active_layer.parameters.event_types = event_types;
      active_layer.parameters.event_timeframes = event_timeframes;

      // Load some Data
      Renderers.extreme_precip.get_legend_data(
        function (error, legend_data) {
          if (error) {
            console.log("Error!", error);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          } else {
              var layer_id = Renderers.extreme_precip.event_types[active_layer.parameters.event_type][active_layer.parameters.time];
              var new_layer = new L.esri.dynamicMapLayer({
                    url: CDN("http://services.coastalresilience.org/arcgis/rest/services/New_York/NY_CLIMAD_toolkit/MapServer"),
                    layers: [layer_id],
                    f:"image",
                    format: "png8",
                    transparent: true,
                    dpi: 96,
                    clickable: false,
                    attribution: 'NYS DEC'});
                new_layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
                new_layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
                new_layer.addTo(map);

                // Lookup the active placeholder
                active_leaflet_layer = Renderers.extreme_precip.active_leaflet_layer(map, active_layer);
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
    Renderers.extreme_precip.create_leaflet_layers(map, active_layer);
    Renderers.extreme_precip.update_legend_data(active_layer);

    var active_svg_layer = Renderers.extreme_precip.active_leaflet_layer(map, active_layer);
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
