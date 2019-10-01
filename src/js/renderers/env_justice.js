RendererTemplates.wms("env_justice", {
  parameters: {
    opacity: 70,
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
      layers: 'massgis:GISDATA.EJ_POLY',
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
          "REQUEST=GetFeatureInfo&LAYERS=massgis:GISDATA.EJ_POLY&"+
          "QUERY_LAYERS=massgis:GISDATA.EJ_POLY&"+
          "PROPERTYNAME=town2,logsf1,pct_no_eng,med_hh_inc,pct_min,pct_lt_hs_&"+
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
        <img src='{{CDN("https://giswebservices.massgis.state.ma.us/geoserver/wms?request=GetLegendGraphic&LAYER=massgis:GISDATA.EJ_POLY&format=image/png")}}'/>
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
                  <tr><td>{{properties.town2}}</td>
                  <td>{{properties.logsf1}}</td>
                  <td>{{properties.pct_min}}</td>
                  <td>{{properties.med_hh_inc}}</td>
                  <td>{{properties.pct_lt_hs_}}</td>
                  <td>{{properties.pct_no_eng}}</td> </tr>
                {{ else }}
                  Unknown / No Response
                {{/json.features}}
              </tbody>
          </table>
      </div>
  `
});
