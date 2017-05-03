/*global L, Renderers, GEOSERVER */
var vt_health_status_desc_to_key = {
"Comparison to State 2000-2002": "Comparison_to_State_2000_2002",
"Comparison to State 2001-2003": "Comparison_to_State_2001_2003",
"Comparison to State 2002-2004": "Comparison_to_State_2002_2004",
"Comparison to State 2003-2005": "Comparison_to_State_2003_2005",
"Comparison to State 2004-2006": "Comparison_to_State_2004_2006",
"Comparison to State 2005-2007": "Comparison_to_State_2005_2007",
"Comparison to State 2006-2008": "Comparison_to_State_2006_2008",
"Comparison to State 2007-2009": "Comparison_to_State_2007_2009",
"Comparison to State 2008-2010": "Comparison_to_State_2008_2010",
"Comparison to State 2011-2012": "Comparison_to_State_2011_2012",
"Comparison to State 2012-2013": "Comparison_to_State_2012_2013",
"Comparison to State 2013-2014": "Comparison_to_State_2013_2014",
"Comparison to State 2014-2015": "Comparison_to_State_2014_2015",
};

var vt_health_status_comparison_descriptions = [
    "Comparison to State 2014-2015",
    "Comparison to State 2013-2014",
    "Comparison to State 2012-2013",
    "Comparison to State 2011-2012",
    "Comparison to State 2008-2010",
    "Comparison to State 2007-2009",
    "Comparison to State 2006-2008",
    "Comparison to State 2005-2007",
    "Comparison to State 2004-2006",
    "Comparison to State 2003-2005",
    "Comparison to State 2002-2004",
    "Comparison to State 2001-2003",
    "Comparison to State 2000-2002",
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
  update_legend: function (active_layer) {
    active_layer.parameters.vt_health_status_color_buckets = vt_health_status_color_buckets;
    active_layer.parameters.vt_health_status_comparison_descriptions = vt_health_status_comparison_descriptions;
  },
  color_buckets: vt_health_status_color_buckets,
  color_bucket_field: function (active_layer) {
    // Depending on the parameters...
    var index = active_layer.parameters.ending_year_index;
    var desc = vt_health_status_comparison_descriptions[index];
    return "properties." + vt_health_status_desc_to_key[desc];
  },

  esri_opts: {

  },
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
