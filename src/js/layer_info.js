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
    "id": "example_esri_layer",
    "folder": "DEV Examples",
    "name": "Esri Layer",
    "sectors": []
  },
  {
    "id": "example_wms_layer",
    "folder": "DEV Examples",
    "name": "WMS Layer",
    "sectors": []
  },
  {
    "id": "example_esri_feature_layer",
    "folder": "DEV Examples",
    "name": "Esri Feature Layer",
    "sectors": []
  },
  {
    "id": "boundary_counties",
    "folder": "Boundaries",
    "name": "Counties",
    "sectors": []
  },
  {
    "id": "boundary_huc8",
    "folder": "Boundaries",
    "name": "Watersheds",
    "sectors": [],
  },
  {
    "id": "soils",
    "folder": "Land Cover",
    "name": "Soils",
    "sectors": [],
  },
  {
    "id": "nfhl",
    "folder": "Public Safety",
    "name": "Flood Hazard",
    "description": "FEMA National Flood Hazard Layer",
    "source": "FEMA",
    "source_url": "http:\/\/www.fema.gov\/",
    "sectors": ["Water Resources"],
    "download_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
    "metadata_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
  },
  {
    "id": "barrier_beaches",
    "folder": "Coastal Zones",
    "name": "Barrier Beaches",
    "description": "The state barrier beach data layer was compiled by the Resource Mapping Project staff at the University of Massachusetts, Amherst for the Massachusetts Coastal Zone Management Program.",
    "source": "Massachusetts Coastal Zone Management Program",
    "source_url": "http://www.mass.gov/eea/agencies/czm/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/barrb.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/state-designated-barrier-beaches-.html",
  },
  {
    "id": "hurricane_surge",
    "folder": "Coastal Zones",
    "name": "Hurricane Surge",
    "description": "The state barrier beach data layer was compiled by the Resource Mapping Project staff at the University of Massachusetts, Amherst for the Massachusetts Coastal Zone Management Program.",
    "source": "Massachusetts Coastal Zone Management Program",
    "source_url": "http://www.mass.gov/eea/agencies/czm/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/barrb.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/state-designated-barrier-beaches-.html",
  },
  {
    "id": "wind_power",
    "folder": "Renewables",
    "name": "Wind Power Density at 50m",
    "description": "This data layer is a vector version of the AWS Truewind, LLC, Massachusetts Technology Collaborative 50 meter elevation wind power density raster layer. The raster layer work was jointly funded by the Connecticut Clean Energy Fund, the Massachusetts Technological Collaborative, and Northeast Utilities System.  The raster data were re-classified (AWS_CLASS) in accordance with the 8 classes used by Mass. Tech et al. The data were then converted from raster to polygon using the GRIDPOLY command. The PWRDENSITY field was created to show the power density range (watts/sq. meters) for each class. The data were then transformed from WGS1984 to NAD83 SPC using NAD1983toWGS1984 transform 5 (United States) and clipped to the extent of the WINDSPEEDGRID_POLY layer created by MassGIS and AWS Truewind, LLC. Processing of this polygon layer was completed by the Massachusetts Water Resources Authority (MWRA) GIS program and provided to MassGIS for distribution.",
    "source": "Massachusetts Technology Collaborative",
    "source_url": "http://www.masstech.org/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/windpower.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/wind-power-density-at-50m.html",
  },
  {
    "id": "prime_forest",
    "folder": "Agriculture/Forestry",
    "name": "Prime Forest Land",
    "description": "Using primarily the NRCS/MassGIS Soils data, the basic procedure was to classify potentially forested land into nine different categories based on potential average timber productivity of white pine and red oak “…per acre per year at culmination of mean annual increment. Site index values are at age 50.” Other data sets were used to refine this classification, including aspect, land cover, riparian, slope position, wetlands, hydrologic soil association and unique areas.  With the January 2013 update the dataset is complete statewide.",
    "source": "DCR, Bureau of Forestry, Management Forestry Program",
    "source_url": "http://www.mass.gov/eea/agencies/dcr/conservation/forestry-and-fire-control/forestry.html",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/primeforest.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/primeforest.html",
  },
  {
    "id": "tree_atlas",
    "folder": "Agriculture/Forestry",
    "name": "USFS Climate Change Atlas - Tree Species",
    "description": "Modeled importance value (IV) of 20 Massachussetts native tree species for three climate conditions: 1) current climate (1961-1990 average); 2) future climate (2071-2100 average) with IPCC scenario B1 (significant conservation and reduction of CO2 emissions); and 3) future climate (2071-2100 average) with IPCC scenario A1FI (high emissions, no modification in current emission trends). Importance Value measures the dominance of a tree species in a forest, based on the relative frequency, density, and basal area of the species. For more information on the models and to explore more tree species and climate scenarios, visit the US Forest Service Climate Change Atlas: http://www.fs.fed.us/nrs/atlas/",
    "source": "USDA Forest Service Northern Research Station",
    "source_url": "http:\/\/www.fs.fed.us\/nrs\/atlas\/",
    "sectors": ["Ecosystems"],
    "download_url": null,
    "metadata_url": null,
  },

];

var desired_active_on_load = [

];
