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
  get_details: function (cp, evt) {
    // We want to look up these locations.
    // Find the active layers.
    var active_layers = cp.get("layers.active");
    var map = cp.get("map");

    var layers_with_gfi = _.filter(active_layers, function (layer) {
        var renderer = Renderers[layer.renderer_id];
        // Don't return GFI queries if the layer is hidden
        return !layer.is_hidden &&
          (renderer.get_feature_info_url || renderer.find_geo_json ||
            renderer.get_feature_info_xml_url);
      });

    if (layers_with_gfi.length > 0) {
      cp.set("map_details.feature_info_responses", []);
      cp.set("map_details.location", evt.latlng);

      _.each(layers_with_gfi,
        function (active_layer) {
          var renderer = Renderers[active_layer.renderer_id];

          if (renderer.get_feature_info_url) {
            var url_template = renderer.get_feature_info_url(active_layer);
            var url = Controllers.FeatureInfo.get_gfi_url(url_template, evt, map);

            $.getJSON(url, {}, function (resp) {
              if (cp.get("map_details.location") === evt.latlng) {
                var current = _.cloneDeep(cp.get("map_details.feature_info_responses"));
                current.push({name: active_layer.name, renderer_id: active_layer.renderer_id, json: resp});
                cp.set("map_details.feature_info_responses", _.sortBy(current, "name"));
              }
            });
          } else if (renderer.get_feature_info_xml_url) {
            var url_template = renderer.get_feature_info_xml_url(active_layer);
            var url = Controllers.FeatureInfo.get_gfi_url(url_template, evt, map);
            $.ajax(url, {
              dataType: "xml",
              success: function (resp) {
                if (cp.get("map_details.location") === evt.latlng) {
                  var current = _.cloneDeep(cp.get("map_details.feature_info_responses"));
                  current.push({name: active_layer.name, renderer_id: active_layer.renderer_id, xml: resp});
                  cp.set("map_details.feature_info_responses", _.sortBy(current, "name"));
                }
              }
            });
          } else if (renderer.find_geo_json) {
            var response = renderer.find_geo_json(map, active_layer, evt);
            if (response) {
              var current = _.cloneDeep(cp.get("map_details.feature_info_responses"));
              current.push({name: active_layer.name, renderer_id: active_layer.renderer_id, json: response});
              cp.set("map_details.feature_info_responses", _.sortBy(current, "name"));
            }
          }
        });
    }
  }
};
