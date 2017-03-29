Renderers.power_stations = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.parameters.legend_json;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = null;
    active_layer.legend_url_text = "Station type (click for more info)";
  },
  get_feature_info_url: function (active_layer, map) {
    return "https://eia-ms.esri.com/arcgis/rest/services/20160309StateEnergyProfilesMap/MapServer/identify?"+
      "f=json" +
      "&tolerance=5" +
      "&returnGeometry=true" +
      "&imageDisplay=<%=width%>%2C<%=height%>%2C96" +
      "&maxAllowableOffset=150" +
      "&geometry={\"x\": <%= lng %>,\"y\": <%=lat%>}" +
      "&geometryType=esriGeometryPoint" +
      "&sr=4326" +
      "&mapExtent=<%=xmin%>,<%=ymin%>,<%=xmax%>,<%=ymax%>"+
      "&layers=visible%3A6";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.TileLayer.EsriRest(CDN("https://eia-ms.esri.com/arcgis/rest/services/20160309StateEnergyProfilesMap/MapServer"), {
        layers: '6',
        transparent: true});

      layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });

      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];

      // Load the legend in here!
      $.getJSON(CDN("https://eia-ms.esri.com/arcgis/rest/services/20150824StateEnergyProfilesMap/MapServer/legend?f=pjson"),
                {},
                function (data) {
                  active_layer.parameters.legend_json = _.sortBy(_.filter(data.layers, function (layer) {
                    return layer.layerId <= 20 && layer.layerId >= 7;
                  }), "layerName");

                  Views.ControlPanel.update("layers.active");
                });

    }
  }
};
