RendererTemplates.wms("flood_zones_q3", {
  parameters: {
    opacity: 70,
    min_zoom: 11,
    max_zoom: 20,
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
      layers: 'massgis:GISDATA.Q3FLOOD_POLY_NO_NFHL',
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
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.Q3FLOOD_POLY_NO_NFHL&"+
          "QUERY_LAYERS=massgis:GISDATA.Q3FLOOD_POLY_NO_NFHL&"+
          "PROPERTYNAME=firm_panel,quad,zone,county,sfha&"+
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
        <img src='{{CDN("https://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.Q3FLOOD_POLY_NO_NFHL&format=image/png")}}'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        <table class='table'>
            <thead>
              <tr>
                <th> County </th>
                <th> FIRM Panel </th>
                <th> Quad </th>
                <th> Zone </th>
                <th> SFHA </th>
              </tr>
            </thead>
             <tbody>
                {{#json.features}}
                  <tr>
                    <td>{{properties.county}}</td>
                    <td>{{properties.firm_panel}}</td>
                    <td>{{properties.quad}}</td>
                    <td>{{properties.zone}}</td>
                    <td>{{properties.sfha}}</td>
                  </tr>
                {{ else }}
                  Unknown / No Response
                {{/json.features}}
              </tbody>
          </table>
      </div>
  `
});
