var GeometryLoader ={
  load: function (name, callback, error_cb) {
    var paths = {
      "county": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=1545%2C%201724%2C%201646%2C%201644%2C%201596%2C%201554%2C%201645%2C%201622%2C%201676%2C%201606%2C%201708%2C%201555%2C%201725%2C%201730",
      "basin": "https://repository.nescaum-ccsc-dataservices.com/geofocuses/bulk_geojson/?ids=2086%2C2087%2C2088%2C2089%2C2090%2C2091%2C2092%2C2093%2C2094%2C2095%2C2096%2C2097%2C2098%2C2099%2C2100%2C2101%2C2102%2C2103%2C2104%2C2105%2C2106%2C2107%2C2108%2C2109%2C2110%2C2111%2C2112",
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
