/*global L, Renderers, GEOSERVER */

var vt_social_vuln_facets = [
  {display: "Overall Index",property: "properties.SVI_16"},
  {display: "Socioeconomic Theme",property: "properties.SES_SVI"},
  {display: "Demographic Theme",property: "properties.Demo_SVI"},
  {display: "Housing/Transportation Theme",property: "properties.H_T_SVI"},
];

// Pulled from: https://ahs-vt.maps.arcgis.com/sharing/content/items/a070f5843dba4c1ea9bbdcd7d4e6c474/data?f=json
// .operationalLayers["0"].layerDefinition.drawingInfo.renderer.classBreakInfos
var vt_social_color_buckets = [
  {
    fill: "rgba( 255, 255, 204, 255 )",
    stroke: "rgba(26, 26, 26, 128)",
    label: "0",
    values: [0],
  },
  {
    fill: "rgba( 199, 233, 180, 255 )",
    stroke: "rgba( 26, 26, 26, 128 )",
    label: "1",
    values: [1],
  },
  { fill: "rgba(127, 205, 187, 255 )",
    stroke: "rgba( 26, 26, 26, 128 )",
    label: "2",
    values: [2],
  },
  {
    fill: "rgba(65, 182, 196, 255)",
    stroke: "rgba(26, 26, 26, 128)",
    label: "3",
    values: [3],
  },
  {
    fill: "rgba(44, 127, 184, 255)",
    stroke: "rgba( 26, 26, 26, 128)",
    label: "4 - 5",
    values: [4,5.1],
  },
  {
    fill: "rgba( 37, 52, 148, 255)",
    stroke: "rgba(26, 26, 26, 128)",
    label: "6 - 10",
    values: [6,10],
  }
];

RendererTemplates.esri_feature_layer("vt_social_vuln", {
  url: CDN ("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/SVI_New/FeatureServer/0"),

  update_legend: function (active_layer) {
    active_layer.parameters.vt_social_color_buckets = vt_social_color_buckets;
    active_layer.parameters.vt_social_vuln_facets = vt_social_vuln_facets;
  },
  color_buckets: vt_social_color_buckets,
  color_bucket_field: function (active_layer) {
    // Depending on the parameters...
    var index = active_layer.parameters.facet_index;
    return vt_social_vuln_facets[index].property;
  },

  esri_opts: {
  },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
