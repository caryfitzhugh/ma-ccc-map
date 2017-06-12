/*global L, Renderers, GEOSERVER */
RendererTemplates.esri_feature_layer_points("example_esri_feature_layer", {
  parameters: {
    opacity: false,
    color_buckets:  [
      {
        fill: "rgba(56,168,0, 200)",
        stroke: "rgba(56,168,0,255)",
        label: "0%",
        values: [0]
      },
      {
        fill:   "rgba(121,201,0,200)",
        stroke: "rgba(121,201,0,255)",
        label: "1% - 15%",
        values: [0.001, 0.15]
      },
      {
        fill:   "rgba(206,237,0,200)",
        stroke: "rgba(206,237,0,255)",
        label: "16% - 30%",
        values: [0.15, 0.30]
      },
      {
        fill:   "rgba(255,204,0,200)",
        stroke: "rgba(255,204,0,255)",
        label: "31% - 50%",
        values: [0.30, 0.50]
      },
      {
        fill:   "rgba(255,102,0, 200)",
        stroke: "rgba(255,102,0, 255)",
        label: "51% - 75%",
        values: [0.50, 0.75]
      },
      {
        fill:   "rgba(255,0,0, 200)",
        stroke: "rgba(255,0,0, 255)",
        label: "76% - 100%",
        values: [0.75, 2]
      }
    ]
  },
  color_bucket_field: "properties.Percent_Low_or_High_Alert",
  legend_template: `
    <div class='detail-block legend'>
      {{#parameters.color_buckets}}
        <div class='color-block' style="width: {{100.0 / parameters.color_buckets.length}}%;">
              <svg width="100" height="100">
                <rect height="100" width="100" style="fill: {{fill}}; stroke: {{stroke}}; opacity:1; "/>
              </svg>
              <label>{{label}}</label>
        </div>
      {{/parameters.color_buckets}}
    </div>
  `,
   esri_opts: {
     url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Cyanobacteria_2013_to_Present_Summary/FeatureServer/0"),
   },
   marker: function (active_layer, geojson, latlng, opts) {
      return L.circleMarker(latlng, _.merge(opts, { radius: 5}));
   },
   popup_content: function (active_layer, feature, layer) {
   return "<strong>" + feature.properties.Station + "</strong></br>" +
                      "Report Frequency:" + feature.properties.Report_Frequency + "<br/>" +
                      "Total Observations:" + feature.properties.Total_Routine_Observations + "<br/>"+
                      "High/Low/Safe Observations:" + feature.properties.High_Alert_Observations +
                          " / " + feature.properties.Low_Alert_Observations +
                          " / " + feature.properties.Generally_Safe_Observations +
                      "<br/>"+
                      "<br/>"+
                      Renderers.utils.zoom_to_location_link( feature.geometry );
   }

});
