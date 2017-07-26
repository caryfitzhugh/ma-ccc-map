RendererTemplates.wms("biomap_core", {
  parameters: {
    opacity: 70,
    layer: "BM2_CH_FOREST_CORE",
    options: {
      layer: {
        'BM2_CH_FOREST_CORE': "Forest",
        'BM2_CH_BIOMAP2_WETLANDS': "Wetlands",
        'BM2_CH_AQUATIC_CORE': "Aquatic",
        'BM2_CRITICAL_NATURAL_LANDSCAPE': "Natural Landscape",
        'BM2_CORE_HABITAT': "Habitat"
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
      </div>
       <img src='{{CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.{{parameters.options.layer.value}}&format=image/png")}}'/>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            No additional information for this layer.
          </div>
        {{/json.features}}
      </div>
  `
});
