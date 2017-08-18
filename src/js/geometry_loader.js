var GeometryLoader ={
  load: function (name, callback, error_cb) {
    var paths = {
      "county": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1545%2C%201724%2C%201646%2C%201644%2C%201596%2C%201554%2C%201645%2C%201622%2C%201676%2C%201606%2C%201708%2C%201555%2C%201725%2C%201730",
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
