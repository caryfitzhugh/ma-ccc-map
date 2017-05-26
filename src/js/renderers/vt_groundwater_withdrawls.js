/*global L, Renderers, GEOSERVER */
RendererTemplates.wms("vt_groundwater_withdrawls", {
  update_legend: CDN(GEOSERVER + "/wms?request=GetLegendGraphic&LAYER=vt:groundwater_withdrawls&format=image/png"),
  url: CDN (GEOSERVER + "/vt/wms/"),
  wms_opts:
        {
          layers: 'vt:groundwater_withdrawls',
          format: 'image/png',
          transparent: true,
          zIndex: 100
        },

  get_feature_info_url: function (active_layer) {
    return CDN(GEOSERVER + "/vt/wms" +
              "?SERVICE=WMS&VERSION=1.1.1&"+
              "REQUEST=GetFeatureInfo&"+
              "LAYERS=vt:groundwater_withdrawls&"+
              "QUERY_LAYERS=vt:groundwater_withdrawls&"+
              "STYLES=&"+
              "BBOX=<%= bbox %>&"+
              "FEATURE_COUNT=5&"+
              "HEIGHT=<%= height %>&"+
              "WIDTH=<%= width %>&"+
              "FORMAT=text%2Fhtml&"+
              "INFO_FORMAT=application%2Fjson&"+
              "SRS=EPSG%3A4326&"+
              "X=<%= x %>&Y=<%= y %>");
  }
});

//https://d3dfsz5phlpu8l.cloudfront.net/geoserver/vt/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES=&LAYERS=vt%3Agroundwater_withdrawls&HEIGHT=256&WIDTH=256&BBOX=-7827151.696402048,5165920.119625353,-7670608.662474006,5322463.153553393
//https://d3dfsz5phlpu8l.cloudfront.net/geoserver/vt/wms?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&FORMAT=image%2Fpng&TRANSPARENT=true&STYLES=&LAYERS=vt%3Agroundwater_withdrawls&WIDTH=661&HEIGHT=768&BBOX=-74.26483154296875%2C41.7645263671875%2C-70.63385009765625%2C45.9832763671875
