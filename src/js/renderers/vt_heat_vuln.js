/*global L, Renderers, GEOSERVER */

// Pulled from https://ahs-vt.maps.arcgis.com/sharing/content/items/229394f2c22f4664b054fac94c210841/data?f=json
var vt_heat_vuln_buckets = [
  {
    fill: "rgba( 1, 133, 113, 255)",
    label: "< -1.5",
    stroke: "rgba( 26, 26, 26, 128)",
    values: [-1000, -0.5844],
  },
  {
    fill: "rgba( 128, 205, 193, 255)",
    stroke: "rgba( 26, 26, 26, 128)",
    label: "-1.5 - -0.5",
    values: [-0.5844,-0.2336],
  },
  {
    label: "-0.5 - 0.5",
    values: [-0.2336, 0.1171],
    fill: "rgba( 245, 245, 245, 255)",
    stroke: "rgba( 26, 26, 26, 128)",
  },
  {
    values: [0.1171, 0.4679],
    label: "0.5 - 1.5",
    fill: "rgba( 223, 194, 125, 255)",
    stroke: "rgba( 26, 26, 26, 128)",
  },
  {
    values: [0.4679, 1.5059900283813477],
    label: "> 1.5",
    fill: "rgba(166, 97, 26, 255)",
    stroke:"rgba( 26, 26, 26, 128)",
  }
];

RendererTemplates.esri_feature_layer("vt_heat_vuln", {
  update_legend: function (active_layer) {
    active_layer.parameters.vt_heat_vuln_buckets = vt_heat_vuln_buckets;
  },

  url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Heat_Vulnerability/FeatureServer/0/"),

  color_buckets: vt_heat_vuln_buckets,
  color_bucket_field: "properties.ALL_SD",

  esri_opts: { },

  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
