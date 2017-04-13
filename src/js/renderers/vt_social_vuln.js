/*global L, Renderers, GEOSERVER */

// Pulled from: https://ahs-vt.maps.arcgis.com/sharing/content/items/a070f5843dba4c1ea9bbdcd7d4e6c474/data?f=json
// .operationalLayers["0"].layerDefinition.drawingInfo.renderer.classBreakInfos
var vt_social_color_buckets = [
  {symbol: {color: [255, 255, 204, 255],…}, label: "0", classMaxValue: 0},
  {symbol: {color: [199, 233, 180, 255],…}, label: "1", classMaxValue: 1},
  {symbol: {color: [127, 205, 187, 255],…}, label: "2", classMaxValue: 2},
  {symbol: {color: [65, 182, 196, 255],…}, label: "3", classMaxValue: 3},
  {symbol: {color: [44, 127, 184, 255],…}, label: "4 - 5", classMaxValue: 5},
  {symbol: {color: [37, 52, 148, 255],…}, label: "6 - 10", classMaxValue: 10},
];

RendererTemplates.esri_feature_layer("vt_social_vuln", {
  update_legend: null, //CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:county_boundary&format=image/png"),

  url: CDN ("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/SVI_New/FeatureServer/0"),
            //GEOSERVER + "/vt/wms/"),
  esri_opts: {
    onEachFeature: function (feature, layer) {

      console.log("NEED TO COLOR ME!", feature, layer);
    },
  },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
