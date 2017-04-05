Renderers.hospitals = {
  pickle: function (al) {
    al.leaflet_layer_ids = [];
  },

  update_legend_url: Renderers.defaults.legend_url.empty(),

  create_leaflet_layers: Renderers.defaults.create.geojson(
        CDN("https://opendata.arcgis.com/datasets/128c419772234581ac4209e4e429f882_5.geojson")),

  render: Renderers.defaults.render.geojson("hospitals",
    {eachpoint: // This is a special
         function (point) {
            point.setStyle({"color": "#000"});
          }
      })
};