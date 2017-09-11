RendererTemplates.geojson_points_cache = {};

RendererTemplates.geojson_points = function (layer_id, opts) {
  let loading = {};

  let get_opts = function (active_layer) {
    return active_layer.parameters.options;
  };

  let load_data_url = (durl) => {
    return new Promise( (win, lose) => {
      if (RendererTemplates.geojson_points_cache[durl]) {
        win(RendererTemplates.geojson_points_cache[durl])
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              RendererTemplates.geojson_points_cache[durl] = json;
              win(json);
            },
            error:   function (err) {
              lose();
            }
          });
        }
      }
    });

  };

  var renderer = RendererTemplates.base(layer_id, opts, {
    find_geo_json: function (map, active_layer, evt) {
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
      if (active_leaflet_layer) {
        let latlng = evt.latlng;
        let match = leafletPip.pointInLayer(evt.latlng, active_leaflet_layer, true);
        if (match[0]) {
          return match[0].feature.properties;
        } else {
          return null;
        }
      }
      return null;
    },
    render: function (map, active_layer, pane) {
      load_data_url(opts.url)
      .then((data) => {
        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            return new Promise((win, lose) => {
              var layer = new L.GeoJSON(data, {
                pointToLayer: opts.pointToLayer,
                pane: pane,
                onEachFeature: (feature, layer) => {
                  if (opts.onEachGeometry) {
                    opts.onEachGeometry(data, active_layer, feature, layer);
                  }
                  if (opts.popupContents) {
                    layer.bindPopup(opts.popupContents(feature));
                  }
                }
              });
              win(layer);
              Views.ControlPanel.fire("tile-layer-loaded", active_layer);
            })
          },
          () => {
            var opacity = Renderers.opacity(active_layer);
            var layers = Renderers.get_all_leaflet_layers(map,active_layer);
            var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
            let base_style = {
              "weight": '1'
            };

            _.each(layers, function (layer) {
              // Hide the ones which aren't active
              if (active_leaflet_layer && active_leaflet_layer._leaflet_id === layer._leaflet_id) {
                layer.setStyle((feature) => {
                  return _.merge({}, base_style, {opacity: opacity, fillOpacity: Math.max(0, opacity - 0.2)});
                });
              } else {
                layer.setStyle((feature) => {
                  return _.merge({}, base_style, {opacity: 0, fillOpacity: 0})
                });
              }
            });
          }
        )
      })
      .catch((err) => {
        Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
      })
    }
  });
  Renderers[layer_id] = renderer;
}
