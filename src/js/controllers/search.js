Controllers.Search = {
  execute_search: function (search_str, callback) {
    $.getJSON(
      /*Not on CDN, b/c the port is not 8080 */
      "http://api.geonames.org/searchJSON?username=frontierspatial&featureClass=P&maxRows=5&country=US&adminCode1=VT&name_startsWith=" + encodeURIComponent(search_str) + "&callback=?",
      function (data, textStatus, jqXHR) {
        callback(search_str, data.geonames);
      }
    );
  }
};
