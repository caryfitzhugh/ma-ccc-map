Controllers.Search = {
  execute_search: function (search_str, callback) {
    $.getJSON(
      /*Not on CDN, b/c the port is not 8080 */
      "https://maps.google.com/maps/api/geocode/json?sensor=false&bounds=41,-74|43,-69&address=" + encodeURIComponent(search_str),
      function (data, textStatus, jqXHR) {
        callback(search_str, data);
      }
    );
  }
};
