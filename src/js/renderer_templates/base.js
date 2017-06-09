RendererTemplates.base = function (layer_id, opts) {
  var renderer = {
    pickle: function (al) {
      delete al.legend_url;
      al.leaflet_layer_ids = [];
    },
    clone_layer_name: opts.clone_layer_name,
    parameters: opts.parameters,
    get_feature_info_xml_url: opts.get_feature_info_xml_url,
    get_feature_info_url: opts.get_feature_info_url,
  }
  return renderer;
}
