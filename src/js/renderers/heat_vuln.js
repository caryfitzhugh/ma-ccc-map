RendererTemplates.esri_polygons('heat_vuln' ,{
  update_legend: null,

  url: CDN("https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Heat_Vulnerability/FeatureServer/0/"),

  each_polygon: function (polygon) {
        polygon.setStyle({"color": "#000"});
      }
});
