/*global _, Renderers, L, narccap, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.invasive_plants = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
    delete al.parameters.legend_range;
    delete al.parameters.legend_significant_digits;
    delete al.parameters.legend_text;
    delete al.parameters.all_species;
  },
  find_geo_json: function (map, active_layer, evt) {
    var details_at_point = null;
    var active_svg_layer = Renderers.invasive_plants.active_leaflet_layer(map, active_layer);
    var layer = Renderers.lookup_layers(map, [active_svg_layer.leaflet_id])[0];

    if (layer) {
      var match = layer.find_polygon_with_click(evt);
      if (match) {
        details_at_point = {count: match.getAttribute("data-count"),
                            county: match.getAttribute("data-county"),
                            geojson: true,
                            species: active_layer.parameters.species};
      }
    }

    return details_at_point;

  },
  render_data: function (map, color, species_data, join_path, geometries) {
    //take care of projections
    var path = d3.geo.path().projection(function (x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
        return [point.x, point.y];
      });

    // Draw gemoetries (with COLOR!)
    var new_layer = L.d3SvgOverlay(function (sel, proj) {
      sel.selectAll('.boundary')
        .data(geometries.features)
        .enter()
        .append('path')
        .attr("class", "boundary")
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', function (d) {
          // Boundaries have an ID, which is used to look up
          // the values in the json_lookup
          var area_id = _.get(d, join_path);
          return color(species_data[area_id]) || "#fff"; })
        .attr("data-count", function (d) {
          var area_id = _.get(d, join_path);
          return species_data[area_id] || 0;
        })
        .attr("data-county", function (d) {
          return d.properties.name;
        })
        .attr("data-lat-lng-path", function (d) {
          return JSON.stringify(d.geometry);
        })
        .attr("d", path);
    });

    return new_layer;
  },
  clone_layer_name: function (active_layer) {
    var p = _.pick(active_layer.parameters, ["species", "area"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " Y:" + p.date + " S:" + p.season + " by " + p.area;
    return name;
  },
  update_legend: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["species", "area"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);

    if (active_leaflet_layer && active_leaflet_layer.color) {
      var cd = active_leaflet_layer.color.domain();
      var legend = _.reduce(_.range(cd[0], cd[1], (cd[1] - cd[0]) / 5).concat([cd[1]]), function (legend, step) {
        legend.push({v: step, c: active_leaflet_layer.color(step)});
        return legend;
      }, []);
      active_layer.parameters.legend_range = legend;
      active_layer.parameters.legend_significant_digits = 0;
      active_layer.parameters.legend_text = "Reported Invasive Species (Total Obervations)";
    }
  },

  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["species", "area"]);
    // [ {species: X, area: Y, leaflet_id: Z}, ....]
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    return active_leaflet_layer;
  },
  cache: null,
  get_data: function (area, species, callback) {
    // We ask for area and species, and the callbak gets
    // callback(error, geojson_data?)
    if (Renderers.invasive_plants.cache) {
      callback(null, Renderers.invasive_plants.cache);
    } else {
      $.ajax({
        cache: true,
        url: CDN("http://52.2.5.122:8080/geoserver/www/invasive_plants.json"),
        dataType: "json",
        success: function (data) {
          Renderers.invasive_plants.cache = data;
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
    var p = _.pick(active_layer.parameters, ["species", "area"]);

    var active_leaflet_layer = Renderers.invasive_plants.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      // This prevents race-conditions, where we try to load the same layer multiple times.
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

      // Load some Data
      Renderers.invasive_plants.get_data(p.area, p.species,
        function (error, species_data) {

          if (error) {
            console.log("Error!", error);
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          } else {

            GeometryLoader.load(p.area, function (error, geometries) {

              if (error) {
                console.log("Geometry Error!", error);
                Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
              } else {
                var color = d3.scale.quantile();

                // Set different color ranges
                color = color.range(colorbrewer.YlOrRd[9]);

                //Caclulate the domain of color based on the range of data

                // Get you all the counts of all the basin/county sectors
                var all_values = _.values(species_data[p.species][p.area]);
                // This will set the domain to those extents
                color.domain(d3.extent(all_values));

                var new_layer = Renderers.invasive_plants.render_data(map,
                                        color,
                                        // "all_plants" / "county" => { "albany" : 4, ....}
                                        species_data[p.species][p.area],
                                        "properties.name",
                                        geometries);
                new_layer.addTo(map);

                // Lookup the active placeholder
                active_leaflet_layer = Renderers.invasive_plants.active_leaflet_layer(map, active_layer);
                active_leaflet_layer.leaflet_id = new_layer._leaflet_id;

                // Loads up the color in the layer, so we can display it in the legend.
                active_leaflet_layer.color = color;

                // Going to grab all the spcies names, and let us display it in the
                // Legend
                active_layer.parameters.all_species = _.keys(species_data);

                // Once it's loaded. trigger the success!
                Views.ControlPanel.fire("tile-layer-loaded", active_layer);
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
    Renderers.invasive_plants.create_leaflet_layers(map, active_layer);
    Renderers.invasive_plants.update_legend(map, active_layer);

    var active_svg_layer = Renderers.invasive_plants.active_leaflet_layer(map, active_layer);
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
