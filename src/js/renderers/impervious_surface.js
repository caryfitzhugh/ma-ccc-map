RendererTemplates.wms("impervious_surface", {
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
      layers: 'mrlc_display:NLCD_2016_Impervious_L48',
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
          "REQUEST=GetFeatureInfo&LAYERS=mrlc_display:NLCD_2016_Impervious_L48&"+
          "QUERY_LAYERS=mrlc_display:NLCD_2016_Impervious_L48&"+
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
        <img src='{{CDN("https://www.mrlc.gov/geoserver/wms?request=GetLegendGraphic&LAYER=mrlc_display:NLCD_2016_Impervious_L48&format=image/png")}}'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            Percent Impervious: {{properties.PALETTE_INDEX}}
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `
});
