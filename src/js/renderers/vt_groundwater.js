var vt_groundwater_color_buckets = [
  { fill: "#feebe2",
    stroke: "#feebe2",
    label: "I",
    value: 1,
  },
  { fill: "#fbb4b9",
    stroke: "#fbb4b9",
    label: "II",
    value: 2,
  },
  { fill: "#f768a1",
    stroke: "#f768a1",
    label: "III",
    value: 3,
  },
  { fill: "#ae017e",
    stroke: "#ae017e",
    label: "IV",
    value: 4,
  }
];
RendererTemplates.geojson_polygons('vt_groundwater' ,{
  update_legend: function (active_layer) {
    active_layer.parameters.legend_url = CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_reclass&format=image/png");
    active_layer.parameters.vt_groundwater_color_buckets = vt_groundwater_color_buckets;
  },

  url: CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:groundwater_reclass&maxFeatures=50&outputFormat=application%2Fjson"),
  each_polygon: function (polygon) {
    var color = _.find(vt_groundwater_color_buckets, {"value": polygon.feature.properties.gw_class});
    polygon.setStyle({"color": color.stroke, "fillColor": color.fill});
  },

  popupContents: function (feature) {
    return "<strong>" + feature.properties.site_name + "</strong></br>" +
           " Class " + feature.properties.gw_class + "<br/>"  +
           " " + feature.properties.acres + " acres<br/>"+
           " " + feature.properties.town + "<br/>"  +
           "</br>"+
           Renderers.utils.zoom_to_location_link( feature.geometry );
  }
});
