RendererTemplates.wms("nlcd", {
  parameters: {
    opacity: 70,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN("https://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 33,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  /*get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;
    return CDN("https://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer/") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=33&"+
          "QUERY_LAYERS=33&"+
          "STYLES=&"+
          "BBOX=<%= bbox %>&"+
          "FEATURE_COUNT=5&"+
          "HEIGHT=<%= height %>&"+
          "WIDTH=<%= width %>&"+
          "FORMAT=text%2Fhtml&"+
          "INFO_FORMAT=application%2Fjson&"+
          "SRS=EPSG:4326&"+
          "X=<%= x %>&Y=<%= y %>";
  },*/
  legend_template: `
      <div class='detail-block show-confidence'>
        <label> Legend: </label>
        <img src='{{CDN("https://raster.nationalmap.gov/arcgis/services/LandCover/USGS_EROS_LandCover_NLCD/MapServer/WmsServer?TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=1&FORMAT=image/gif&SCALE=55467893.20400156")}}'/>
      </div>
  `,
  /*info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            No additional information for this layer.
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `*/
});
