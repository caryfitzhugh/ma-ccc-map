Renderers.ny_mask = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
  },
  render_data: function (map, geometries) {
    //take care of projections
    var path = d3.geo.path().projection(function (x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
        return [point.x, point.y];
      });

    // Draw gemoetries (with COLOR!)
    var new_layer = L.d3SvgOverlay(function (sel, proj) {
      sel.selectAll('.ny-mask')
        .data(geometries.features)
        .enter()
        .append('path')
        .attr("class", "ny-mask")
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', "black")
        .attr("data-lat-lng-path", function (d) {
          return JSON.stringify(d.geometry);
        })
        .attr("d", path);
    });

    return new_layer;
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = null;
  },
  create_leaflet_layers: function (map, active_layer) {
    if (_.isEmpty(active_layer.leaflet_layer_ids)) {
      active_layer.leaflet_layer_ids = ['loading-so-we-avoid-race-conditions'];
      $.ajax({
        cache: true,
        dataType: "json",
        url: CDN("http://52.2.5.122:8080/geoserver/www/ny_mask.topojson"),
        success: function (data) {
          var geojson_mask = topojson.feature(data, data.objects.ny_mask);
          var mask = Renderers.ny_mask.render_data(map, geojson_mask);
          mask.addTo(map);

          active_layer.leaflet_layer_ids = [mask._leaflet_id];
          Views.ControlPanel.fire("tile-layer-loaded", active_layer);
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
    Renderers.ny_mask.create_leaflet_layers(map, active_layer);
    Renderers.ny_mask.update_legend_url(active_layer);

    var leaflet_ids = active_layer.leaflet_layer_ids;
    var layers = Renderers.lookup_layers(map, leaflet_ids);
    _.each(layers, function (layer) {
      var opacity = (active_layer.is_hidden ? 0 : active_layer.parameters.opacity) / 100.0;
      layer.setOpacity(opacity);
      layer.setZIndex(active_layer.parameters.fixed_z_index);
      // Set the color
      layer._svg.selectAll('.ny-mask').attr('fill',active_layer.parameters.color);
      layer._svg.selectAll('.ny-mask').attr('stroke',active_layer.parameters.color);
    });
  }
};
