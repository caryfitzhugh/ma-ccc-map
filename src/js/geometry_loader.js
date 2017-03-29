var GeometryLoader ={
  load: function (name, callback, error_cb) {
    var paths = {
      "county": CDN("http://52.2.5.122:8080/geoserver/www/counties.geojson.json"),
      "basin": CDN("http://52.2.5.122:8080/geoserver/www/basin.topojson.json")
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
