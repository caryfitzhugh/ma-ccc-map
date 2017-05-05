/*global L, Renderers, GEOSERVER */

var vt_heat_facets = [
  {display: "Overall", property: "properties.ALL_SD"},
  {display: "Population", property: "properties.PopSD"},
  {display: "Socioeconomic", property: "properties.SES_SD"},
  {display: "Environmental", property: "properties.Env_SD"},
  {display: "Health", property: "properties.MedSD"},
  //{display: "Acclimitization"},
  //{display: "Heat Emergency", property: "properties.ED_SD},
];

// Pulled from https://ahs-vt.maps.arcgis.com/sharing/content/items/229394f2c22f4664b054fac94c210841/data?f=json
var vt_heat_vuln_buckets = [
  {
    fill: "rgba( 1, 133, 113, 255)",
    label: "< -1.5 \nLess Vulnerable",
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
    label: "> 1.5 \nMore Vulnerable",
    fill: "rgba(166, 97, 26, 255)",
    stroke:"rgba( 26, 26, 26, 128)",
  }
];

RendererTemplates.esri_feature_layer("vt_heat_vuln", {
  update_legend: function (active_layer) {
    active_layer.parameters.vt_heat_vuln_buckets = vt_heat_vuln_buckets;
    active_layer.parameters.vt_heat_facets = vt_heat_facets;
  },
  clone_layer_name: function (active_layer) {
     var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
     var name =  layer_default.name + " " + vt_heat_facets[active_layer.parameters.selected_facet_index].display;
     return name;
  },
  url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Heat_Vulnerability/FeatureServer/0/"),

  color_buckets: vt_heat_vuln_buckets,
  color_bucket_field: function (active_layer) {
    var index = active_layer.parameters.selected_facet_index;
    return vt_heat_facets[index].property;
  },

  esri_opts: { },

  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
