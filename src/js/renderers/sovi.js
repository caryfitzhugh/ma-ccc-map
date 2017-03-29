Renderers.sovi = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("https://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer?service=wms&version=1.1.1&request=GetLegendGraphic&format=image/png&layer=10,41&WIDTH=100&HEIGHT=50");
    active_layer.legend_url_text = "Social Vulnerability Index Rank (click map for more info)";

  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.TileLayer.WMS(CDN("http://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer?"), {
        layers: '10,41',
        format: 'image/png',
        transparent: true,
        opacity: 0,
        zIndex: -1
      });

      layer.on("tileload", function (loaded) { Views.ControlPanel.fire("tile-layer-loaded", active_layer); });
      layer.on("tileerror", function (err) { Views.ControlPanel.fire("tile-layer-loading-error", active_layer); });
      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  },
  get_feature_info_xml_url: function (active_layer) {
    return CDN("http://coast.noaa.gov/arcgis/services/sovi/sovi_tracts2010/MapServer/WMSServer") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=41&" +
          "QUERY_LAYERS=10&" +
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=1&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  }
};
