RendererTemplates.wms("extreme_heat_tract", {
  parameters: {
/*    min_zoom: 10,
    max_zoom: 20,*/
    opacity: 75,
    options: {

    }
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN(GEOSERVER + "/ma/wms/"),
  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'ma:extreme_heat_tract',
      format: "image/png",
      opacity: 0.75,
      //zIndex: 1,
      transparent: true,
    };
  },
  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;

    return CDN(GEOSERVER + "/ma/wms/") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=ma:extreme_heat_tract&"+
          "QUERY_LAYERS=ma:extreme_heat_tract&"+
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
        <img src='{{CDN("https://geoserver.nescaum-ccsc-dataservices.com/geoserver/ma/wms?request=GetLegendGraphic&LAYER=ma:extreme_heat_tract&format=image/png")}}'/>
      </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
        <i>Data summarized by MA Department of Public Health from 2010 census data.</i>
      </div>
      <div class='col-xs-10'>
        <table class='table'>
            <thead>
              <tr>
                <th> Census Tract ID</th>
                <th> % Under 5 </th>
                <th> % Under 15 </th>
                <th> % Over 65 </th> 
                <th> % Living alone </th>
                <th> % Poverty </th>
                <th> % Not White </th>
                <th> % No High School </th>
              </tr>
            </thead>
             <tbody>
                {{#json.features}}
                  <tr>
                    <td>{{properties.census_tra}}</td>
                    <td>{{properties.percu5}}</td>
                    <td>{{properties.percu15}}</td>
                    <td>{{properties.perc65}}</td>
                    <td>{{properties.percalone}}</td>
                    <td>{{properties.percpovert}}</td>
                    <td>{{properties.percnowhit}}</td>
                    <td>{{properties.percnohs}}</td>
                  </tr>
                {{ else }}
                  Unknown / No Response
                {{/json.features}}
              </tbody>
          </table>         
      </div>
  `
});
