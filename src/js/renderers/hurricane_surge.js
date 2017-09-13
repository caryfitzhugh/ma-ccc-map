/*global _, Renderers, L */
RendererTemplates.esri("hurricane_surge", {
  parameters: {
    min_zoom: 10,
    max_zoom: 20,
    opacity: 85,
    options: {

    }
  },
  legend_template: `
    <div class='detail-block show-confidence'>
    <div class='detail-block legend taccimo '>
      <label> Legend </label>
      <img  src="img/hurricane_surge.png">
    </div>
  `,
  clone_layer_name: function (active_layer) {

    return active_layer.name + " copy";
  },
  esri_opts: function (active_layer) {

    return {
      url: CDN("https://tiles4.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/Hurr_Surge_Inun_Zones/MapServer"),
      layers: [ 0 ],
      attribution: 'unkn',
      f:"image"
    };
  },
});
