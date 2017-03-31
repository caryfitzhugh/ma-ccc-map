/*global _, Renderers, L, prism, LayerInfo, GeometryLoader, d3, colorbrewer, Views */
Renderers.prism = {
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

  data_files: {},
  cache: { },

  get_prism_data: function (area, season, prod, date_start, date_end, callback) {
    var cache_key = [date_start, date_end, area, season, prod].join("_");
    var ingest_data = function (data_response) {
      var binned_data = _.reduce(data_response.data, function (results, prism_data) {
        // Filter by date-range (start / end)
        if (parseInt(prism_data[0]) < date_end &&
            parseInt(prism_data[0]) >= date_start) {

          _.each(prism_data[1], function (entry, area_id) {
            results[area_id] = (results[area_id] || []).concat(entry);
          });
        }
        return results;
      }, {});

      var prepped_data = _.reduce(binned_data, function (results, values, area_id) {
        results.push({val: _.sum(values) / values.length, area_id: area_id});
        return results;
      }, []);

      return {geojson: prepped_data,
              color_extent: d3.extent(_.flatten(_.pluck(prepped_data, "val")))};
    };

    var data_file_url =  CDN("https://s3.amazonaws.com/nyccsc-cache.nrcc.cornell.edu/vt/prism/" + area + "/" + prod + "_" + season);

    // If we haven't loaded the json file, load now.
    if (!Renderers.prism.data_files[data_file_url]) {
      d3.json(data_file_url, function (err, prism_data) {
        if (err) {
          callback(err);
        } else {
          Renderers.prism.data_files[data_file_url] = prism_data;
          // Call again recirsively, now that we have a data file in the data_files cache
          Renderers.prism.get_prism_data(area, season, prod, date_start, date_end, callback);
        }
      });
    } else {
      if (!Renderers.prism.cache[cache_key]) {
        Renderers.prism.cache[cache_key] = ingest_data(Renderers.prism.data_files[data_file_url]);
      }
      try {
        callback(null, Renderers.prism.cache[cache_key].geojson,
                 Renderers.prism.cache[cache_key].color_extent);
      } catch (e) { console.error(e);}
    }
  }
};
