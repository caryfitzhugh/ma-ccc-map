/*global JSONFeeds, Renderers, L, _ */
Renderers.usgs_streamflow = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;

    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = "img\/USGSflowLegend.jpg";
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      function getGageColors(d) {
            return d == 0 ? '#FFFFFF' :
                   d == 1 ? '#FF0000' :
                   d == 2 ? '#B12121' :
                   d == 3 ? '#B12121' :
                   d == 4 ? '#FFA400' :
                   d == 5 ? '#00FF00' :
                   d == 6 ? '#40DFD0' :
                   d == 7 ? '#0000FF' :
                   d == 8 ? '#000' :
                           '#FFEDA0' ;
        }


      var layer = new L.GeoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng,  {
              title: feature.properties.name,
              radius: 4,
              fillColor: getGageColors(feature.properties.class),
              fillOpacity: 0.8,
              color: "black",
              weight: 1,
              opacity: 1,
              zIndex:100
            });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<b>" + feature.properties.name + "</b></br>Updated: " + feature.properties.date + " @ "+ feature.properties.time + "</br>Stage: " + feature.properties.stage + "</br>Discharge: " + feature.properties.discharge +  "</br><a href='" + feature.properties.url + "' target='_blank_'><button>Data Link</button></a></br>"+
                          "<a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'>Zoom to feature</a>"
              );
        }
      });

      Renderers.usgs_streamflow.jsonp_callback = function (data) {
        layer.addData(data);
        var updates = _.sortBy(data.features, function (station) {
          [station.properties.date, station.properties.time];
        });

        active_layer.legend_url_text = "Curent conditions (as of " +
          updates[0].properties.date + " " + updates[0].properties.time +"), click for info";

        Views.ControlPanel.fire("tile-layer-loaded", active_layer);
      };

      $.ajax({
        cache: true,
        url: CDN(MAP_SERVER_HOST + "/geoserver/wfs"),
        data: {
          service: "WFS",
          version: "1.1.0",
          request: "GetFeature",
          typeName: "usgs_streamflow",
          srsName: "EPSG:4326",
          outputFormat: "text/javascript",
          format_options: "callback:Renderers.usgs_streamflow.jsonp_callback;"
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
    Renderers.usgs_streamflow.create_leaflet_layers(map, active_layer);
    Renderers.usgs_streamflow.update_legend_url(active_layer);

    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);
    var all_svg_parents = [];

    _.each(layers, function (layer) {
      _.each(layer._layers, function (point, id) {
        var svg = point._container.parentNode;
        // We are really just looking for the SVG parent elements here.
        all_svg_parents.push(svg);
        // Probably always resolves to only one... but... ?
      });
    });

    _.each(_.uniq(all_svg_parents), function (svg) {
      var opacity = active_layer.is_hidden ? 0 :
                    active_layer.parameters.opacity;
      svg.style.opacity = opacity / 100.0;
      svg.style.zIndex = z_index;
    });
  }
};
