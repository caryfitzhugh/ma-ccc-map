/*global L, Renderers, GEOSERVER */

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
    values: [4,5],
  },
  {
    fill: "rgba( 37, 52, 148, 255)",
    stroke: "rgba(26, 26, 26, 128)",
    label: "6 - 10",
    values: [6,7,8,9,10],
  }
];

RendererTemplates.esri_feature_layer("vt_social_vuln", {
  update_legend: function (active_layer) {
    active_layer.parameters.vt_social_color_buckets = vt_social_color_buckets;
  },

  url: CDN ("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/SVI_New/FeatureServer/0"),
  setStyle: function (opacity, feature) {
    var bucket = _.find(vt_social_color_buckets, function (v) { return _.contains(v.values, feature.properties.SVI_16); });
    return { stroke: true, color: bucket.stroke,
            opacity: opacity,
            fillOpacity: opacity,
            weight: 1,
            fill: true,
            fillColor: bucket.fill,
            clickable: false};
  },

  esri_opts: {
  },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
