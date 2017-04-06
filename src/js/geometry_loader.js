var GeometryLoader ={
  load: function (name, callback, error_cb) {
    var paths = {
      "county": CDN(GEOSERVER + "/vt/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=vt:county_boundary&maxFeatures=50&outputFormat=application%2Fjson"),
      "basin": CDN("http://api.nescaum-ccsc-dataservices.com/basin.topojson")
    };

    if (GeometryLoader.cache[name]) {
      callback(null, GeometryLoader.cache[name]);
    } else {
      d3.json(paths[name], function (error, geometries) {
        
        if (error) {
          callback(error, null);
        } else {
          if (geometries.type === "Topology") {
            geometries = topojson.feature(geometries, geometries.objects[name]);
          }
          GeometryLoader.cache[name] = geometries;
          callback(null, GeometryLoader.cache[name]);
        }
      });
    }
  },
  cache: {}
};
