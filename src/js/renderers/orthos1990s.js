/*global _, Renderers, L */
/*global _, Renderers, L */
RendererTemplates.esri("orthos1990s", {
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
      url: CDN("http://tiles.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/BW_Orthos_Tile_Package/MapServer"),
      layers: [ 0 ],
      attribution: 'FEMA',
      f:"image",
      clickable: false
    };
  },
});

