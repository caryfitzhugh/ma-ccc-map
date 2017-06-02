/*global L, Renderers, GEOSERVER */
var vt_cyanobacteria_color_buckets = [
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
    values: [0.75, 1.00]
  },
];

RendererTemplates.esri_feature_layer("vt_cyanobacteria", {
  update_legend: function (active_layer) {
    active_layer.parameters.vt_cyanobacteria_color_buckets = vt_cyanobacteria_color_buckets;
  },
  url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Cyanobacteria_2013_to_Present_Summary/FeatureServer/0"),
  clickable: true,
  esri_opts: {
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<strong>" + feature.properties.Station + "</strong></br>" +
                      "Report Frequency:" + feature.properties.Report_Frequency + "<br/>" +
                      "Total Observations:" + feature.properties.Total_Routine_Observations + "<br/>"+
                      "High/Low/Safe Observations:" + feature.properties.High_Alert_Observations +
                          " / " + feature.properties.Low_Alert_Observations +
                          " / " + feature.properties.Generally_Safe_Observations +
                      "<br/>"+
                      "<br/>"+
                      Renderers.utils.zoom_to_location_link( feature.geometry ));
    },
    pointToLayer: function (geojson, latlng) {
      return L.circleMarker(latlng, { radius: 5 });
    },
  },
  color_buckets: vt_cyanobacteria_color_buckets,
  color_bucket_field: "properties.Percent_Low_or_High_Alert",
  find_geojson_match: function (active_layer, match) {
    // Just return the properties..
    return match.feature.properties;
  }
});
