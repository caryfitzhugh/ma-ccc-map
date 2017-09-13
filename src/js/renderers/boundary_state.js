RendererTemplates.wms("boundary_state", {
  parameters: {
    opacity: 70,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN(GEOSERVER + "/ma/wms/"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'ma:state_boundary',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;

    return CDN(GEOSERVER + "/ma/wms/")  +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ma:state_boundary&"+
          "QUERY_LAYERS=ma:state_boundary&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG:4326&"+
          "X=<%= x %>&Y=<%= y %>";
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <img src='${CDN(GEOSERVER)}/ma/wms?request=GetLegendGraphic&LAYER=ma:state_boundary&format=image/png'/> State Boundary
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            State of Massachussetts
          </div>
        {{/json.features}}
      </div>
  `
});
