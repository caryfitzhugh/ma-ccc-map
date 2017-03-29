Controllers.Search = {
  execute_search: function (search_str, callback) {
    $.getJSON(
      /*Not on CDN, b/c the port is not 8080 */
      CDN("http://52.2.5.122/api/v1/geometries.php?limit=30&name=" + encodeURIComponent(search_str) + "&callback=?"),
      function (data, textStatus, jqXHR) {
        callback(search_str, data.features);
      }
    );
  }
};
