RendererTemplates.ma_climate_data_cache = {};

RendererTemplates.ma_climate_data_colorize = (metrics_range, value, colors) => {
  // Should search for which bucket this goes in (
  // -1 because we "pass" it.
  let index = _.findIndex(metrics_range, (qv) => { return value <= qv;}) - 1;
  return colors[index];
};

RendererTemplates.ma_climate_data_translation = {
  "Massachusetts": "MA",
  "Barnstable County, MA": "Barnstable",
  "Berkshire County, MA": "Berkshire",
  "Bristol County, MA": "Bristol",
  "Dukes County, MA": "Dukes",
  "Essex County, MA": "Essex",
  "Franklin County, MA": "Franklin",
  "Hampden County, MA": "Hampden",
  "Hampshire County, MA": "Hampshire",
  "Middlesex County, MA": "Middlesex",
  "Nantucket County, MA": "Nantucket",
  "Norfolk County, MA": "Norfolk",
  "Plymouth County, MA": "Plymouth",
  "Suffolk County, MA": "Suffolk",
  "Worcester County, MA": "Worcester",
};

RendererTemplates.ma_climate_data = function (layer_id, opts) {
  let geometries = {
    "county": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1545%2C%201724%2C%201646%2C%201644%2C%201596%2C%201554%2C%201645%2C%201622%2C%201676%2C%201606%2C%201708%2C%201555%2C%201725%2C%201730",
    "state": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1922",
    "watershed": "" ,
    "6km": "" ,
  }

  let all_geometries = {
    "county": "County",
    "state": "State",
    "watershed": "HUC8 Watershed",
    "6km": "6km Bounding Box",
  }


  // This takes an active layer and returns a hash of uniquely identifying data (including parameters)
  // This relates a set of params (sliders/toggles/etc) with a leaflet layer.
  // (a_l.parameters.year == 2044)
  //   => {year: 2044, layer: 'future_data',...}
  let get_opts = function (active_layer) {
    return {options: active_layer.parameters.options};
  };

  let loading = {};

  let load_data_url = (durl) =>  {
    return new Promise( (win, lose) => {
      if (RendererTemplates.ma_climate_data_cache[durl]) {
        win(RendererTemplates.ma_climate_data_cache[durl])
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              RendererTemplates.ma_climate_data_cache[durl] = json;
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

  let load_geometry_url = (durl) =>  {
    return new Promise( (win, lose) => {
      if (RendererTemplates.ma_climate_data_cache[durl]) {
        win(_.cloneDeep(RendererTemplates.ma_climate_data_cache[durl]));
      } else  {
        if (!loading[durl]) {
          loading[durl] = true;
          $.ajax({
            cache: true,
            dataType: "json",
            url: durl,
            success: function (json) {
              RendererTemplates.ma_climate_data_cache[durl] = json;
              win(_.cloneDeep(json));
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
      // For this layer, get *all* of the leaflet_layers associated with it
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      // Lookup the *active* leaflet layer from those available
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
      var lyr = Object.keys(active_leaflet_layer._layers)[0];

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
      load_data_url(opts.data_url)
      .then((layer_data) => {
        if (opts.onLoadedData) {
          // You can pre-process the data,
          // You can figure out min/max , buckets, years available, etc.
          opts.onLoadedData(layer_data, active_layer);
        }

        Renderers.create_leaflet_layer_async(
          map,
          active_layer,
          get_opts(active_layer),
          () => {
            return new Promise((win, lose) => {
              load_geometry_url(geometries[active_layer.parameters.options.summary])
              .then((geom_data) => {
                var layer = new L.GeoJSON(geom_data, {
                  pointToLayer: opts.pointToLayer,
                  pane: pane,
                  onEachFeature: (feature, layer) => {
                    opts.onEachGeometry(layer_data, active_layer, feature, layer);
                  }
                });
                win(layer);
                Views.ControlPanel.fire("tile-layer-loaded", active_layer);
              })
              .catch((err) => {
                if (err.status !== 200) {
                  Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
                }
                lose();
              });
            })
          }, () => {

            var opacity = Renderers.opacity(active_layer);
            var layers = Renderers.get_all_leaflet_layers(map,active_layer);
            var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, get_opts(active_layer))
            // http://leafletjs.com/reference-1.2.0.html#path-option
            let base_style = {
              "weight": '1',
              "color": "black",
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
          });
      });
    }
  });

  Renderers[layer_id] = renderer;
}
