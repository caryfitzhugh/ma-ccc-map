/*global module*/

module.exports = function (grunt) {
  grunt.initConfig({
    // Specify how to "inline" all the content
    inline: {
      options: {
        cssmin: true,
        tag: '__inline',
        uglify: true,
        babelify: ['transform-es2015-template-literals']
      },
      map_viewer: {
        src: "src/map_viewer.html",
        dest: "dist/map_viewer.html"
      },
    },
    copy: {
      zeroClipboardSWF: {
        src: "src/vendor/zero-clipboard/ZeroClipboard.swf",
        dest: "dist/ZeroClipboard.swf"
      },
      images: {
        expand: true,
        cwd: "src",
        src: "img/**",
        dest: "dist/",
        filter: "isFile"

      },
      data: {
        expand: true,
        cwd: "src",
        src: "data/**",
        dest: "dist/",
        filter: "isFile"

      },
      meta_data: {
        src: "src/js/layer_info.js",
        dest: "dist/meta_data.json",
        options: {
          process: function (js) {
            // The map_layers are what the var is called
            var available_layers;
            // Eval it - leaving MetaData defined
            try {
              var Config = {skip_cdn: true};

              eval(js);

              var output = [];

              console.log("Formatting the LayerInfo now... ", available_layers.length , "Layers");

              for (var i = 0; i < available_layers.length; i++ ) {
                var l = available_layers[i];
                output.push({
                   id: l.id,
                   folder: l.folder,
                   name: l.name,
                   description: l.description,
                   source: l.source,
                   source_url: l.source_url,
                   sectors: l.sectors,
                   legend_url: l.legend_url,
                   download_url: l.download_url,
                   metadata_url: l.metadata_url
                });
              }

              return JSON.stringify(output, null, 2);

            } catch (e) { console.error(e);
              throw e;
            }
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['inline:map_viewer', "copy:meta_data", "copy:images", "copy:data", "copy:zeroClipboardSWF"]);
}
