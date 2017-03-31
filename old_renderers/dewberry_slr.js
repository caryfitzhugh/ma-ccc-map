/*global LayerInfo, Renderers, _ */
Renderers.dewberry_slr = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
    delete al.legend_url;
    delete al.legend_url_text;
  },
  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var rise = active_layer.parameters.rise;
    var year = active_layer.parameters.year;
    var name =  layer_default.name + " Rise:" + rise+ " Year:" + year;
    return name;
  },
  update_legend_url: function (active_layer) {
    var rise = active_layer.parameters.rise;
    var year = active_layer.parameters.year;
    active_layer.legend_url = "img/dewberry_slr.png";
    //active_layer.legend_url_text = "Estimated water depth (m)";
  },
  active_leaflet_layer: function (map, active_layer) {
    var rise = active_layer.parameters.rise;
    var year = active_layer.parameters.year;
    var active_leaflet_layer_id =  _.find(active_layer.leaflet_layer_ids,
                                          {"rise":rise,"year": year});
    var result;
    if (active_leaflet_layer_id) {
      result = Renderers.lookup_layers(map, [active_leaflet_layer_id.leaflet_id])[0];
    }
    return result;
  },
  create_leaflet_layers: function (map, active_layer) {
    var rise = active_layer.parameters.rise;
    var year = active_layer.parameters.year;
    var risenum=+rise*4;
    var yearnum=+year;
    var layer_array= [34+risenum+yearnum,67+risenum+yearnum,100+risenum+yearnum];

    var active_leaflet_layer = Renderers.dewberry_slr.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      var new_layer = new L.esri.dynamicMapLayer({
          url: CDN("http://services.nyserda.ny.gov/arcgis/rest/services/NYSERDA_SLR_Viewer/MapServer"),
          // No longer defaults to image, but JSON
          layers: layer_array,
          f:"image",
          format:"png8",
          opacity: 0,
          zIndex: -1,
          attribution: 'Dewberry Sea Level Rise (SLR)'});

      new_layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      new_layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      new_layer.addTo(map);
      active_layer.leaflet_layer_ids.push({rise: rise,
                                           year: year,
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
    Renderers.dewberry_slr.create_leaflet_layers(map, active_layer);
    Renderers.dewberry_slr.update_legend_url(active_layer);

    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    var active_leaflet_layer = Renderers.dewberry_slr.active_leaflet_layer(map, active_layer);

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
 /* ,
  get_feature_info_url: function (active_layer) {
    var rise = active_layer.parameters.rise;
    var year = active_layer.parameters.year;

    return CDN("http://ciesin.columbia.edu/geoserver/gwc/service/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=dewberry:flood_"+rise+"_"+year+"&"+
          "QUERY_LAYERS=dewberry:flood_"+rise+"_"+year+"&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }*/
};
