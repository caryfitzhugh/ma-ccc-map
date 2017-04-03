Renderers.nfhl = {
  pickle: function (al) {
    delete al.legend_url;
    al.leaflet_layer_ids = [];
  },

  update_legend_url: Renderers.defaults.legend_url.constant("img\/nfhlLegend.png"),

  create_leaflet_layers: Renderers.defaults.create.esri({
            url: CDN("http://www.hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"),
            // No longer defaults to image, but JSON
            layers: [ 0, 16, 28 ],
            attribution: 'FEMA'})
};
