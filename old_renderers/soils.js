/*global LayerInfo, Renderers, _ */
Renderers.soils = {
  pickle: function (al) {
    delete al.legend_base_url;
    al.leaflet_layer_ids = [];
  },
  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var soils_layer = active_layer.parameters.soils_layer;
    var name =  layer_default.name + " soils_layer:" + soils_layer;
    return name;
  },
  update_legend_url: function (active_layer) {
    var soils_layer = active_layer.parameters.soils_layer;
    active_layer.legend_base_url = CDN("http://rmgsc.cr.usgs.gov/arcgis/services/ecosys_US/MapServer/WmsServer?request=GetLegendGraphic%26version=1.1.1%26format=image/png%26layer=");
  },
  active_leaflet_layer: function (map, active_layer) {
    var soils_layer = active_layer.parameters.soils_layer;

    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids,
                                          {"soils_layer": soils_layer});
    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  create_leaflet_layers: function (map, active_layer) {
    var soils_layer = active_layer.parameters.soils_layer;

    var active_leaflet_layer = Renderers.soils.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
        var new_layer =  new L.TileLayer.WMS(CDN("http://rmgsc.cr.usgs.gov/arcgis/services/ecosys_US/MapServer/WmsServer?"), {
                      layers: soils_layer,
                      format: 'image/png',
                      opacity: 0,
                      zIndex: -1,
                      transparent: true });

        new_layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
        new_layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
        new_layer.addTo(map);
        active_layer.leaflet_layer_ids.push({soils_layer: soils_layer,
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
    Renderers.soils.create_leaflet_layers(map, active_layer);
    Renderers.soils.update_legend_url(active_layer);

    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    var active_leaflet_layer = Renderers.soils.active_leaflet_layer(map, active_layer);

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
