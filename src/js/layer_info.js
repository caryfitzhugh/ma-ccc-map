/*global Config, _ , URI, console*/
var GEOSERVER = "http://geoserver.nescaum-ccsc-dataservices.com/geoserver";
var API_SERVER = "http://api.nescaum-ccsc-dataservices.com/";

var CDN = function (url_str) {
  var url;
  if (Config.skip_cdn) {
    url = url_str;
  } else {
    var uri = new URI(url_str);
    var hostname = uri.hostname();

    if (hostname.match(/geoserver.nescaum-ccsc-dataservices.com/)) {
      uri.hostname("d3dfsz5phlpu8l.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else if (hostname.match(/api.nescaum-ccsc-dataservices.com/)) {
      uri.hostname("d2749s27r5h52i.cloudfront.net");
      uri.port(null);
      uri.scheme("https");
    } else {
      console.warn("Hostname not in a CDN", hostname);
    }

    url = uri.toString();
  }
  return url;
};

var available_layers = [
  {
    "id": "taccimo",
    "folder": "Ecosystems",
    "name": "USFS Climate Change Atlas - Tree Species",
    "description": "Modeled importance value (IV) of 20 Vermont native tree species for three climate conditions: 1) current climate (1961-1990 average); 2) future climate (2071-2100 average) with IPCC scenario B1 (significant conservation and reduction of CO2 emissions); and 3) future climate (2071-2100 average) with IPCC scenario A1FI (high emissions, no modification in current emission trends). Importance Value measures the dominance of a tree species in a forest, based on the relative frequency, density, and basal area of the species. For more information on the models and to explore more tree species and climate scenarios, visit the US Forest Service Climate Change Atlas: http://www.fs.fed.us/nrs/atlas/",
    "source": "USDA Forest Service Northern Research Station",
    "source_url": "http:\/\/www.fs.fed.us\/nrs\/atlas\/",
    "sectors": "Ecosystems",
    "download_url": null,
    "metadata_url": null,
    "parameters": { }
  },
  {
    "id": "anthromes",
    "folder": "Land Cover",
    "name": "Anthropogenic Biomes",
    "description": "The Anthropogenic Biomes of the World, Version 2: 2000 data set describes anthropogenic transformations within the terrestrial biosphere caused by sustained direct human interaction with ecosystems, including agriculture and urbanization c. 2000. Potential natural vegetation, biomes, such as tropical rainforests or grasslands, are based on global vegetation patterns related to climate and geology. Anthropogenic transformation within each biome is approximated using population density, agricultural intensity (cropland and pasture) and urbanization. This data set is part of a time series for the years 1700, 1800, 1900, and 2000 that provides global patterns of historical transformation of the terrestrial biosphere during the Industrial Revolution.",
    "source": "Center for International Earth Science Information Network (CIESIN)",
    "source_url": "sedac.ciesin.columbia.edu/data/set/anthromes-anthropogenic-biomes-world-v2-2000",
    "sectors": "Ecosystems, Agriculture, Buildings",
    "download_url": null,
    "metadata_url": "sedac.ciesin.columbia.edu/data/set/anthromes-anthropogenic-biomes-world-v2-2000",
    "parameters": {
    }
  }

];
var desired_active_on_load = [

];
