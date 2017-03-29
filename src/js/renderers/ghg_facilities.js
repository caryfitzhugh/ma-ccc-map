Renderers.ghg_facilities = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "./img/ghg_facilities.png";
    active_layer.legend_url_text = "Click map icons for more info";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      Renderers.ghg_facilities.jsonp_callback = function (data) {
        var markers = new L.GeoJSON(null, {
          pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {
                  icon: L.icon({
                      iconUrl: './img/ghg_facilities.png',
                      iconSize: [16, 18],
                      iconAnchor: [12, 28],
                      opacity: 0,
                      popupAnchor: [0, -25]
                  }),
                  title: feature.properties.name
              });
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup("<strong>" + feature.properties.name +"<br>" +
                          "Parent Company:</strong> " + feature.properties.parent_company + "<br>" +
                          feature.properties.ghg_quantity+" metric tons<br>" +
                          "<a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'>Zoom to feature</a>",
              { closeButton: false }
              );
          }
        });
        markers.addData(data);

        var group = new L.MarkerClusterGroup({
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          disableClusteringAtZoom: 11,
          iconCreateFunction: function (cluster) {
            return new L.DivIcon({
              html: cluster.getChildCount(),
              className: 'ghg_facilitiesCluster',
              iconSize: new L.Point(35,35)
            });
          }
        });

        Views.ControlPanel.fire("tile-layer-loaded", active_layer);

        group.addLayer(markers);
        group.addTo(map);
        active_layer.leaflet_layer_ids = [group._leaflet_id];
      };

      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];

      $.ajax({
        url: CDN(MAP_SERVER_HOST + "/geoserver/wfs"),
        data: {
          service: "WFS",
          version: "1.1.0",
          request: "GetFeature",
          typeName: "ghg_facilities",
          srsName: "EPSG:4326",
          outputFormat: "text/javascript",
          format_options: "callback:Renderers.ghg_facilities.jsonp_callback;"
        },
        cache: true,
        success: function (data) {
            // Nothing ever gets here. See above
        },
        error:   function (err) {
          if (err.status !== 200) {
            Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
          }
        }
      });

      active_layer.leaflet_layer_ids = ["loading-so-we-don't-race-conflict"];
    }
  },
  render: function (map, active_layer, z_index) {
    // Make sure the right layers are created!
    if (!active_layer.is_hidden) {
      // Only create if you need to!
      Renderers.ghg_facilities.create_leaflet_layers(map, active_layer);
    }
    Renderers.ghg_facilities.update_legend_url(active_layer);

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
