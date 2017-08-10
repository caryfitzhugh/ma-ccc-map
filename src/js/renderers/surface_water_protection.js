RendererTemplates.wms("surface_water_protection", {
  parameters: {
    opacity: 90,
    style: "GISDATA.SWP_ZONES_POLY::Zone_A",
    options: {
      style: {
        'GISDATA.SWP_ZONES_POLY::Zone_A': "Zone A",
        'GISDATA.SWP_ZONES_POLY::Zone_B': "Zone B",
        'GISDATA.SWP_ZONES_POLY::Zone_C': "Zone C"
      }
    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name + " Layer:" + active_layer.parameters.style;
  },
  url: CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms"),
  wms_opts:(active_layer) => {
    var layer = active_layer.parameters.style;
    return  {
      layers: 'massgis:GISDATA.SWP_ZONES_POLY',
      styles: layer,
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    var layer = active_layer.parameters.style;

    return CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.SWP_ZONES_POLY&"+
          "QUERY_LAYERS=massgis:GISDATA.SWP_ZONES_POLY&"+
          "STYLES=" + layer + "&" +
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
        <select value='{{parameters.style}}'>
        {{#u.to_sorted_values_from_hash(parameters.options.style)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.options.style)}}
        </select>
      </div>
       <img src='{{CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=" + encodeURIComponent("massgis:GISDATA.SWP_ZONES_POLY") + "&style=" + encodeURIComponent(parameters.style) + "&format=image/png")}}'/>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            {{properties.SUPPLIER}} {{properties.SITENAME}}
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `
});
