/*global _ , Controllers, Renderers */
Controllers.FeatureInfo = {
  /*
  containerPoint: o.Point
    x: 194
    y: 274
  latlng: o.LatLng
     lat: 43.874138181474734
     lng: -78.0908203125
  layerPoint: o.Point
    x: 194
    y: 274
  __proto__: Object
  originalEvent: MouseEvent
  target: o.Class.extend.e
  type: "click"
   */
  get_gfi_url: function (templ, evt, map) {
    var args = {
        xmin: map.getBounds().getWest(),
        xmax: map.getBounds().getEast(),
        ymin: map.getBounds().getSouth(),
        ymax: map.getBounds().getNorth(),
        bbox: _.map([map.getBounds().getWest(),
                     map.getBounds().getSouth(),
                     map.getBounds().getEast(),
                     map.getBounds().getNorth()],
                  function (bound) { return bound.toFixed(6); }).join(","),
        width: map.getSize().x,
        height: map.getSize().y,
        lat: evt.latlng.lat,
        lng: evt.latlng.lng,
        x: Math.round(map.layerPointToContainerPoint(evt.layerPoint).x),
        y: Math.round(map.layerPointToContainerPoint(evt.layerPoint).y)
      };

    return _.template(templ)(args);
  },
  are_feature_info_layers_active: function (active_layers) {
    return _.filter(active_layers, function (active_layer) {
      var renderer = Renderers[active_layer.renderer_id];
      return renderer.get_feature_info_url;
    }).length > 0;
  },
  layer_has_click_info: (active_layer) => {
    if (active_layer) {
      let renderer = Renderers[active_layer.renderer_id];
      if (renderer) {
        return !!(
          Renderers[active_layer.renderer_id].find_geo_json ||
          Renderers[active_layer.renderer_id].get_feature_info_xml_url ||
          Renderers[active_layer.renderer_id].get_feature_info_url
        );
      }
    }
    return false;
  },
  get_details: function (cp, evt) {
    // We want to look up these locations.
    // Find the active layers.
    var active_layers = cp.get("layers.active");
    var map = cp.get("map");

    var layers_with_gfi = _.filter(active_layers, function (layer) {
        // Don't return GFI queries if the layer is hidden
        return !layer.is_hidden && Controllers.FeatureInfo.layer_has_click_info(layer);
      });

    if (layers_with_gfi.length > 0) {
      cp.set("map_details.feature_info_responses", {})
      cp.set("map_details.feature_info_requests", []);
      cp.set("map_details.location", evt.latlng);

      _.each(layers_with_gfi,
        function (active_layer) {
          var renderer = Renderers[active_layer.renderer_id];
          var current = _.cloneDeep(cp.get("map_details.feature_info_requests"));
          var response_id = active_layer.id + "-" + Date.now();

          current.push({name: active_layer.name,
                        active_layer: active_layer,
                        response_id: response_id})
          cp.set("map_details.feature_info_requests", _.sortBy(current, "name"));

          if (renderer.get_feature_info_url) {
            var url_template = renderer.get_feature_info_url(active_layer);
            var url = Controllers.FeatureInfo.get_gfi_url(url_template, evt, map);

            $.ajax(url, {
                dataType: 'json',
                success: function (resp) {
                  if (cp.get("map_details.location") === evt.latlng) {
                    cp.set("map_details.feature_info_responses."+response_id, {
                      active_layer: active_layer,
                      json: resp});
                  }
                },
                error: function (error) {
                  if (cp.get("map_details.location") === evt.latlng) {
                    cp.set("map_details.feature_info_responses."+response_id, {
                      active_layer: active_layer,
                      error: error.responseText});
                  }
                }
              });

          } else if (renderer.get_feature_info_xml_url) {
            var url_template = renderer.get_feature_info_xml_url(active_layer);
            var url = Controllers.FeatureInfo.get_gfi_url(url_template, evt, map);
            $.ajax(url, {
              dataType: "xml",
              success: function (resp) {
                if (cp.get("map_details.location") === evt.latlng) {
                  cp.set("map_details.feature_info_responses."+response_id, {
                    active_layer: active_layer,
                    xml: resp});
                }
              },
              error: function (error) {
                if (cp.get("map_details.location") === evt.latlng) {
                  cp.set("map_details.feature_info_responses."+response_id, {
                    active_layer: active_layer,
                    error: error.responseText});
                }
              }
            });
          } else if (renderer.find_geo_json) {
            var resp = renderer.find_geo_json(map, active_layer, evt);
              cp.set("map_details.feature_info_responses."+response_id, {
              active_layer: active_layer,
              geojson: resp});
          }
        });
    }
  }
};
