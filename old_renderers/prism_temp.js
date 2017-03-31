/*global _, Renderers, L, prism, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.prism_temp = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
    delete al.legend_url;
    delete al.parameters.legend_range;
    delete al.parameters.legend_text;
  },
  find_geo_json: function (map, active_layer, evt) {
    var details_at_point = null;
    var active_svg_layer = Renderers.prism_temp.active_leaflet_layer(map, active_layer);
    var layer = Renderers.lookup_layers(map, [active_svg_layer.leaflet_id])[0];

    if (layer) {
      var match = layer.find_polygon_with_click(evt);
      if (match) {
        // This is going to read the data-* fields off the SVG element.
        // narccap.render_data adds it.
        details_at_point = {count: parseFloat(match.getAttribute("data-count")),
                            geojson: true};
      }
    }

    return details_at_point;

  },
  clone_layer_name: function (active_layer) {
    var p = _.pick(active_layer.parameters, ["prod", "area", "season"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " " + p.prod +  " S:" + p.season + " by " + p.area;
    return name;
  },
  update_legend: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["prod", "area", "season"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);

    if (active_leaflet_layer && active_leaflet_layer.color) {
      var cd = active_leaflet_layer.color.domain();
      var legend = _.reduce(_.range(cd[0], cd[1], (cd[1] - cd[0]) / 10).concat([cd[1]]), function (legend, step) {
        legend.push({v: step, c: active_leaflet_layer.color(step)});
        return legend;
      }, []);
      active_layer.parameters.legend_range = legend;
      active_layer.parameters.legend_text = "Temperature (°F)";
    }
  },

  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["prod", "area", "season"]);

    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    return active_leaflet_layer;
  },

  create_leaflet_layers: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["prod", "area", "season"]);

    var active_leaflet_layer = Renderers.prism_temp.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

      // Load some Data
      Renderers.prism.get_prism_data(p.area, p.season, p.prod, 1980, 2014,
        function (error, json_data, yearly_extents) {
          if (error) {
            console.log("Error!", error);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          } else {
            GeometryLoader.load(p.area, function (error, geometries) {
              if (error ) {
                console.log("Geometry Error!", error);
                Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
              } else {
                var color = d3.scale.quantile();

                // Set different color ranges
                if (p.prod === "avgt") {
                  color = color.range(_.cloneDeep(colorbrewer.RdBu[10]).reverse());
                } else if (p.prod === 'mint') {
                  color = color.range(_.cloneDeep(colorbrewer.RdBu[10]).reverse());
                } else if (p.prod === 'maxt') {
                  color = color.range(_.cloneDeep(colorbrewer.RdBu[10]).reverse());
                }

                //Caclulate the domain of color based on the range of data
                color.domain(yearly_extents);

                var new_layer = Renderers.prism.render_data(map,
                                        color,
                                        json_data,
                                        (p.area === "county" ? "properties.fips" : "id" /*  gnis is the ID */),
                                        geometries);
                new_layer.addTo(map);

                // Lookup the active placeholder
                active_leaflet_layer = Renderers.prism_temp.active_leaflet_layer(map, active_layer);
                active_leaflet_layer.leaflet_id = new_layer._leaflet_id;


                active_leaflet_layer.color = color;


                 // Once it's loaded. trigger the success!
                Views.ControlPanel.fire("tile-layer-loaded", active_layer, true);
              }
            });
          }
        });
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
    Renderers.prism_temp.create_leaflet_layers(map, active_layer);
    Renderers.prism_temp.update_legend(map, active_layer);

    var active_svg_layer = Renderers.prism_temp.active_leaflet_layer(map, active_layer);
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
