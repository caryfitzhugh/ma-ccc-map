/*global LayerInfo, Renderers, _ */
Renderers.climaid_temp = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
    delete al.parameters.legend_range;
    delete al.parameters.legend_text;
    delete al.parameters.legend_significant_digits;
  },
  has_standalone_wizard: true,
  zoomed_to: false,
  find_geo_json: function (map, active_layer, evt) {
    var details_at_point = null;
    var active_svg_layer = Renderers.climaid_temp.active_leaflet_layer(map, active_layer);
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
    var p = _.pick(active_layer.parameters, ["timestep", "scenario", "percentile", "symbology"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " Y:" + p.timestep + " S:" + p.scenario + " %:" + p.percentile + " by " + p.symbology;
    return name;
  },
  update_legend: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["timestep", "scenario", "percentile", "symbology"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);

    if (active_leaflet_layer && active_leaflet_layer.color) {
      var cd = active_leaflet_layer.color.domain();
      var legend = _.reduce(_.range(cd[0], cd[1], (cd[1] - cd[0]) / 10).concat([cd[1]]), function (legend, step) {
        legend.push({v: step, c: active_leaflet_layer.color(step)});
        return legend;
      }, []);
      active_layer.parameters.legend_range = legend;
      active_layer.parameters.legend_text = "Temperature Change (°F)";
      active_layer.parameters.legend_significant_digits = 2;
    }
  },

  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["timestep", "scenario", "percentile", "symbology"]);

    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    //  result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    return active_leaflet_layer;
  },

  create_leaflet_layers: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["timestep", "scenario", "percentile", "symbology"]);

    var active_leaflet_layer = Renderers.climaid_temp.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

      // Load some Data
      Renderers.climaid.get_climaid_data(CDN("http://52.2.5.122:8080/geoserver/www/climaid_temp_deltas.json"), p.timestep, p.scenario, p.percentile, p.symbology,
        function (error, geojson, range_extent) {
          if (error) {
            console.log("Error!", error);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          } else {
            var color = d3.scale.quantile();

            if (range_extent[0] < 0) {
              // Set different color ranges
              color = color.range(_.cloneDeep(colorbrewer.Blues[9]).reverse().concat(["rgba(0,0,0)"]).concat(colorbrewer.YlOrRd[9]));

              //Caclulate the domain of color based on the range of data
              // Want the most positive or most negative number as the max / min
              var most = _.max([Math.abs(range_extent[1]), Math.abs(range_extent[0])]);
              color.domain([-most, most])
            } else {
              color = color.range(colorbrewer.YlOrRd[9]);

              //Caclulate the domain of color based on the range of data
              color.domain(range_extent);
            }
            var new_layer = Renderers.climaid.render_data(map,
                                    color,
                                    geojson);
            new_layer.addTo(map);

            // Lookup the active placeholder
            active_leaflet_layer = Renderers.climaid_temp.active_leaflet_layer(map, active_layer);

            active_leaflet_layer.leaflet_id = new_layer._leaflet_id;

            active_leaflet_layer.color = color;

            if (!Renderers.climaid_temp.zoomed_to && !loaded_state) {
              var obj = L.geoJson(geojson);
              map.fitBounds(obj.getBounds());
              Renderers.climaid_temp.zoomed_to = true;
            }

            // Once it's loaded. trigger the success!
            Views.ControlPanel.fire("tile-layer-loaded", active_layer);
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
    Renderers.climaid_temp.create_leaflet_layers(map, active_layer);
    Renderers.climaid_temp.update_legend(map, active_layer);

    var active_svg_layer = Renderers.climaid_temp.active_leaflet_layer(map, active_layer);
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
