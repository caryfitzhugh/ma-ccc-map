RendererTemplates.esri_feature_layer = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },

    update_legend: Renderers.update_legend(opts),

    create_leaflet_layers: function (map, active_layer) {
      if (_.isEmpty(active_layer.leaflet_layer_ids)) {
        active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
        var layer = L.esri.featureLayer(_.merge({
          url: opts.url,
        }, opts.esri_opts))

        layer.addTo(map);
        active_layer.leaflet_layer_ids = [layer._leaflet_id];

        // Proxy the click event through to the map!
        if (!opts.esri_opts.pointToLayer) {
          layer.on("click", function (evt) { LeafletMap.fire('click', evt, true);});
        }

        layer.on("load", function () {
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        });
        layer.on("requesterror", function () {
          Renderers.add_layer_error(active_layer);
        });
      }
    },

    find_geo_json: function (map, active_layer, evt) {
      if (opts.esri_opts.pointToLayer) {
        return { features: [], geojson: null};
      } else {
        var details_at_point = [];
        var leaflet_ids = active_layer.leaflet_layer_ids;
        var layers = Renderers.lookup_layers(map, leaflet_ids);

        _.each(layers, function (layer) {
          var match = Renderers.find_geojson_polygon_by_point(evt, layer);

          if (match) {
            if (opts.find_geojson_match) {
              var data = opts.find_geojson_match(active_layer, match)
              if (data) {
                details_at_point.push(data);
              }
            }
          }
        });

        return {
          features: details_at_point,
          geojson: details_at_point.length > 0,
        }
      }
    }
  };

  renderer.render = function (map, active_layer, z_index) {
    renderer.update_legend(active_layer);
    renderer.create_leaflet_layers(map, active_layer);

    var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
        layer.setStyle(function (feature) {
          if (opts.setStyle) {
            return opts.setStyle(opacity, feature);
          } else if (opts.color_buckets) {
            var bucket = _.find(opts.color_buckets, function (v) {
              var field = opts.color_bucket_field;
              if (opts.color_bucket_field instanceof Function) {
                field = opts.color_bucket_field(active_layer)
              }

              var lookup = _.get(feature, field);
              if (_.isArray(v.values)) {
                if (v.values.length == 1) {
                  return v.values[0] == lookup;
                } else if (v.values.length == 2) {
                  return v.values[0] <= lookup && v.values[1] > lookup;
                } else {
                  return _.contains(v_.values, lookup );
                }
              } else if (_.isFunction(v.values)) {
                return v.values(lookup);
              } else {
                console.log("Can't find this: ", feature, lookup, opts.color_buckets);
              }
             });


            if (bucket) {
              return {
                  stroke: true,
                  color: bucket.stroke,
                  opacity: opacity,
                  fillOpacity: opacity,
                  weight: bucket.weight || 1,
                  fill: true,
                  fillColor: bucket.fill,
                  clickable: !!opts.esri_opts.pointToLayer
                };
            } else {
              console.log("Can't find this: ", feature, opts.color_buckets);
              return {opacity: opacity};
            }
          }
        });

      _.each(layer._layers, function (line) {
        line.setStyle({"opacity": opacity});
        if (opts.each_line) { opts.each_line(line); }
      });
    });
  }

  Renderers[layer_id] = renderer;
}
