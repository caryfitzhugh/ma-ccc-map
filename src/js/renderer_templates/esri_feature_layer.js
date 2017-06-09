RendererTemplates.esri_feature_layer = function (layer_id, opts) {
  function get_esri_opts(active_layer) {
    var esri_opts = opts.esri_opts;
    if (typeof opts.esri_opts === 'function') {
      esri_opts = opts.esri_opts(active_layer);
    }
    return esri_opts;
  }
  function esri_style(active_layer, feature) {
    if (opts.setStyle) {
      return opts.setStyle(opacity, feature);
    } else if (opts.parameters.color_buckets) {
      var bucket = _.find(opts.parameters.color_buckets, function (v) {
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
          console.log("Can't find this: ", feature, lookup, opts.parameters.color_buckets);
        }
      });


      if (bucket) {
        return {
            stroke: true,
            color: bucket.stroke,
            weight: bucket.weight || 1,
            fill: true,
            fillColor: bucket.fill,
            clickable: !!get_esri_opts(active_layer).pointToLayer
          };
      } else {
        console.log("Can't find this: ", feature, opts.parameters.color_buckets);
        return {};
      }
    }
  };

  var renderer = RendererTemplates.base(layer_id, opts,
    {
      find_geojson_match: function (active_layer, match) {
        // Just return the properties..
        return match.feature.properties;
      },
      render: function (map, active_layer, z_index) {

        Renderers.create_leaflet_layer(
          map,
          active_layer,
          get_esri_opts(active_layer),
          () => {
            var layer = new L.esri.featureLayer(get_esri_opts(active_layer));
            layer.on("load", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
            layer.on("requesterror", function (err) { Renderers.add_layer_error(active_layer);});

            // Proxy the click event through to the map!
            if (!get_esri_opts(active_layer).pointToLayer) {
              layer.on("click", function (evt) { LeafletMap.fire('click', evt, true);});
            }

            return layer;
          });

        var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
        var layers = Renderers.get_all_leaflet_layers(map,active_layer);
        var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_esri_opts(active_layer))

        _.each(layers, function (layer) {
          _.each(layers, function (layer) {
            // Hide the ones which aren't active
            if (active_leaflet_layer._leaflet_id === layer._leaflet_id) {
              layer.setStyle(function (feature) {
                return Object.assign({},
                      esri_style(active_layer, feature),
                      {opacity: opacity, fillOpacity: opacity});
              });
            } else {
              layer.setStyle(() => { return {opacity: 0, fillOpacity: 0};});
            }
          });
        });
    },

    find_geo_json: function (map, active_layer, evt) {
      if (get_esri_opts(active_layer).pointToLayer) {
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
    },
    remove: function (map, active_layer) {
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      _.each(layers, function (ll) {
        if (map.hasLayer(ll)) {
          map.removeLayer(ll);
        }
      });
    }

  });

  Renderers[layer_id] = renderer;
}
