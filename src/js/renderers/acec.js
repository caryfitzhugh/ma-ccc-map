RendererTemplates.wms("acec", {

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
  url: "http://giswebservices.massgis.state.ma.us/geoserver/wms/",
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'massgis:GISDATA.ACECS_POLY',
      format: "image/png",
      opacity: 0,
      //zIndex: 1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;

    return "http://giswebservices.massgis.state.ma.us/geoserver/wms/" +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.ACECS_POLY&"+
          "QUERY_LAYERS=massgis:GISDATA.ACECS_POLY&"+
          "PROPERTYNAME=name,acec_acres&"+
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
        <img src='{{CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.ACECS_POLY&format=image/png")}}'/> Areas of Concern
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            {{properties.name}} ({{properties.acec_acres}} acres)
          </div>
        {{/json.features}}
      </div>
  `
});
