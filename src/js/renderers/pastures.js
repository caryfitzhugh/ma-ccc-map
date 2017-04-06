RendererTemplates.wms("pastures", {
  update_legend: {
    url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=aglands:aglands-pastures-2000&format=image/png"),
    text: "% cell area in pasture",
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts: {
    layers: 'aglands:aglands-pastures-2000',
    format: 'image/png',
    opacity: 0,
    zIndex: -1,
    transparent: true },
});
