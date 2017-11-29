/*global _ , Controllers, Renderers */
Controllers.LayerImport = {
  import_layer: function (cp, file) {
    cp.set("layer_import.import_file_processing", true);
    var reader = new FileReader();
    // reader.result contains the contents of blob as a typed array
    let finish_up = () => {
        setTimeout(() => {
          cp.set("layer_import.import_file", "");
          cp.set("layer_import.import_file_processing", false);
          cp.set("layer_import.show_modal", false);
          cp.set("layer_import.import_file", "");
        }, 10);
    };
    let load_polygons = (polys) => {
      // Need to convert to GeoJSON format
      let gjson = JSON.stringify({
        type: "FeatureCollection",
        features: _.map(polys, (polygon) => {
          return polygon;
        })
      });
      load_geojson(gjson);
    };

    let load_geojson = (contents) => {
      try {
        Controllers.Layers.add_imported_layer(cp, file.name, contents);
      } finally {
        finish_up();
      }
    };

    if (file.name.match(".*\.json") || file.name.match(".*\.geojson")) {
      reader.addEventListener("loadend", () => {
        load_geojson(reader.result);
      });
      reader.readAsText(file);

    } else if (file.name.match(".*\.zip")) {
      reader.addEventListener("loadend", () => {
        try {
          load_geojson(shp.parseZip(reader.result));
        } catch(e) {
          console.error(e);
          finish_up();
          alert(e);
        }
      });
      reader.readAsArrayBuffer(file);

    } else if (file.name.match(".*\.gpx")) {
      reader.addEventListener("loadend", () => {
        try {
              let parser = new DOMParser();
              let doc = parser.parseFromString(reader.result, 'text/xml');
              let gjson = toGeoJSON.gpx(doc);

              gjson.features[0].geometry.coordinates.forEach((c) => {
                  c.length = 2;
                  delete c[2];
                });
              load_geojson(gjson);
            } catch(e) {
              console.error(e);
              finish_up();
              alert(e);
        }
      });

        reader.readAsText(file);
    } else if (file.name.match(".*\.kml")) {
      reader.addEventListener("loadend", () => {
        try {
              let parser = new DOMParser();
              let doc = parser.parseFromString(reader.result, 'text/xml');
              let gjson = toGeoJSON.kml(doc);
              load_geojson(gjson);
            } catch(e) {
              console.error(e);
              finish_up();
              alert(e);
        }
      });

        reader.readAsText(file);
    } else {
      alert("This input file is not supported");
    }
  }
};
