RendererTemplates.wms("wellhead_protection", {
  parameters: {
    opacity: 90,
    layer: "IWPA_POLY",
    options: {
      layer: {
        'IWPA_POLY': "IWPA",
        'ZONE1_POLY': "Zone 1",
        'ZONE2_POLY': "Zone 2"
      }
    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name + " Layer:" + active_layer.parameters.layer;
  },
  url: CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms"),
  wms_opts:(active_layer) => {
    var layer = active_layer.parameters.layer;
    return  {
      layers: 'massgis:GISDATA.'+layer,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    var layer = active_layer.parameters.layer;

    return CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA."+layer+"&"+
          "QUERY_LAYERS=massgis:GISDATA."+layer+"&"+
          "PROPERTYNAME=SUPPLIER,PWS_ID&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG%3A4326&"+
          "X=<%= x %>&Y=<%= y %>";
  },
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Variable: </label>
        <select value='{{parameters.layer}}'>
        {{#u.to_sorted_values_from_hash(parameters.options.layer)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.options.layer)}}
        </select>
        <img src='http://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.{{parameters.layer}}&format=image/png'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            {{properties.SUPPLIER}}; PWS ID {{properties.PWS_ID}}
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `
});
