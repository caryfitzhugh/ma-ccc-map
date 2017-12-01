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
    render: function (map, active_layer, pane) {
      load_data_url(opts.url)
      .then((data) => {
        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            return new Promise((win, lose) => {
              let features = opts.selectData ? opts.selectData(active_layer, data.features) : data.features;

              var layer = new L.GeoJSON(Object.assign({}, data, {features: features}), {
                pointToLayer: function(feature, latlng) {
                  if (opts.pointToLayer) {
                    return opts.pointToLayer(active_layer, feature, latlng);
                  }
                },
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

            _.each(layers, function (layer) {
              // Hide the ones which aren't active
              if (active_leaflet_layer && active_leaflet_layer._leaflet_id === layer._leaflet_id) {
                Object.keys(layer._layers).forEach((key) => {
                  let point = layer._layers[key];
                  point.setOpacity(opacity);
                });
              } else {
                Object.keys(layer._layers).forEach((key) => {
                  let point = layer._layers[key];
                  point.setOpacity(0);
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
