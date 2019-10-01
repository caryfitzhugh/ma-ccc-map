RendererTemplates.wms("police_stations", {
  parameters: {
    opacity: 100,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN("https://giswebservices.massgis.state.ma.us/geoserver/wms"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'massgis:GISDATA.POLICESTATIONS_PT_MEMA',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;
    return CDN("https://giswebservices.massgis.state.ma.us/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.POLICESTATIONS_PT_MEMA&"+
          "QUERY_LAYERS=massgis:GISDATA.POLICESTATIONS_PT_MEMA&"+
          "PROPERTYNAME=name,address,city,state&"+
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
        <img src='{{CDN("https://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.POLICESTATIONS_PT_MEMA&format=image/png")}}'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            {{properties.name}}<br>
            {{properties.address}}, {{properties.city}}, {{properties.state}}
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `
});
