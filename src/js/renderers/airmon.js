/*global JSONFeeds, Renderers, L, _ */
Renderers.airmon = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "./img/airmon.png";
    active_layer.legend_url_text = "Click map icon for real-time data";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var layer = new L.GeoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'img/airmon.png',
                    iconSize: [18, 21],
                    iconAnchor: [12, 28],
                    popupAnchor: [0, -25],
                    opacity: 0
                }),
                title: feature.properties.name
            });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<strong>" + feature.properties.stat_name +"</strong><br>" +
                          "Location:" + feature.properties.location + "<br>" +
                          (feature.properties.dec_uid != null ? "<a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'>More info</a><br><a href='http://www.dec.ny.gov/airmon/stationStatus.php?stationNo="+ feature.properties.dec_uid + "' target='_blank_'><img src='http://www.dec.ny.gov/airmon/stationUSAQIGraph.php?stationno="+ feature.properties.dec_uid + "' width='100%'></a><br>" : "") +
                          "<a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'>Zoom to feature</a>",
              { closeButton: false }
              );
        }
      });

      Renderers.airmon.jsonp_callback = function (data) {
        Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        layer.addData(data);
      };

      $.ajax({
        cache: true,
        url: CDN(MAP_SERVER_HOST + "/geoserver/wfs"),
        data: {
          service: "WFS",
          version: "1.1.0",
          request: "GetFeature",
          typeName: "airmon",
          srsName: "EPSG:4326",
          outputFormat: "text/javascript",
          format_options: "callback:Renderers.airmon.jsonp_callback;"
        },
        success: function (data) {
            // Nothing ever gets here. See above
        },
        error:   function (err) {
          if (err.status !== 200) {
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          }
        }
      });

      layer.addTo(map);
      active_layer.leaflet_layer_ids = [layer._leaflet_id];
    }
  },
  // remove: function (map, active_layer) {
  // Use DEFAULT remove
  render: function (map, active_layer, z_index) {
    // Make sure the right layers are created!
    Renderers.airmon.create_leaflet_layers(map, active_layer);
    Renderers.airmon.update_legend_url(active_layer);

    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      _.each(layer._layers, function (point) {
        if (active_layer.is_hidden) {
          point.setOpacity(0);
        } else {
          point.setOpacity(1);
        }
      });
    });
  }
};
