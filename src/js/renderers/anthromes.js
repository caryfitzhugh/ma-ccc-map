RendererTemplates.wms("anthromes", {
  parameters: {
    opacity: 70,
    year: 2000,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name + " Year:" + active_layer.parameters.year;
  },
  url: CDN("http://sedac.ciesin.columbia.edu/geoserver/wms"),
  wms_opts:(active_layer) => {
    var year = active_layer.parameters.year;
    return  {
      layers: 'anthromes:anthromes-anthropogenic-biomes-world-v2-'+year,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    var year = active_layer.parameters.year;

    return CDN("http://sedac.ciesin.columbia.edu/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=anthromes:anthromes-anthropogenic-biomes-world-v2-"+year+"&"+
          "QUERY_LAYERS=anthromes:anthromes-anthropogenic-biomes-world-v2-"+year+"&"+
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
        <label> Model Year: </label>
        <input type="radio" name='{{parameters.year}}' value="1800"> 1800
        <input type="radio" name='{{parameters.year}}' value="1900"> 1900
        <input type="radio" name='{{parameters.year}}' value="2000"> 2000
        <img src='{{CDN("http://sedac.ciesin.columbia.edu/geoserver/wms?request=GetLegendGraphic&LAYER=anthromes:anthromes-anthropogenic-biomes-world-v2-1700&format=image/png")}}'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            Value: {{properties.GRAY_INDEX}}
          </div>
        {{/json.features}}
      </div>
  `
});
