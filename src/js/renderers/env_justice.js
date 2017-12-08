RendererTemplates.wms("env_justice", {
  parameters: {
    opacity: 70,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'massgis:GISDATA.EJ_POLY',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;
    return CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.EJ_POLY&"+
          "QUERY_LAYERS=massgis:GISDATA.EJ_POLY&"+
          "PROPERTYNAME=TOWN2,LOGSF1,PCT_NO_ENG,MED_HH_INC,PCT_MIN,PCT_LT_HS_&"+
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
        <img src='{{CDN("http://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.EJ_POLY&format=image/png")}}'/>
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
                <th> Town </th>
                <th> Census 2010<br/>Summary ID </th>
                <th> % Minority </th> 
                <th> Median household<br/>income </th>
                <th> % No high school<br/>diploma</th>
                <th> % No English </th>
              </tr>
            </thead>
             <tbody>
                {{#json.features}}
                  <tr><td>{{properties.TOWN2}}</td>
                  <td>{{properties.LOGSF1}}</td>
                  <td>{{properties.PCT_MIN}}</td>
                  <td>{{properties.MED_HH_INC}}</td>
                  <td>{{properties.PCT_LT_HS_}}</td>
                  <td>{{properties.PCT_NO_ENG}}</td> </tr>
                {{ else }}
                  Unknown / No Response
                {{/json.features}}
              </tbody>
          </table>           
      </div>
  `
});
