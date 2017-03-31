Renderers.sewer_overflows = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.parameters.total_shown;
    al.leaflet_layer_ids = [];
  },
  cache: null,
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
      var ingest = function (data) {
        var group = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          disableClusteringAtZoom: 11,
          iconCreateFunction: function (cluster) {
            return new L.DivIcon({
              html: cluster.getChildCount(),
              className: 'sewer_overflowsCluster',
              iconSize: new L.Point(50,48)
            });
          }
        });

        var markers = new L.GeoJSON(null, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: './img/sewer-overflows.png',
                        iconSize: [18, 21],
                        iconAnchor: [12, 28],
                        opacity: 0,
                        popupAnchor: [0, -25]
                    }),
                    title: feature.properties.name
                });
            },
            onEachFeature: function (feature, layer) {
              layer.bindPopup(
                "<strong>Facility:</strong> " + feature.properties.facility_name + "<br/>" +
                "<strong>Owner: </strong>" + feature.properties.facility_owner_name + "<br/>" +
                "<strong># Of Overflow Events: </strong>" + feature.properties.number_of_overflow_events + "<br/>" +
                "<strong># Of Permitted Outfalls: </strong>" + feature.properties.number_of_permitted_outfalls + "<br/>" +
                "<strong>Outfall #: </strong>" + feature.properties.outfall_number + "<br/>" +
                "<strong>Receiving Waterbody:</strong> " + feature.properties.receiving_waterbody_name + "<br/>" +
                "<strong>Permit #: </strong>" + feature.properties.spdes_permit_number + "<br/>" +
                "<br><a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'> Zoom to feature </a>");
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

      if (Renderers.sewer_overflows.cache) {
        ingest(Renderers.sewer_overflows.cache);
      } else {
        $.ajax({
          cache: true,
          url: CDN("http://52.2.5.122:8080/geoserver/www/sewer-overflows.geojson.json"),
          data: {
          },
          success: function (data) {
            Renderers.sewer_overflows.cache = data;
            ingest(data);
          },
          error:   function (err) {
            if (err.status !== 200) {
              Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
            }
          }
        });
      }
    }
  },
  render: function (map, active_layer, z_index) {
    // Make sure the right layers are created!
    Renderers.sewer_overflows.create_leaflet_layers(map, active_layer);

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
