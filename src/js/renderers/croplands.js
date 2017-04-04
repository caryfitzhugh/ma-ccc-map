
Renderers.croplands = {
  pickle: function (al) {
    delete al.legend_url;
    delete al.legend_url_text;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-croplands-2000&format=image/png");
    active_layer.legend_url_text = "% of cell area in crops";
  },
  create_leaflet_layers: Renderers.defaults.create.wms(
      CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"), {
                      layers: 'aglands:aglands-croplands-2000',
                      format: 'image/png',
                      opacity: 0,
                      zIndex: -1,
                      transparent: true }),
};
