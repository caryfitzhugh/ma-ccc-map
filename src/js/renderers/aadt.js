/*global L, Renderers, GEOSERVER */
var aadt_color_buckets = [
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba(115, 38, 0, 255)",
    label: "20001 - 60000",
    values: [20000, 60001],
    weight: 7,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 168, 56, 0, 255)",
    label: "16001 - 20000",
    values: [16000, 20001],
    weight: 6,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 168, 112, 0, 255)",
    label: "12001 - 16000",
    values: [12000, 16001],
    weight: 5,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 255, 170, 0, 255)",
    label: "8001 - 12000",
    values: [8000, 12001],
    weight: 4,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 255, 235, 175, 255)",
    label: "4001 - 8000",
    values: [4000, 8001],
    weight: 3,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 255, 255, 115, 255)",
    label: "870 - 4000",
    values: [870, 4001],
    weight: 2,
  },
  {
    fill: "rgba(0,0,0,0)",
    stroke: "rgba( 0, 0, 0, 128)",
    label: "0 - 870",
    values: [0, 871],
    weight: 1,
  }
].reverse();

RendererTemplates.esri_feature_layer("aadt", {
  url: CDN("http://vtransmap01.aot.state.vt.us/arcgis/rest/services/Layers/AADT/FeatureServer/0"),
  update_legend: function (active_layer) {
    active_layer.parameters.aadt_color_buckets = aadt_color_buckets;
    active_layer
  },
  color_buckets: aadt_color_buckets,
  color_bucket_field: "properties.AADT",
  esri_opts: { },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
