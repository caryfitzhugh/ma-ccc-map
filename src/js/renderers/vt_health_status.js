/*global L, Renderers, GEOSERVER */
var vt_health_status_facets = [
  {display: "Comparison to State 2000-2002",property: "properties.Comparison_to_State_2000_2002"},
  {display: "Comparison to State 2001-2003",property: "properties.Comparison_to_State_2001_2003"},
  {display: "Comparison to State 2002-2004",property: "properties.Comparison_to_State_2002_2004"},
  {display: "Comparison to State 2003-2005",property: "properties.Comparison_to_State_2003_2005"},
  {display: "Comparison to State 2004-2006",property: "properties.Comparison_to_State_2004_2006"},
  {display: "Comparison to State 2005-2007",property: "properties.Comparison_to_State_2005_2007"},
  {display: "Comparison to State 2006-2008",property: "properties.Comparison_to_State_2006_2008"},
  {display: "Comparison to State 2007-2009",property: "properties.Comparison_to_State_2007_2009"},
  {display: "Comparison to State 2008-2010",property: "properties.Comparison_to_State_2008_2010"},
  {display: "Comparison to State 2011-2012",property: "properties.Comparison_to_State_2011_2012"},
  {display: "Comparison to State 2012-2013",property: "properties.Comparison_to_State_2012_2013"},
  {display: "Comparison to State 2013-2014",property: "properties.Comparison_to_State_2013_2014"},
  {display: "Comparison to State 2014-2015",property: "properties.Comparison_to_State_2014_2015"},
    ];

var vt_health_status_color_buckets = [
  {
    fill: "rgba(168, 242, 61, 200)",
    stroke: "rgba(168, 242, 61, 255)",
    label: "Better",
    values: ["Better"],
  },
  {
    fill: "rgba( 255, 255, 190, 200)",
    stroke: "rgba( 255, 255, 190, 255)",
    label: "Same",
    values: ["Same"],
  },
  { fill: "rgba(0, 77, 168, 200)",
    stroke: "rgba( 0, 77, 168, 255)",
    label: "Worse",
    values: ["Worse"],
  }
];

RendererTemplates.esri_feature_layer("vt_health_status", {
  url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Vermont_Health_Status_BRFSS/FeatureServer/0"),
  clone_layer_name: function (active_layer) {
     var layer_default = _.find(LayerInfo, {id: active_layer.layer_default_id});
     var name =  layer_default.name + " " + vt_health_status_facets[active_layer.parameters.facet_index];
     return name;
  },
  update_legend: function (active_layer) {
    active_layer.parameters.vt_health_status_color_buckets = vt_health_status_color_buckets;
    active_layer.parameters.vt_health_status_facets = vt_health_status_facets;
  },
  color_buckets: vt_health_status_color_buckets,
  color_bucket_field: function (active_layer) {
    // Depending on the parameters...
    var index = active_layer.parameters.facet_index;
    return vt_health_status_facets[index].property;
  },

  esri_opts: {

  },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
