RendererTemplates.ma_climate_data_cache = {};

RendererTemplates.ma_climate_data_colorize = (metrics_range, value, colors) => {
 //console.log(metrics_range,value,colors) // Should search for which bucket this goes in (
  // Start from left.
  // Find the first quantile which our value is LESS than.
  //    if it's < [0], it returns immediately.
  //    error case is if it's > [last], which is -1
  //    and we set that to the last bucket index.
  let index = _.findIndex(metrics_range, (qv) => { return value <= qv;});

  if (index === -1 ) {
    index = metrics_range.length;
  }
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
  // Basins
  "Blackstone Basin": "Blackstone",
  "Boston Harbor Basin": "Boston Harbor",
  "Buzzards Bay Basin": "Buzzards Bay",
  "Cape Cod Basin": "Cape Cod",
  "Charles Basin": "Charles",
  "Chicopee Basin": "Chicopee",
  "Connecticut Basin": "Connecticut",
  "Deerfield Basin": "Deerfield",
  "Farmington Basin": "Farmington",
  "French Basin": "French",
  "Housatonic Basin": "Housatonic",
  "Hudson Basin":"Hudson",
  "Islands Basin": "Islands",
  "Ipswich Basin": "Ipswich",
  "Merrimack Basin": "Merrimack",
  "Millers Basin": "Millers",
  "Narragansett Basin": "Narragansett Bay & Mt. Hope Bay Shore",
  "Nashua Basin": "Nashua",
  "North Coastal Basin": "North Coastal",
  "Parker Basin": "Parker",
  "Quinebaug Basin": "Quinebaug",
  "Shawsheen Basin": "Shawsheen",
  "South Coastal Basin": "South Coastal",
  "SuAsCo Basin":"SuAsCo",
  "Taunton Basin":"Taunton",
  "Ten Mile Basin":"Ten Mile",
  "Westfield Basin":"Westfield",
};

RendererTemplates.ma_climate_data = function (layer_id, opts) {
  let geometries = {
    "county": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1545%2C%201724%2C%201646%2C%201644%2C%201596%2C%201554%2C%201645%2C%201622%2C%201676%2C%201606%2C%201708%2C%201555%2C%201725%2C%201730",
    "state": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1922",
    "basin": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=2086%2C2087%2C2088%2C2089%2C2090%2C2091%2C2092%2C2093%2C2094%2C2095%2C2096%2C2097%2C2098%2C2099%2C2100%2C2101%2C2102%2C2103%2C2104%2C2105%2C2106%2C2107%2C2108%2C2109%2C2110%2C2111%2C2112",
    //"6km": "" ,
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
