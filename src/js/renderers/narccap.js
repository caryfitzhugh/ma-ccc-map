/*global _, Renderers, L, narccap, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.narccap = {
  render_data: function (map, color, json_data, join_path, geometries) {
    //take care of projections
    var path = d3.geo.path().projection(function (x) {
        var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
        return [point.x, point.y];
      });

    var json_lookup = _.reduce(json_data, function (lookup, dat) {
        lookup[dat.area_id] = dat.val;
        return lookup;
      }, {});

    // Draw gemoetries (with COLOR!)
    var new_layer = L.d3SvgOverlay(function (sel, proj) {
      sel.selectAll('.boundary')
        .data(geometries.features)
        .enter()
        .append('path')
        .attr("class", "boundary")
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('fill', function (d) {
          return color(json_lookup[_.get(d, join_path)]) || "#eee";
        })
        .attr("data-count", function (d) {
          var area_id = _.get(d, join_path);
          return json_lookup[area_id] || 0;
        })
        .attr("data-lat-lng-path", function (d) {
          return JSON.stringify(d.geometry);
        })
        .attr("d", path);
    });

    return new_layer;
  },

  data_files: { },
  cache: { },

  get_narccap_data: function (area, season, prod, date_start, date_end, callback) {
    var cache_key = [date_start, date_end, area, season, prod].join("_");

    var ingest_data = function (data_response) {

      //get baseline average for 1990-1999
      var baseline_data = _.reduce(data_response.data, function (results, narccap_data) {

        if (parseInt(narccap_data[0]) < 2000 &&
            parseInt(narccap_data[0]) >= 1990) {

          _.each(narccap_data[1], function (entry, area_id) {
            results[area_id] = (results[area_id] || []).concat(entry[1]);
          });
        }
        return results;
      }, {});

      var baseline_data = _.reduce(baseline_data, function (results, values, area_id) {
        results[area_id] = _.sum(values) / values.length;
        return results;
      }, {});

      var adjusted_data = _.reduce(data_response.data, function (results, narccap_data) {
        var date = parseInt(narccap_data[0]);

        // Keep the old data out of the calcualtion.
        if (date >= 2039) {
          _.each(narccap_data[1], function (entry, area_id) {
            results.push({date: date , area_id: area_id, val: (entry[1] - baseline_data[area_id])});
          });
        }
        return results;
        }, []);

      var binned_data = _.reduce(adjusted_data, function (results, adjusted_data) {
        // Filter by date-range (start / end)

        if (adjusted_data.date < date_end &&
            adjusted_data.date >= date_start) {

          results[adjusted_data.area_id] = (results[adjusted_data.area_id] || []).concat(adjusted_data.val);
        }
        return results;
      }, {});

      var prepped_binned_data = _.reduce(binned_data, function (results, values, area_id) {
        results.push({val: _.sum(values) / values.length, area_id: area_id});
        return results;
      }, []);


      var adjusted_extent = d3.extent(_.map(adjusted_data, "val"));

      return {geojson: prepped_binned_data,
              color_extent: adjusted_extent
             };
    };

    var data_file_url = CDN("https://s3.amazonaws.com/nyccsc-cache.nrcc.cornell.edu/narccap/" + area + "/" + prod + "_" + season);

    if (!Renderers.narccap.data_files[data_file_url]) {
      d3.json(data_file_url, function (err, narccap_data) {

        if (err) {
          callback(err, null, null);
        } else {
          Renderers.narccap.data_files[data_file_url] = narccap_data;
          Renderers.narccap.get_narccap_data(area, season, prod, date_start, date_end, callback);
        }
      });
    } else {
      if (!Renderers.narccap.cache[cache_key]) {
        Renderers.narccap.cache[cache_key] = ingest_data(Renderers.narccap.data_files[data_file_url]);
      }
      try {
        callback(null, Renderers.narccap.cache[cache_key].geojson,
                       Renderers.narccap.cache[cache_key].color_extent);
      } catch (e) { console.error(e);}
    }
  }
};
