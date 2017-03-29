Renderers.dams = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = null ; //"./img/dam.png";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      var group = new L.MarkerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 40,
        disableClusteringAtZoom: 10,
        iconCreateFunction: function (cluster) {
          return new L.DivIcon({
            html: cluster.getChildCount(),
            className: 'damsCluster',
            iconSize: new L.Point(35,35)
          });
        }
      });

      // Now we make the call to the server.
      Renderers.dams.jsonp_callback = function (data) {
        Views.ControlPanel.fire("tile-layer-loaded", active_layer);

        var markers = new L.GeoJSON(null, {
            pointToLayer: function (feature, latlng) {
              // Hazard "A" -- Low Hazard
              // Hazard "B" -- Intermediate
              // Hazard "C" -- High Hazard
              // Hazard "D / 0" -- Unknown
              var url = "./img/dam-";
              if (feature.properties.hazard_code === "A" ||
                  feature.properties.hazard_code === "a") {
                url += "a.png";
              } else if (feature.properties.hazard_code === "B" ||
                  feature.properties.hazard_code === "b") {
                url += "b.png";
              } else if (feature.properties.hazard_code === "C" ||
                  feature.properties.hazard_code === "c") {
                url += "c.png";
              } else {
                url += "unk.png";
              }
                return L.marker(latlng, {
                  riseOnHover: true,
                    icon: L.icon({
                        className: "dam-" + feature.properties.hazard_code.toLowerCase() ,
                        iconUrl: url,
                        iconSize: [16, 18],
                        iconAnchor: [12, 28],
                        opacity: 0,
                        popupAnchor: [0, -25]
                    }),
                    title: feature.properties.name
                });
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup("<h3>"+ feature.properties.name + "</h3>" +
                              "<h4>"+ feature.properties.hazard + "</h4></br>" +
                              "<p>State ID: "+ feature.properties.state_id + "</p>" +
                              "<p>Federal ID: "+ feature.properties.federal_id + "</p>" +
                              "<a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'> Zoom to feature </a>");
            }
          });

        markers.addData(data);
        group.addLayer(markers);
        group.addTo(map);
        active_layer.leaflet_layer_ids = [group._leaflet_id];
      };

      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];

      $.ajax({
        cache: true,
        url: CDN(MAP_SERVER_HOST + "/geoserver/wfs"),
        data: {
          service: "WFS",
          version: "1.1.0",
          request: "GetFeature",
          typeName: "dams",
          outputFormat: "text/javascript",
          format_options: "callback:Renderers.dams.jsonp_callback;"
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
      Renderers.dams.create_leaflet_layers(map, active_layer);
    }
    Renderers.dams.update_legend_url(active_layer);

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
