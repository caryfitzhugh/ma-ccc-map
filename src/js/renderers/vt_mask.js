/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("vt_mask", {
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:vt_mask&style=vt_mask_black&format=image/png"),
  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts:
        {
          layers: 'vt:vt_mask',
          format: 'image/png',
          style: 'vt_mask_black',
          transparent: true,
          opacity: 1,
          zIndex: 100
        }
});
