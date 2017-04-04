Renderers.cfem_critical = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },
  update_legend_url: function (active_layer) {
    active_layer.legend_url = CDN("img\/hazus_critical.png");
  },
  create_leaflet_layers:Renderers.defaults.create.wms(CDN("https://coast.noaa.gov/arcgis/services/FloodExposureMapper/CFEM_CriticalFacilities/MapServer/WmsServer?"), {
        layers: 0,
        format: 'image%/png',
        transparent: true,
        opacity: 0,
        zIndex: -1
      }),
};
