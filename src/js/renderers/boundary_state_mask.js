RendererTemplates.wms("boundary_state_mask", {
  parameters: {
    opacity: 70,
    style: "black",
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN(GEOSERVER + "/ma/wms/"),
  wms_opts:(active_layer) => {
    var style = 'state_mask_' +active_layer.parameters.style;
    return  {
      layers: 'ma:state_mask',
      format: "image/png",
      styles: style,
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <img src='${CDN(GEOSERVER)}/ma/wms?request=GetLegendGraphic&LAYER=ma:state_mask&style=state_mask_{{parameters.style}}&format=image/png'/> State Mask
        <div class='detail-block show-confidence'>
          <label decorator='tooltip:Choose a color'> Color: </label>
          <select value='{{parameters.style}}'>         
              <option value='black'>Black</option>
              <option value='white'>White</option>
          </select>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            {{properties.name}} Watershed
          </div>
        {{/json.features}}
      </div>
  `
});
