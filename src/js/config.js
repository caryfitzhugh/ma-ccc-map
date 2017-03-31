/*global _ , L  */
var getParameterByName = function(name) {
  // This test is for the meta_data pre_processing
  if (typeof window !== "undefined") {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  } else {
    return null;
  }
};

var Config = {
  defaults: {
    // https://www.maptechnica.com/state-map/VT (only via google results though! haha)
    "bounding-box": [-73.437905, 45.016659, -71.465047, 42.726933]
  },
  // If you want to SKIP the CDN, add this query parameter.
  skip_cdn: getParameterByName("cdn") === "disable"
};
