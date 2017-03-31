Renderers.vt_mask = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
  },

  update_legend_url: Renderers.defaults.legend_url.empty(),

  create_leaflet_layers: Renderers.defaults.create.geojson(
        CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:state_mask&maxFeatures=50&outputFormat=application%2Fjson")),

  render: Renderers.defaults.render.geojson("vt_mask",
    {each_polygon: // This is a special
         function (polygon) {
            polygon.setStyle({"color": "#000"});
          }
      })
};
