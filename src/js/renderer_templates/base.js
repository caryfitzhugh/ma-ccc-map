RendererTemplates.base = function (layer_id, opts, impl) {
  var renderer = Object.assign({},
    {
      pickle: function (al) {
        delete al.legend_url;
        al.leaflet_layer_ids = [];
      },
      clone_layer_name: opts.clone_layer_name,
      parameters: opts.parameters,
      get_feature_info_xml_url: opts.get_feature_info_xml_url,
      get_feature_info_url: opts.get_feature_info_url,
    },
    opts,
    impl);

  renderer.render = (map, active_layer, z_index) => {
    Renderers.update_templates(active_layer, opts);
    impl.render(map, active_layer, z_index);
  }
  return renderer;
}
