RendererTemplates.wms("impervious_surface", {
  parameters: {
    opacity: 70,
    options: {

    },
    color_buckets: [

    ]
  },
  clone_layer_name: function(active_layer) {
    return active_layer.name;
  },
  url: CDN("https://www.mrlc.gov/geoserver/wms?"),

  wms_opts:(active_layer) => {
    //var year = active_layer.parameters.year;
    return  {
      layers: 'mrlc_display:NLCD_2016_Impervious_L48',
      format: "image/png",
      opacity: 0,
      zIndex: -1,
      transparent: true,
    };
  },

  on_load: (active_layer) => {
    let durl = CDN("https://www.mrlc.gov/geoserver/wms?request=GetLegendGraphic&LAYER=mrlc_display:NLCD_2016_Impervious_L48&format=application/json");
    if (active_layer.parameters.loaded_legend) {
      return;
    }

    active_layer.parameters.loaded_legend = true;

    $.ajax({
      cache: true,
      dataType: "json",
      url: durl,
      success: function (json) {
        let buckets = json.Legend[0].rules[0].symbolizers[0].Raster.colormap.entries;
        active_layer.parameters.color_buckets = [];
        for (let i=0; i < buckets.length; i += Math.floor((buckets.length - 1) / 8)) {
          active_layer.parameters.color_buckets.push(buckets[i]);
        }
        Views.ControlPanel.fire("tile-layer-loaded", active_layer, true);
      },
      error:   function (err) {
        Views.ControlPanel.fire("tile-layer-loading-error", active_layer);
      }
    });
  },

  get_feature_info_url: function (active_layer) {
    //var year = active_layer.parameters.year;
    return CDN("https://www.mrlc.gov/geoserver/wms") +
          "?SERVICE=WMS&VERSION=1.1.1&"+
          "REQUEST=GetFeatureInfo&LAYERS=mrlc_display:NLCD_2016_Impervious_L48&"+
          "QUERY_LAYERS=mrlc_display:NLCD_2016_Impervious_L48&"+
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
    <div class='detail-block legend'>
      <div class='color-legend '>% Impervious</div>
      {{#parameters.color_buckets}}
        <div class='color-block' style="width: {{100.0 / parameters.color_buckets.length}}%;">
              <svg width="100" height="100">
                <rect height="100" width="100" style="fill: {{color}}; stroke: {{color}}; opacity:{{opacity}}; "/>
              </svg>
              <label>{{label}}</label>
        </div>
      {{/parameters.color_buckets}}
    </div>
  `,
  info_template: `
      <div class='col-xs-2'>
        <label> {{name}} </label>
      </div>
      <div class='col-xs-10'>
        {{#json.features}}
          <div>
            <h3>{{properties.PALETTE_INDEX}}% Impervious</h3> at {{geometry}}: .  Impervious surfaces increase temperatures and impede drainage.  Surface temperatures can rise by <a href="322066994_Urban_Imperviousness_Effects_on_Summer_Surface_Temperatures_Nearby_Residential_Buildings_in_Different_Urban_Zones_of_Parma" target="blank_">up to 1.8°F</a> for every 20% increase in imperviousness.    
          </div>
        {{ else }}
          Unknown / No Response
        {{/json.features}}
      </div>
  `
});
