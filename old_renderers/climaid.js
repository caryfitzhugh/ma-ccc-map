/*global LayerInfo, Renderers, _ */
Renderers.climaid = {
  render_data: function (map, color, geojson) {
    //take care of projections
    var path = d3.geo.path().projection(function (x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
        return [point.x, point.y];
      });

    // Draw gemoetries (with COLOR!)
    var new_layer = L.d3SvgOverlay(function (sel, proj) {
      sel.selectAll('.grid')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr("class", "grid")
        .attr('stroke', 'rgba(0,0,0,0.4)')
        .attr('stroke-width', 0.1)
        .attr('fill', function (d) {
          return color(d.properties.temp_delta) || "rgba(0,0,0,0)";
        })
        .attr("data-count", function (d) {
          return d.properties.temp_delta;
        })
        .attr("data-lat-lng-path", function (d) {
          return JSON.stringify(d.geometry);
        })
        .attr("d", path);
    });

    return new_layer;
  },

  cache: {},
  data_files: {},

  get_climaid_data: function (data_file_url, timestep, scenario, percentile, symbology, callback) {
    var cache_key = [data_file_url, timestep, scenario, percentile, symbology].join("_");

    // We have the data coming in a big blob.  One file == all the data
    var ingest_data = function (temp_delta_data) {
      var get_geometry = function (row_i, col_i) {
        // Latitude is the Y (col)
        var tl = [
          temp_delta_data.longitude.start + (col_i * temp_delta_data.longitude.step),
          temp_delta_data.latitude.start + (row_i * temp_delta_data.latitude.step)
        ];

        var tr = [
          temp_delta_data.longitude.start + ((1 + col_i) * temp_delta_data.longitude.step),
          temp_delta_data.latitude.start + (row_i * temp_delta_data.latitude.step)
        ];

        var br = [
          temp_delta_data.longitude.start + ((1 + col_i) * temp_delta_data.longitude.step),
          temp_delta_data.latitude.start + ((1 + row_i) * temp_delta_data.latitude.step)
        ];

        var bl = [
          temp_delta_data.longitude.start + (col_i * temp_delta_data.longitude.step),
          temp_delta_data.latitude.start + ((1 + row_i) * temp_delta_data.latitude.step)
        ];

        return [tl, tr, br, bl, tl];
      };

      // We want to convert this into a set of values which can drop into d3
      var geojson = {
        "type": "FeatureCollection",
        "features": []
      };

      var temp_prediction_set = temp_delta_data[timestep][scenario][percentile];

      // The temp prediction set looks like this:
      // [
      //    [  1, 2, 3, 4, 5...] // These are the deltas in Celsius
      //    // Each row is the vertical row on the map. (like Y)
      //    // Each row's contents defines the horiztonal data (like X)
      //    ....
      // ]
      _.forEach(temp_prediction_set, function (delta_row, row_i) {
        _.forEach(delta_row, function (delta_col, col_i) {
          geojson.features.push({
            "type": "Feature",
            "lat-lng": get_geometry(row_i, col_i)[0],
            "geometry": {
              "type": "Polygon",
              "coordinates": [get_geometry(row_i, col_i)]
            },
            "properties": {
              "temp_delta": delta_col
            }
          });
        });
      });

      var color_extent = [0,100];
      // Find the range.
      if (symbology === "year") {
        // Want all the values inside this entire year set
        color_extent = d3.extent(
          _.flattenDeep(_.map(temp_delta_data[timestep],
                              function(y) { return _.map(y,
                                                         function (s) { return _.flattenDeep(s);}); }))
        );

      } else if (symbology === "scenario") {
        // Want all values from this scenario, across all years / percentiles
        var scenarios = _.compact(_.pluck(temp_delta_data, scenario));
        var data_points = _.flattenDeep(_.map(scenarios, function (s) { return _.values(s); }));
        color_extent = d3.extent(data_points);

      } else if (symbology === "percentile") {
        // Want all values from this percentile, across all years / scenarios
        var data_points = [];
        _.each(temp_delta_data, function (year) {
          _.each(year, function (scenario) {
            _.each(scenario, function (percentile_data, val) {
              if (val === percentile) {
                data_points.push(percentile_data);
              }
            });
          });
        });
        color_extent = d3.extent( _.flattenDeep(data_points));
      }

      return {geojson: geojson, color_extent: color_extent};
    };

    // If we haven't loaded the json file, load now.
    if (!Renderers.climaid.data_files[data_file_url]) {
      d3.json(data_file_url, function (err, climaid_deltas) {
        if (err) {
          callback(err, null);
        } else {
          Renderers.climaid.data_files[data_file_url] = climaid_deltas;
          // Call again recirsively, now that we have a data file in the data_files cache
          Renderers.climaid.get_climaid_data(data_file_url, timestep, scenario, percentile, symbology, callback);
        }
      });
    } else {

      if (!Renderers.climaid.cache[cache_key]) {
        Renderers.climaid.cache[cache_key] = ingest_data(Renderers.climaid.data_files[data_file_url]);
      }
      try {
        callback(null, Renderers.climaid.cache[cache_key].geojson,
                 Renderers.climaid.cache[cache_key].color_extent);
      } catch (e) { console.error(e);}
    }
  }
};
