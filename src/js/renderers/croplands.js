
RendererTemplates.wms("croplands", {
  update_legend: {
    url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-croplands-2000&format=image/png"),
    text: "% of cell area in crops",
  },

  url:  CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts: {
    layers: 'aglands:aglands-croplands-2000',
    format: 'image/png',
    opacity: 0,
    zIndex: -1,
    transparent: true },
});
