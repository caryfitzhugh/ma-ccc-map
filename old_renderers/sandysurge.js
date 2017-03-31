Renderers.sandysurge = {
  pickle: function (al) {
    delete al.parameters.legend_range;
    delete al.parameters.legend_text;
    al.leaflet_layer_ids = [];
  },
  clone_layer_name: function (active_layer) {
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var resolution = active_layer.parameters.resolution;
    var name =  layer_default.name + " resolution:" + resolution;
    return name;
  },
  update_legend: function (active_layer) {
    active_layer.parameters.legend_text = "NYC Surge Area (Field verified Feb 2013)";
    var vhr =   { c: "rgb(116, 178, 255)",
        v: null,
        s: "Very High Resolution (1m)"};

    var hr =   { c: "rgb(41, 59, 97)",
        v: null,
        s: "High Resolution (3m)"};

    active_layer.parameters.legend_range = []
    if (active_layer.parameters.resolution === "0") {
      active_layer.parameters.legend_range = [vhr, hr];
    } else if (active_layer.parameters.resolution === "1") {
      active_layer.parameters.legend_range = [vhr];
    } else {
      active_layer.parameters.legend_range = [hr];
    }
  },
  active_leaflet_layer: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["resolution"]);
    var active_leaflet_layer =  _.find(active_layer.leaflet_layer_ids, p);
    return active_leaflet_layer;
  },
  create_leaflet_layers: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["resolution"]);

    var active_leaflet_layer = Renderers.sandysurge.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {
      active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));
      var layer = new L.esri.dynamicMapLayer( {
        url: CDN("http://services.femadata.com/arcgis/rest/services/2012_Sandy/SurgeBoundaries_Final_0214/MapServer"),
                    layers: [active_layer.parameters.resolution],
        f:"image",
        format: "png8",
        transparent: true,
        dpi: 96,
        clickable: false,
        attribution: 'FEMA'
      });
      layer.on("nyccsc-loaded", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("nyccsc-error", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      layer.addTo(map);

      // Lookup the active placeholder
      active_leaflet_layer = Renderers.sandysurge.active_leaflet_layer(map, active_layer);
      active_leaflet_layer.leaflet_id = layer._leaflet_id;
    }
  },
/*
  get_feature_info_url: function (active_layer, map) {
    return CDN("http://services.femadata.com/arcgis/rest/services/2012_Sandy/SurgeBoundaries_Final_0214/MapServer/identify") +
      "?f=json" +
      "&tolerance=5" +
      "&returnGeometry=true" +
      "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
      "&maxAllowableOffset=150" +
      "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
      "&geometryType=esriGeometryPoint" +
      "&sr=4326" +
      "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
      "&layers=visible%3A" + active_layer.parameters.resolution;
  },
*/
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
    Renderers.sandysurge.update_legend(active_layer);
    Renderers.sandysurge.create_leaflet_layers(map, active_layer);

    var active_leaflet_layer = Renderers.sandysurge.active_leaflet_layer(map, active_layer);
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      // Right here we hide / show the layer
      var opacity = active_layer.parameters.opacity;
      if (active_layer.is_hidden ||
          layer._leaflet_id !== active_leaflet_layer.leaflet_id) {
        opacity = 0;
      }

      layer.setOpacity(opacity / 100.0);
      layer.setZIndex(z_index);
    });
  }
};
