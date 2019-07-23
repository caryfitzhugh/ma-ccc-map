RendererTemplates.wms("vaw_towns", {
  parameters: {
    opacity: 100,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN(GEOSERVER + "/ma/wms/"),
  wms_opts:(active_layer) => {
    var town = active_layer.parameters.town.toUpperCase();
    return  {
      layers: 'ma:towns',
      cql_filter: "town='" + town + "'",
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    var town = active_layer.parameters.town.toUpperCase();
    return CDN(GEOSERVER + "/ma/wms/")  +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ma:towns&"+
          "QUERY_LAYERS=ma:towns&"+
          "CQL_FILTER=town='" + town + "'&"+
          "STYLES=vaw_highlight&"+
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
        <img src='${CDN(GEOSERVER)}/ma/wms?request=GetLegendGraphic&LAYER=ma:towns&styles=vaw_highlight&format=image/png'/> State Boundary
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> Vulnerability for {{properties.town}} </label>
        <i>Data summarized by MA Department of Public Health from 2010 census data.</i>
      </div>
      <div class='col-xs-10'>
        2010 Population: {{properties.pop2010}}
      </div>
  `

});
