/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("vt_mask", {
  update_legend: function (active_layer) {
    return CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:vt_mask&style="+active_layer.parameters.style + "&format=image/png");
  },
  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts: function (active_layer) {
        return {
          layers: 'vt:vt_mask',
          format: 'image/png',
          style: active_layer.parameters.style,
          transparent: true,
          opacity: 1,
          zIndex: 100
        };
  }
});
