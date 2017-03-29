Renderers.spdes = {
  pickle: function (al) {
    delete al.parameters.total_shown;
    al.leaflet_layer_ids = [];
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      Renderers.spdes.jsonp_callback = function (data) {

        var group = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          maxClusterRadius: 40,
          disableClusteringAtZoom: 10,
          iconCreateFunction: function (cluster) {
            return new L.DivIcon({
              html: cluster.getChildCount(),
              className: 'spdesCluster',
              iconSize: new L.Point(40,40)
            });
          }
        });

        var markers = new L.GeoJSON(null, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: './img/spdes.png',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                        opacity: 0,
                        popupAnchor: [0, -25]
                    }),
                    title: feature.properties.name
                });
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(feature.properties.name + "<br><a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'> Zoom to feature </a>");
            }
          });

        // Fix the data if it is MultiPoints - convert to points. for clusters.
        data.features = _.map(data.features, function (feature) {
          if (feature.geometry.type === "MultiPoint") {
            feature.geometry.type = "Point";
            feature.geometry.coordinates = feature.geometry.coordinates[0];
          }
          return feature;
        });

        markers.addData(data);
        group.addLayer(markers);
        group.addTo(map);

        active_layer.parameters.total_shown = data.features.length;
        active_layer.leaflet_layer_ids = [group._leaflet_id];
        // This needs to come last!
        Views.ControlPanel.fire("tile-layer-loaded", active_layer);
      };

      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];

      $.ajax({
        cache: true,
        url: CDN(MAP_SERVER_HOST + "/geoserver/wfs"),
        data: {
          service: "WFS",
          version: "1.1.0",
          request: "GetFeature",
          typeName: "spdes",
          srsName: "EPSG:4326",
          outputFormat: "text/javascript",
          format_options: "callback:Renderers.spdes.jsonp_callback;"
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
    }
  },
  render: function (map, active_layer, z_index) {
    // Make sure the right layers are created!
    if (!active_layer.is_hidden) {
      // Only create if you need to!
      Renderers.spdes.create_leaflet_layers(map, active_layer);
    }

    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      if (active_layer.is_hidden) {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
          active_layer.leaflet_layer_ids = [];
        }
      }
    });
  }
};
