/*global _ , Controllers, Renderers */
Controllers.LayerImport = {
  import_layer: function (cp, file) {
    cp.set("layer_import.import_file_processing", true);
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
      // reader.result contains the contents of blob as a typed array
      var contents = reader.result;
      // If it's a SHPFile
      /*
      if (file.name.match("*.shp")) {
        shp(contents).then(function(geojson){ contents = geojson;});
      }
      */
      Controllers.Layers.add_imported_layer(cp, file.name, contents);
      cp.set("layer_import.import_file", null);
      cp.set("layer_import.import_file_processing", false);
      cp.set("layer_import.show_modal", false);
    });
    reader.readAsText(file);
  }
};
