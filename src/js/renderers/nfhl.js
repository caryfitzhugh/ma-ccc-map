RendererTemplates.esri('nfhl',{
  update_legend: "img\/nfhlLegend.png",

  esri_opts: {
    url: CDN("http://www.hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"),
    // No longer defaults to image, but JSON
    layers: [ 0, 16, 28 ],
    attribution: 'FEMA'
  }
});
