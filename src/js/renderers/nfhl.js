/*global _, Renderers, L */
RendererTemplates.esri("nfhl", {
  parameters: {
    opacity: 85,
    options: {
      
    }    
  },
  legend_template: `
    <div class='detail-block show-confidence'>
    <div class='detail-block legend taccimo '>
      <label> Legend </label>
      <img  src="img/nfhlLegend.png">
    </div>
  `,
  clone_layer_name: function (active_layer) {

    return active_layer.name + " copy";
  },
  esri_opts: function (active_layer) {

    return {
      url: CDN("http://www.hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer"),
      layers: [ 0, 16, 28 ],
      attribution: 'FEMA',
      f:"image",
      clickable: false
    };
  },
});
