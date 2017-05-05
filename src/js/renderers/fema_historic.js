/*global LayerInfo, Renderers, _ */
Renderers.fema_historic = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
    delete al.parameters.legend_text;
    delete al.parameters.legend_range;
    delete al.legend_url_text;
  },

  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var fema_historic_layer = active_layer.parameters.fema_historic_layer;
    var name =  layer_default.name + " fema_historic_layer:" + fema_historic_layer;
    return name;
  },

  legend_cache: {},

  update_legend_data: function (active_layer) {

    active_layer.legend_url_text = "Number of FEMA events";
    Renderers.fema_historic.get_legend_data(active_layer,
      function (error, legend_data) {
        if (error) {
          console.log("Error!", error);
          Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
        } else {
          active_layer.parameters.legend_text = legend_data.name;
          active_layer.parameters.legend_range = _.map(legend_data.drawingInfo.renderer.classBreakInfos, function (cbi) {
            var clr = "rgba(" + cbi.symbol.color.join(",") + ")";
            return {c: clr, s: cbi.label};
          });
        Views.ControlPanel.fire("update-layers-parameters", active_layer)
       }
      });
  },
  get_legend_data: function (active_layer,callback) {
    var fhl = active_layer.parameters.fema_historic_layer;
    // callback(error, geojson_data?)
    if (Renderers.fema_historic.legend_cache[fhl]) {
      callback(null, Renderers.fema_historic.legend_cache[fhl]);
    } else {
      $.ajax({
        url: CDN("http://gis.fema.gov/REST/services/FEMA/HistoricalDesignations/MapServer/" + fhl),
        data: {f: "pjson"},
        dataType: "jsonp",
        success: function (data) {
          Renderers.fema_historic.legend_cache[fhl] = data;
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
  active_leaflet_layer: function (map, active_layer) {
    var fema_historic_layer = active_layer.parameters.fema_historic_layer;

    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids,
                                          {"fema_historic_layer": fema_historic_layer});
    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  create_leaflet_layers: function (map, active_layer) {
    var fema_historic_layer = active_layer.parameters.fema_historic_layer;

    var active_leaflet_layer = Renderers.fema_historic.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      var new_layer =  new L.esri.dynamicMapLayer({
          url: CDN("http://gis.fema.gov/REST/services/FEMA/HistoricalDesignations/MapServer"),
          // No longer defaults to image, but JSON
          layers: [fema_historic_layer
            ],
          f:"image",
          clickable: false,
          attribution: 'FEMA'});

      new_layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      new_layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      new_layer.addTo(map);

      active_layer.leaflet_layer_ids.push({fema_historic_layer: fema_historic_layer,
                                           leaflet_id: new_layer._leaflet_id});
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
    Renderers.fema_historic.create_leaflet_layers(map, active_layer);
    Renderers.fema_historic.update_legend_data(active_layer);
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    var active_leaflet_layer = Renderers.fema_historic.active_leaflet_layer(map, active_layer);

    _.each(layers, function (layer) {
      var opacity = active_layer.is_hidden ? 0 :
                    active_layer.parameters.opacity;
      if (active_leaflet_layer &&
          layer._leaflet_id === active_leaflet_layer._leaflet_id) {
        layer.setOpacity(opacity / 100.0);
        layer.setZIndex(z_index);
      } else {
        layer.setOpacity(0);
        layer.setZIndex(-1);
      }
    });
  },
};
