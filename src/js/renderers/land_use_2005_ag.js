RendererTemplates.wms("land_use_2005_ag", {

  parameters: {
    min_zoom: 10,
    max_zoom: 20,
    opacity: 100,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: "http://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/wms/",
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'ma:landuse_2005_ag',
      format: "image/png",
      opacity: 0,
      //zIndex: 1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;

    return "http://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/wms/" +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ma:landuse_2005_ag&"+
          "QUERY_LAYERS=ma:landuse_2005_ag&"+
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
        <img src='{{CDN("http://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/wms?request=GetLegendGraphic&LAYER=ma:landuse_2005_ag&format=image/png")}}'/> 
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            Land Use: {{properties.lu05_desc}} 
          </div>
        {{/json.features}}
      </div>
  `
});
