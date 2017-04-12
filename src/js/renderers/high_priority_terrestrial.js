/*global LayerInfo, Renderers, _ */
Renderers.high_priority_terrestrial = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var display_layer = active_layer.parameters.display_layer;
    var name =  layer_default.name + " ayer:" + display_layer;
    return name;
  },
  update_legend_url: function (active_layer) {
    var display_layer = active_layer.parameters.display_layer;
    active_layer.legend_url = CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=" + display_layer + "&FORMAT=image/gif&SCALE=55467893.20400156");
  },
  active_leaflet_layer: function (map, active_layer) {
    var display_layer = active_layer.parameters.display_layer;

    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids,
                                          {"display_layer": display_layer});
    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  create_leaflet_layers: function (map, active_layer) {
    var display_layer = active_layer.parameters.display_layer;
    var active_leaflet_layer = Renderers.high_priority_terrestrial.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
        var new_layer =  new L.TileLayer.WMS(CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer?"), {
                layers: display_layer,
                minZoom: 7,
                format: 'image/png',
                opacity: 0,
                zIndex: -1,
                transparent: true
              });

        new_layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
        new_layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
        new_layer.addTo(map);
        active_layer.leaflet_layer_ids.push({display_layer: display_layer,
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
    Renderers.high_priority_terrestrial.create_leaflet_layers(map, active_layer);
    Renderers.high_priority_terrestrial.update_legend_url(active_layer);

    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    var active_leaflet_layer = Renderers.high_priority_terrestrial.active_leaflet_layer(map, active_layer);

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
  },
  get_feature_info_xml_url: function (active_layer) {
    var display_layer = active_layer.parameters.display_layer;
    return CDN("http://anrmaps.vermont.gov/arcgis/services/Open_Data/OPENDATA_ANR_ECOLOGIC_SP_NOCACHE_v1/MapServer/WMSServer") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&"+
          // NOT SURE ON LAYERS?
          "LAYERS=" + display_layer + 
          // NOT SURE ON LAYERS?
          "&QUERY_LAYERS=" + display_layer + 
          "&STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=application%2Fjson&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }
};
