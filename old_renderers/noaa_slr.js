/*global _, Renderers, L */
Renderers.noaa_slr = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  has_standalone_wizard: true,
  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});

    var rise = active_layer.parameters.sea_level_height;
    var view = active_layer.parameters.display_layer;

    var name =  layer_default.name + " " + rise + "ft " + (view === "conf" ? "Confidence" : "Sea Rise");
    return name;
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "./img/noaa_" + active_layer.parameters.display_layer + "Legend.jpg";
  },
  active_leaflet_layer: function (map, active_layer) {
    var rise = active_layer.parameters.sea_level_height;
    var view = active_layer.parameters.display_layer;

    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids, {"rise": rise, "view": view});
    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  create_leaflet_layers: function (map, active_layer) {
    var rise = active_layer.parameters.sea_level_height;
    var view = active_layer.parameters.display_layer;

    var active_leaflet_layer = Renderers.noaa_slr.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
         var new_layer = new L.esri.dynamicMapLayer({
                    url: CDN("https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/"+view+"_"+rise+"ft/MapServer"),
                    // No longer defaults to image, but JSON
                    f:"image",
                    opacity: 0,
                    zIndex: -1,
                    attribution: 'NOAA Sea Level Rise (SLR)'})

        new_layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
        new_layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });

        new_layer.addTo(map);
        active_layer.leaflet_layer_ids.push({view: view, rise: rise, leaflet_id: new_layer._leaflet_id});
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
    Renderers.noaa_slr.create_leaflet_layers(map, active_layer);
    Renderers.noaa_slr.update_legend_url(active_layer);

    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    var active_leaflet_layer = Renderers.noaa_slr.active_leaflet_layer(map, active_layer);

    _.each(layers, function (layer) {
      var opacity = active_layer.is_hidden ? 0 :
                    active_layer.parameters.opacity;
      if (layer._leaflet_id === active_leaflet_layer._leaflet_id) {
        layer.setOpacity(opacity / 100.0);
        layer.setZIndex(z_index);
      } else {
        layer.setOpacity(0);
        layer.setZIndex(-1);
      }
    });
  }
};
