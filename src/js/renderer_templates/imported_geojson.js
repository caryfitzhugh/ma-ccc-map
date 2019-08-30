RendererTemplates.imported_geojson = function (layer_id, opts) {
  var renderer = {
    templates: {},
    parameters: {
      opacity: 100,
    },
    // Can't pickle
    update_legend: Renderers.update_legend(opts)
  };

  renderer.render = function (map, active_layer, pane) {
    Renderers.create_leaflet_layer(
      map,
      active_layer,
      active_layer.id,
      () => {
        var layer = new L.GeoJSON(opts.data, {pane: pane,
            style: (feature) => {
              let props = feature.properties || {};
              return {
                stroke: true,
                opacity: props['stroke-opacity'] || 1,
                color: props.stroke || "#000",
                fillColor: "rgba(0,102,51,0.8)",
                weight: props['stroke-width'] || 2,
              };
            },
            onEachFeature: function (feature, layer) {
              let loc_link = "";
              if (layer.getBounds) {
                loc_link = Renderers.utils.zoom_to_location_link( layer.getBounds())
              }
              layer.bindPopup(`<h5>${opts.name}</h5>
                <pre>${JSON.stringify(feature.properties, null, 2)}</pre>
                <br/>
                ${loc_link}
                `
                );
            }
          });
        Views.ControlPanel.fire("tile-layer-loaded", {}, active_layer);
        return layer;
      });

      var opacity = Renderers.opacity(active_layer);
      var layers = Renderers.get_all_leaflet_layers(map,active_layer);
      var active_leaflet_layer = Renderers.get_leaflet_layer(map, active_layer, active_layer.id);

      _.each(layers, function (layer) {
        // Hide the ones which aren't active
        if (active_leaflet_layer._leaflet_id === layer._leaflet_id) {
          layer.setStyle({opacity: 100, fillOpacity: 100});
        } else {
          layer.setStyle({opacity: 0, fillOpacity: 0});
        }
      });
    }
  Renderers[layer_id] = renderer;
};
