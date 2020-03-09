RendererTemplates.wms("nlcd", {
  parameters: {
    opacity: 70,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN("https://www.mrlc.gov/geoserver/wms?"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'mrlc_display:NLCD_2016_Land_Cover_L48',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;
    return CDN("https://www.mrlc.gov/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=mrlc_display:NLCD_2016_Land_Cover_L48&"+
          "QUERY_LAYERS=mrlc_display:NLCD_2016_Land_Cover_L48&"+
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
        <img src='img/nlcd_legend.gif'/>
      </div>
  `,
  info_template: `
    {{#if json.features}}
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            Land cover class: {{properties.PALETTE_INDEX}}
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
    {{/if json.features}}
  `
});
