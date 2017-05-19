
var API_Handler = {
  parse_query_string: function (query) {
    // Based on: http://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
    var result = {};
    query.split("&").forEach(function (part) {
      if (part) {
        var item = part.split("=");
        var key = item[0];
        var val = decodeURIComponent(item[1]);
        var from = key.indexOf("[");
        if (from === -1) {
          result[key] = val;
        } else {
          var to = key.indexOf("]");
          var index = key.substring(from + 1, to);
          key = key.substring(0, from);
          if (!result[key]) {
            result[key] = [];
          }
          if (!index) {
            result[key].push(val);
          } else {
            result[key][index] = val;
          }
        }
      }
    });
    return result;
  },
  parameter_error: function (error_str) {
    console.error(error_str);
  },
  validate_parameters: function (params, all_layer_ids) {
    var result = _.merge (Config.defaults,
        { "active-layers": [],
          "available-layers":  all_layer_ids});

    // Look for bounding-box
    if (params["bounding-box"]) {
      try {
        var split = params["bounding-box"].split(",",4);
        // Split on lat, lng and convert to float
        var new_bbox = [parseFloat(split[0]), parseFloat(split[1]),
                          parseFloat(split[2]), parseFloat(split[3])];

        if (new_bbox[0] < -90 || new_bbox[0] > 90 ||
            new_bbox[2] < -90 || new_bbox[2] > 90 ||
            new_bbox[1] < -180 || new_bbox[1] > 180 ||
            new_bbox[3] < -180 || new_bbox[3] > 180) {
          API_Handler.parameter_error("Error parsing bounding-box: is out of bounds (+-90, +- 180, +-90, +-180) [" + new_bbox + "]");
        } else {
          result["bounding-box"] = new_bbox;
        }

      } catch (e) {
        API_Handler.parameter_error("Error parsing bounding-box: " + e + " \nDefaulting to : " + JSON.stringify(result["bounding-box"]));
      }
    }

    // Make sure that available map layers are valid
    if (params["available-layers"]) {
      try {
        var new_layers = _.remove(params["available-layers"].split(","), function (v) { return v; })
        var valid_layers = _.intersection(all_layer_ids, new_layers);
        var invalid_layers = _.difference(new_layers, valid_layers);
        if (invalid_layers.length > 0) {
          API_Handler.parameter_error("Error parsing available-layers: DROPPING layers [" + invalid_layers.join(",") + "]");
        }
        result["available-layers"] = valid_layers;
      } catch (e) {
        API_Handler.parameter_error("Error parsing available-layser: " + e + " \nDefaulting to : " +
            JSON.stringify( result["available-layers"]));
      }
    }

    // Make sure that active map layers are valid
    if (params["active-layers"] || params["active-layers"] === "") {
      try {
        var new_layers = _.remove(params["active-layers"].split(","), function (v) { return v;});
        var valid_layers = _.intersection(new_layers, all_layer_ids);
        var invalid_layers = _.difference(new_layers, valid_layers);
        if (invalid_layers.length > 0) {
          API_Handler.parameter_error("Error parsing active-layers: DROPPING layers [" + invalid_layers.join(",") + "]");
        }
        result["active-layers"] = valid_layers;
      } catch (e) {
        API_Handler.parameter_error("Error parsing available-layser: " + e + " \nDefaulting to : " + JSON.stringify(result["available-layers"]));
      }
    }

    // Make sure all active layers are available
    var active_but_not_available_layers = _.difference(result["active-layers"], result["available-layers"]);
    if (active_but_not_available_layers.length > 0) {
      result["available-layers"] = _.union(result["available-layers"], active_but_not_available_layers);
    }
    return result;
  },

  get_parameters: function (qstr, all_layer_ids) {
    var raw_parameters = API_Handler.parse_query_string(qstr);
    return API_Handler.validate_parameters(raw_parameters, all_layer_ids);
  }
};
