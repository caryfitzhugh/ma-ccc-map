/*global _ , Renderers, topojson, CDN */
Renderers.gas_wells = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  clone_layer_name: function (active_layer) {
    var p = _.pick(active_layer.parameters, ["status", "type"]);
    var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
    var name =  layer_default.name + " " + p.status + " " + p.type;
    return name;
  },

  create_leaflet_layers: function (map, active_layer) {
    var p = _.pick(active_layer.parameters, ["status", "type"]);

    var active_leaflet_layer = Renderers.wells.active_leaflet_layer(map, active_layer);

    if (!active_leaflet_layer) {

      var ingest = function (err, data) {
        if (err) {
          // This needs to come last!
          Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
        } else {
          active_layer.leaflet_layer_ids.push(_.merge({}, p, { leaflet_id: "layer-loading"}));

          var statii = _.uniq(_.map(data, "properties.status"));
          var types  = _.uniq(_.map(data, "properties.type"));

          active_layer.parameters.all_statii = statii.sort();
          active_layer.parameters.all_types = types.sort();

          var group = new L.MarkerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 11,
            iconCreateFunction: function (cluster) {
              return new L.DivIcon({
                html: cluster.getChildCount(),
                className: 'gas-wells-cluster'
              });
            }
          });

          var markers = new L.GeoJSON(null, {
              pointToLayer: function (feature, latlng) {
                return new L.CircleMarker(latlng, {
                  radius: 3,
                  color: "rgb(200,0,0)",
                  fillColor: "rgb(200,0,0)",
                  fillOpacity: 0.2
                });
              },
              onEachFeature: function (feature, layer) {
                layer.bindPopup(
                  "<strong> Name: </strong> " + feature.properties.name + "<br/>" +
                  "<strong> Type: </strong> " + feature.properties.type + "<br/>" +
                  "<strong> Company: </strong> " + feature.properties.company + "<br/>" +
                  "<a target='_blank' href='http://www.dec.ny.gov/cfmx/extapps/GasOil/search/wells/index.cfm?api=" + feature.properties.id + "' > API Details </a> <br/>" +
                  "<a href='#' onclick='Renderers.zoom_to([" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0] + "], 15);'> Zoom to feature </a>");
              }
            });

          var filtered_data = _.filter(data,  function (feature) {
                var match_status = (active_layer.parameters.status === "All" || feature.properties.status === active_layer.parameters.status);
                var match_type = (active_layer.parameters.type ===  "All"  || feature.properties.type === active_layer.parameters.type);
                return match_status && match_type;
              });

          markers.addData(filtered_data);
          group.addLayer(markers);
          group.addTo(map);

          active_layer.parameters.all_statii = statii.sort();
          active_layer.parameters.all_types = types.sort();
          active_layer.parameters.total_shown = filtered_data.length;

          // Lookup the active placeholder
          active_leaflet_layer = Renderers.wells.active_leaflet_layer(map, active_layer);

          // Update the leaflet_id
          active_leaflet_layer.leaflet_id = group._leaflet_id;
          // This needs to come last!
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
        }
      };
      Renderers.wells.load_well_data(function (well_type) { return well_type.match(/gas/i); }, ingest);
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
    Renderers.gas_wells.create_leaflet_layers(map, active_layer);

    var active_svg_layer = Renderers.wells.active_leaflet_layer(map, active_layer);
    var leaflet_ids = _.pluck(active_layer.leaflet_layer_ids, "leaflet_id");
    var layers = Renderers.lookup_layers(map, leaflet_ids);

    _.each(layers, function (layer) {
      // Right here we hide / show the layer
      if (active_layer.is_hidden || layer._leaflet_id !== active_svg_layer.leaflet_id) {
        var removed = _.remove(active_layer.leaflet_layer_ids, function (l) { return layer._leaflet_id === l.leaflet_id; });
        map.removeLayer(layer);
      }
    });
  }
};
