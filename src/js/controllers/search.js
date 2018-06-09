Controllers.Search = {
  execute_search: function (search_str, callback) {
    $.getJSON(
      "https://maps.google.com/maps/api/geocode/json?bounds="+
      Config.defaults["bounding-box"][1] + "," +
      Config.defaults["bounding-box"][0] + "|" +
      Config.defaults["bounding-box"][3] + "," +
      Config.defaults["bounding-box"][2] + "&address=" + encodeURIComponent(search_str) + "&key=AIzaSyAOCQaASjkuA5J9S_6Nn0T7oz4VnFsh5dU",
      function (data, textStatus, jqXHR) {
        callback(search_str, data);
      }
    );
  }
};
