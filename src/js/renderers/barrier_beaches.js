RendererTemplates.wms("barrier_beaches", {

  parameters: {
    //min_zoom: 10,
    //max_zoom: 20,
    opacity: 100,
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
      layers: 'ma:barrier_beaches',
      format: "image/png",
      opacity: 0,
      //zIndex: 1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;

    return CDN(GEOSERVER + "/ma/wms/") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ma:barrier_beaches&"+
          "QUERY_LAYERS=ma:barrier_beaches&"+
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
        <img src='{{CDN("https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/wms?request=GetLegendGraphic&LAYER=ma:barrier_beaches&format=image/png")}}'/> Barrier Beaches
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
            Beach Name: {{properties.bbname}} (ID={{properties.bbpolyid}})
          </div>
        {{/json.features}}
      </div>
    {{/if json.features}}
  `
});
