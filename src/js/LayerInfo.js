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

// This is pointing to port 8080 on the origin machine.
// The public server hostname is
// http://ec2-52-11-55-233.us-west-2.compute.amazonaws.com/

var LayerInfo = [
    {
      "id": "vt_mask",
      "sort_key": 0,
      "folder": "Boundaries",
      "name": "VT State Mask",
      "description": "This layer masks out map features outside of the VT state boundaries.  Derived from TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.  ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "sectors": "",
      "parameters": {
        "opacity": 80,
        "fixed_z_index": 5000, // Set this to 5000 if you want markers on top. Or 15000 if you want markers under.
        "color": "#000",
        "no_sorting": true
      }
    },
    {
      "id": "boundary_huc8",
      "folder": "Boundaries",
      "name": "Major Watersheds",
      "description": "Sub-basin (8-digit HUC) boundaries derived from the National Hydrography Dataset (NHD).",
      "source": "USGS",
      "source_url": "http:\/\/nhd.usgs.gov/",
      "metadata_url": "ftp:\/\/nhdftp.usgs.gov\/DataSets\/Staged\/States/FileGDB\/MediumResolution\/",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "boundary_counties",
      "folder": "Boundaries",
      "name": "Counties",
      "description": "TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.   These boundary files are specifically designed for small scale thematic mapping. ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "metadata_url": "https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html",
      "download_url": "http://www2.census.gov/geo/tiger/GENZ2013/cb_2013_us_county_500k.zip",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "prism_temp",
      "folder": "Climate Data.Temperature",
      "name": "PRISM Historical Temperatures 1980-2014",
      "description": "Gridded 4km resolution monthly temperature data averaged over the period 1980 to 2014 for two different user-selected spatial units in New York State: counties and HUC8 watersheds.",
      "source": "PRISM",
      "source_url": "http:\/\/www.prism.oregonstate.edu",
      "sectors": "All",
      "download_url": null,
      "metadata_url": "http:\/\/www.prism.oregonstate.edu\/recent",
      "parameters": {
        "opacity": 70,
        "area" : "county",
        "prod" : "avgt",
        "season" : "ANN"
      }
    },
    {
      "id": "prism_precip",
      "folder": "Climate Data.Precipitation",
      "name": "PRISM Historical Precipitation 1980-2014",
      "description": "Gridded 4km resolution monthly precipitation data averaged over the period 1980 to 2014 for two different user-selected spatial units in New York State: counties and HUC8 watersheds.",
      "source": "PRISM",
      "source_url": "http:\/\/www.prism.oregonstate.edu",
      "sectors": "All",
      "download_url": null,
      "metadata_url": "http:\/\/www.prism.oregonstate.edu\/recent",
      "parameters": {
        "opacity": 70,
        "area" : "county",
        "season" : "ANN"
      }
    },
    {
      "id": "nfhl",
      "folder": "Water Resources",
      "name": "Flood Hazard",
      "description": "FEMA National Flood Hazard Layer",
      "source": "FEMA",
      "source_url": "http:\/\/www.fema.gov\/",
      "sectors": "Water Resources",
      "download_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
      "metadata_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "gap_lc",
      "folder": "Land Cover",
      "name": "GAP Land Cover Dataset",
      "description": "GAP Land Cover 3 National Vegetation Classification-Formation Land Use for the contiguous United States. For more information about the National Vegetation Classification Standard please visit this link: http://usnvc.org/data-standard/",
      "source": "USGS",
      "source_url": "https://catalog.data.gov/dataset/u-s-geological-survey-gap-analysis-program-land-cover-data-v2-2",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "https://gis1.usgs.gov/arcgis/rest/services/gap/GAP_Land_Cover_NVC_Class_Landuse/MapServer",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "nlcd",
      "folder": "Land Cover",
      "name": "National Land Cover Dataset",
      "description": "National Land Cover Dataset (NLCD). NLCD 1992, NLCD 2001, NLCD 2006, and NLCD 2011 are National Land Cover Database classification schemes based primarily on Landsat data along with ancillary data sources, such as topography, census and agricultural statistics, soil characteristics, wetlands, and other land cover maps. NLCD 1992 is a 21-class land cover classification scheme that has been applied consistently across the conterminous U.S. at a spatial resolution of 30 meters.",
      "source": "USGS",
      "source_url": "http:\/\/www.mrlc.gov",
      "sectors": "Agriculture,Ecosystems,Buildings and Transportation",
      "download_url": null,
      "metadata_url": "http:\/\/catalog.data.gov\/dataset\/usgs-land-cover-nlcd-overlay-map-service-from-the-national-map-national-geospatial-data-asset-#sec-dates",
      "parameters": {
        "opacity": 70
      }
    },
/*    {
      "id": "noaa_slr",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (NOAA)",
      "description": "Sea Level Rise: the maps show inland extent and relative depth of inundation from 0 to 6 feet above mean higher high water (MHHW). Areas that are hydrologically connected (according to the digital elevation model used) are shown in shades of blue. Low-lying areas, displayed in green, are considered hydrologically “unconnected” areas that may flood. The inundation maps are created by subtracting the NOAA VDATUM MHHW surface from the digital elevation model. Mapping Confidence: blue areas denote a high confidence of inundation, orange areas denote a low confidence of inundation, and unshaded areas denote a high confidence that these areas will be dry given the chosen water level.",
      "source": "NOAA",
      "source_url": "http:\/\/coast.noaa.gov\/slr\/",
      "sectors": "All",
      "legend_url": null,
      "download_url": null,
      "metadata_url": "https:\/\/coast.noaa.gov\/digitalcoast\/tools\/slr",
      "parameters": {
        "opacity": 70,
        "sea_level_height": 0,
        "display_layer" : "slr" // conf
      }
    },*/
    {
      "id": "superfund",
      "folder": "Miscellaneous",
      "name": "Superfund Sites",
      "description": "The Agency for Toxic Substances and Disease Registry (ATSDR) Hazardous Waste Site Polygon Data with CIESIN Modifications, Version 2 is a database providing georeferenced data for 1,572 National Priorities List (NPL) Superfund sites",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/superfund-atsdr-hazardous-waste-site-ciesin-mod-v2",
      "sectors": "",
      "legend_url": "http:\/\/sedac.ciesin.columbia.edu\/geoserver\/wms?request=GetLegendGraphic&LAYER=superfund:superfund-atsdr-hazardous-waste-site-ciesin-mod-v2&format=image\/png",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/superfund-atsdr-hazardous-waste-site-ciesin-mod-v2",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "taccimo",
      "folder": "Ecosystems",
      "name": "USFS Climate Change Atlas - Tree Species",
      "description": "Modeled importance value (IV) of 13 New York State native tree species for three climate conditions: 1) current climate (1961-1990 average); 2) future climate (2071-2100 average) with IPCC scenario B1 (significant conservation and reduction of CO2 emissions); and 3) future climate (2071-2100 average) with IPCC scenario A1FI (high emissions, no modification in current emission trends). Importance Value measures the dominance of a tree species in a forest, based on the relative frequency, density, and basal area of the species. For more information on the models and to explore more tree species and climate scenarios, visit the US Forest Service Climate Change Atlas: http://www.fs.fed.us/nrs/atlas/",
      "source": "USDA Forest Service Northern Research Station",
      "source_url": "http:\/\/www.fs.fed.us\/nrs\/atlas\/",
      "sectors": "Ecosystems",
      "legend_url": null,
      "download_url": null,
      "metadata_url": null,
      "parameters": {
        "opacity": 70,
        "species": 5,
        "scenario": 0
      }
    },
    {
      "id": "anthromes",
      "folder": "Land Cover",
      "name": "Anthropogenic Biomes",
      "description": "The Anthropogenic Biomes of the World Version 2 data set describes anthropogenic transformations within the terrestrial biosphere caused by sustained direct human interaction with ecosystems, including agriculture and urbanization circa the year 2000. Potential natural vegetation, biomes, such as tropical rainforests or grasslands, are based on global vegetation patterns related to climate and geology. Anthropogenic transformation within each biome is approximated using population density, agricultural intensity (cropland and pasture) and urbanization. The data, as part of a time series provide global patterns of historical transformation of the terrestrial biosphere during the Industrial Revolution. This data set is distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/anthromes-anthropogenic-biomes-world-v2-2000",
      "sectors": "Ecosystems, Agriculture, Buildings",
      "legend_url": "http:\/\/sedac.ciesin.columbia.edu\/geoserver\/wms?request=GetLegendGraphic&LAYER=anthromes:anthromes-anthropogenic-biomes-world-v2-1700&format=image\/png",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/anthromes-anthropogenic-biomes-world-v2-2000",
      "parameters": {
        "opacity": 70,
        "year": "2000"
      }
    },
    {
      "id": "croplands",
      "folder": "Agriculture",
      "name": "Global Croplands,2000",
      "description": "The Global Croplands dataset represents the proportion of land areas used as cropland (land used for the cultivation of food) in the year 2000. Satellite data from Modetate Resolution Imaging Spectroradiometer (MODIS) and Satellite Pour l'Observation de la Terre (SPOT) Image Vegetation sensor were combined with agricultural inventory data to create a global data set. The visual presentation of this data demonstrates the extent to which human land use for agriculture has changed the Earth and in which areas this change is most intense. The data was compiled by Navin Ramankutty , et. al. (2008) and distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/maps\/services#Global Agricultural Lands",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "fema_historic",
      "folder": "Water Resources",
      "name": "FEMA Historic Emergencies 1964-2014",
      "description": "This layer summarizes FEMA historic disaster declarations from 1964 through 2014, categorized by type.",
      "source": "FEMA",
      "source_url": "https:\/\/catalog.data.gov\/dataset\/fema-historical-disaster-declarations-shp",
      "sectors": "All Sectors",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:fema_historic&format=image/png"),
      "download_url": "http:\/\/gis.fema.gov\/kmz\/HistoricDeclarations.zip",
      "metadata_url": "https:\/\/www.fema.gov\/openfema-dataset-disaster-declarations-summaries-v1",
      "parameters": {
        "opacity": 70,
        "fema_historic_layer" : "0"
      }
    },
    {
      "id": "pastures",
      "folder": "Agriculture",
      "name": "Global Pastures,2000",
      "description": "The Global Pastures dataset represents the proportion of land areas used as pasture land (land used to support grazing animals) in the year 2000. Satellite data from Modetate Resolution Imaging Spectroradiometer (MODIS) and Satellite Pour l'Observation de la Terre (SPOT) Image Vegetation sensor were combined with agricultural inventory data to create a global data set. The visual presentation of this data demonstrates the extent to which human land use for agriculture has changed the Earth and in which areas this change is most intense. The data was compiled by Navin Ramankutty, et. al. (2008) and distributed by the Columbia University Center for International Earth Science Information Network (CIESIN).",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "http:\/\/sedac.ciesin.columbia.edu\/maps\/services#Global Agricultural Lands",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "vt_town_bridges",
      "folder": "Transportation",
      "name": "Town Bridges",
      "description": "BCVOBCIT is a statewide set of transportation structures, which includes town owned (maintained) bridges and culverts inventoried by Regional Planning Commissions, towns, and/or consultants. The BCVOBCIT dataset is limited to structures (bridges and culverts) maintained by municipalities, typically Town Shorts (TS) and Town Ultra-Shorts (TU).",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http:\/\/geodata.vermont.gov\/datasets\/vt-town-bridges-vobcit-extract",
      "sectors": "Transportation",
      "download_url": "https:\/\/opendata.arcgis.com\/datasets\/872f86b1f43a4077af2749a14e6b41f7_5.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "http:\/\/maps.vcgi.vermont.gov\/gisdata\/metadata\/TransStructures_BCVOBCIT.htm",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "vt_invasives",
      "folder": "Ecosystems",
      "name": "Invasives",
      "description": "The Invasive Species layer is created from the ANR Invasive Species database.",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://geodata.vermont.gov/datasets/VTANR::invasive-species-1",
      "sectors": "Ecosystems",
      "download_url": "https:\/\/opendata.arcgis.com\/datasets/b1ae7b7b110447c3b452d9cacffeed36_174.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https:\/\/www.arcgis.com\/sharing\/rest\/content\/items\/b1ae7b7b110447c3b452d9cacffeed36\/info\/metadata\/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "flood_hazard_areas",
      "folder": "Water Resources",
      "name": "FEMA Flood Hazard Areas",
      "description": "The entire Vermont extent of the National Flood Hazard Layer (NFHL) as acquired 12/15/15 from the FEMA Map Service Center msc.fema.gov upon publication 12/2/2015 and converted to VSP.The FEMA DFIRM NFHL database compiles all available officially-digitized Digital Flood Insurance Rate Maps. This extract from the FEMA Map Service Center includes all of such data in Vermont including counties and a few municipalities. This data includes the most recent map update for Bennington County effective 12/2/2015. DFIRM - Letter of Map Revision (LOMR) DFIRM X-Sections DFIRM Floodways Special Flood Hazard Areas (All Available)",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://geodata.vermont.gov/datasets/b40ccd85e9ca41989e7a803f48cf5bcb_57",
      "sectors": "Ecosystems",
      "download_url": "https://opendata.arcgis.com/datasets/b40ccd85e9ca41989e7a803f48cf5bcb_57.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/b40ccd85e9ca41989e7a803f48cf5bcb/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "dfirm_floodways",
      "folder": "Water Resources",
      "name": "DFIRM Floodways",
      "description": "The entire Vermont extent of the National Flood Hazard Layer (NFHL) as acquired 12/15/15 from the FEMA Map Service Center msc.fema.gov upon publication 12/2/2015 and converted to VSP.The FEMA DFIRM NFHL database compiles all available officially-digitized Digital Flood Insurance Rate Maps. This extract from the FEMA Map Service Center includes all of such data in Vermont including counties and a few municipalities. This data includes the most recent map update for Bennington County effective 12/2/2015. DFIRM - Letter of Map Revision (LOMR) DFIRM X-Sections DFIRM Floodways Special Flood Hazard Areas (All Available)",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://geodata.vermont.gov/datasets/f16c1addcbbc43f59ccf89237ccc0f64_59",
      "sectors": "Ecosystems",
      "download_url": "https://opendata.arcgis.com/datasets/f16c1addcbbc43f59ccf89237ccc0f64_59.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/f16c1addcbbc43f59ccf89237ccc0f64/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "hospitals",
      "folder": "Public Health",
      "name": "Hopsitals",
      "description": "This data layer contains point locations of all major community, regional, comprehensive health, and healthcare provider hospitals in the state of Vermont. The listing of current hospitals was obtained from the 1998/1999 & 2000/2001 Vermont Manufacturers' Directory, published annually by the Vermont Business Magazine. Included within the attributes of the database are Annual Sales Ranges, Employment numbers, and hospital contact information. This data layer does not include Psychiatric or Specialty hospitals. Many of the point locations of hospital sites were obtained from EmergencyE911_ESITE data layers and verified with checking USGS topographic quadrangle maps, while other point locations were captured from orthophotos or USGS topographic quadrangle maps directly.",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://geodata.vermont.gov/datasets/vt-hospital-site-locations",
      "sectors": "Ecosystems",
      "download_url": "https://opendata.arcgis.com/datasets/128c419772234581ac4209e4e429f882_5.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "http://maps.vcgi.vermont.gov/gisdata/metadata/FacilitiesHospitals_HOSPITAL.htm",
      "parameters": {
        "opacity": 70
      }
    }
    /*{
      "id": "cfem_critical",
      "folder": "Coastal Zones",
      "name": "HAZUS Critical Facilities",
      "description": "Selected facilities and structures along the Atlantic and Gulf coasts that, if flooded, would present an immediate threat to life, public health, or safety.",
      "source": "NOAA Office For Coastal Management",
      "source_url": "http:\/\/catalog.data.gov\/dataset\/fema-hazus-critical-facilities-for-coastal-geographies",
      "sectors": "Public Health,Coastal Zones",
      "download_url": null,
      "metadata_url": "http:\/\/catalog.data.gov\/dataset\/fema-hazus-critical-facilities-for-coastal-geographies",
      "parameters": {
        "opacity": 90
      }
    },
    {
      "id": "power_stations",
      "folder": "Energy",
      "name": "Power Plants",
      "description": "Power plants, by fuel type.",
      "source_url": "http://www.eia.gov/state/?sid=NY",
      "sectors": "Energy",
      "download_url": null,
      "metadata_url": "https://eia-ms.esri.com/arcgis/rest/services/20150824StateEnergyProfilesMap/MapServer/6",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "gap_lc",
      "folder": "Land Cover",
      "name": "GAP Land Cover Dataset",
      "description": "GAP Land Cover 3 National Vegetation Classification-Formation Land Use for the contiguous United States. For more information about the National Vegetation Classification Standard please visit this link: http://usnvc.org/data-standard/",
      "source": "USGS",
      "source_url": "https://catalog.data.gov/dataset/u-s-geological-survey-gap-analysis-program-land-cover-data-v2-2",
      "sectors": "Agriculture,Ecosystems",
      "download_url": null,
      "metadata_url": "https://gis1.usgs.gov/arcgis/rest/services/gap/GAP_Land_Cover_NVC_Class_Landuse/MapServer",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "sandysurge",
      "folder": "Coastal Zones",
      "name": "Hurricane Sandy Surge Extent",
      "description": "Final High Resolution (3 and 1 meter) Hurricane Sandy Storm Surge Extents, Field Verified HWMs and SSs Data 0214 ",
      "source": "FEMA",
      "source_url": "http:\/\/services.femadata.com\/",
      "sectors": "All",
      "download_url": null,
      "metadata_url": "http:\/\/services.femadata.com\/arcgis\/rest\/services\/2012_Sandy\/SurgeBoundaries_Final_0214\/MapServer",
      "parameters": {
        "opacity": 70,
        "resolution": "0"
      }
    },
    {
      "id": "dewberry_slr",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (Dewberry)",
      "description": "NYSERDA has developed data resources for a range of future coastal flooding conditions in order to improve the ability of local and state officials, and others to assess vulnerability and inform resiliency planning. The table below provides estimated sea level rise projections by decade under low, median, and high scenarios and are representative of sea level rise projections found in the 2014 Supplement to the ClimAID Integrated Assessment for Effective Climate Change Adaptation. The Coastal New York Future Floodplain Mapper provides information for seven of these scenarios (12, 18, 24, 36, 48, 60, and 72 inches).",
      "source": "NYSERDA",
      "source_url": "http:\/\/services.nyserda.ny.gov\/SLR_Viewer\/About",
      "sectors": "All",
      "legend_url": "./img\/dewberry_slr.png",
      "download_url": null,
      "metadata_url": "http:\/\/appealsserver.cloudapp.net\/arcgis\/rest\/services\/NYSERDA\/NYSERDA_SLR_Service\/MapServer",
      "parameters": {
        "opacity": 70,
        "rise": 0,
        "year": 0
      }
    },
    {
      "id": "noaa_slr",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (NOAA)",
      "description": "Sea Level Rise: the maps show inland extent and relative depth of inundation from 0 to 6 feet above mean higher high water (MHHW). Areas that are hydrologically connected (according to the digital elevation model used) are shown in shades of blue. Low-lying areas, displayed in green, are considered hydrologically “unconnected” areas that may flood. The inundation maps are created by subtracting the NOAA VDATUM MHHW surface from the digital elevation model. Mapping Confidence: blue areas denote a high confidence of inundation, orange areas denote a low confidence of inundation, and unshaded areas denote a high confidence that these areas will be dry given the chosen water level.",
      "source": "NOAA",
      "source_url": "http:\/\/coast.noaa.gov\/slr\/",
      "sectors": "All",
      "legend_url": null,
      "download_url": null,
      "metadata_url": "https:\/\/coast.noaa.gov\/digitalcoast\/tools\/slr",
      "parameters": {
        "opacity": 70,
        "sea_level_height": 0,
        "display_layer" : "slr" // conf
      }
    },
    {
      "id": "nyserda_slr",
      "folder": "Coastal Zones",
      "name": "Sea Level Rise (SIT/Columbia)",
      "description": "Sea level and storm surge predictions for the lower Hudson River, based on model simulations developed for NYSERDA.",
      "source": "Stevens Institute of Technology/Columbia University/NYSERDA",
      "source_url": "http:\/\/ciesin.columbia.edu\/geoserver\/ows?service=wms&version=1.3.0&request=GetCapabilities",
      "sectors": "Coastal Zones",
      "legend_url": null,
      "download_url": "http://www.ciesin.columbia.edu/hudson-river-flood-map/",
      "metadata_url": "https:\/\/github.com\/matthiasmengel\/sealevel",
      "parameters": {
        "opacity": 70,
        "rise": "00",
        "year": "1000"
      }
    },
    /*
    {
      "id": "narccap_precip",
      "folder": "Climate Data.Precipitation",
      "name": "NARCCAP Precipitation Projections",
      "description": "NARCCAP projected changes in average precipitation summarized by year and NYS county, from 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html",
      "source": "ACIS",
      "source_url": "http:\/www.rcc-acis.org",
      "sectors": "",
      "download_url": null,
      "metadata_url": "http:\/\/www.narccap.ucar.edu",
      "parameters": {
        "opacity": 70,
        "area" : "county",
        "date_step": 10,
        "date" : 2039,
        "season" : "ANN"
      }
    },
    {
      "id": "narccap_temp",
      "folder": "Climate Data.Temperature",
      "name": "NARCCAP Temperature Projections",
      "description": "NARCCAP projected changes in average minimum, maximum, and average temperature summarized by year and county, for the years 2039 to 2069.Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html ",
      "source": "ACIS",
      "source_url": "http:\/www.rcc-acis.org",
      "sectors": "",
      "download_url": null,
      "metadata_url": "http:\/\/www.narccap.ucar.edu",
      "parameters": {
        "opacity": 70,
        "area" : "county",
        "date" : 2039,
        "date_step": 10,
        "prod" : "avgt",
        "season" : "ANN"
      }
    },
    {
      "id": "climaid_temp",
      "folder": "Climate Data.Temperature",
      "name": "CLIMAID Temperature Change",
      "description": "Future temperature projections developed for and utilized by the New York ClimAID Report. Projected temperature change for the years 2020, 2050, and 2080, compared with the baseline period of 1971-2000, at a 50x50km resolution. Projections are available for two different emissions scenarios, RCP 4.5 (substantial reductions in GHG emissions before 2100) and RCP 8.5 (increasing GHG emissions with time). Users can select results by percentiles. For example, the 75th percentile means that 75 percent of the model results are lower in value (and 25 percent are higher).",
      "source": "CLIMAID",
      "source_url": "http:\/\/www.nyserda.ny.gov\/climaid",
      "sectors": "",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:climaid_temp_deltas&format=image/png"),
      "download_url": null,
      "metadata_url": "",
      "parameters": {
        "opacity": 70,
        "timestep": "2020",
        "percentile" : "mean",
        "scenario" : "45", // conf
        "symbology": "scenario"
      }
    },
    {
      "id": "climaid_precip",
      "folder": "Climate Data.Precipitation",
      "name": "CLIMAID Precipitation Change",
      "description": "Future precipitation projections developed for and utilized by the New York ClimAID Report. Projected precipitation change for the years 2020, 2050, and 2080, compared with the baseline period of 1971-2000. Projections are available for two different emissions scenarios, RCP 4.5 (substantial reductions in GHG emissions before 2100) and RCP 8.5 (increasing GHG emissions with time). Users can select results by percentiles. For example, the 75th percentile means that 75 percent of the model results are lower in value (and 25 percent are higher).",
      "source": "CLIMAID",
      "source_url": "http:\/\/www.nyserda.ny.gov\/climaid",
      "sectors": "",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:climaid_temp_deltas&format=image/png"),
      "download_url": null,
      "metadata_url": "",
      "parameters": {
        "opacity": 70,
        "timestep": "2020",
        "percentile" : "mean",
        "scenario" : "45", // conf
        "symbology": "scenario"
      }
    },
    {
      "id": "ghg_facilities",
      "folder": "Air Emissions",
      "name": "GHG Emissions from Large Facilities",
      "description": "Greenhouse gas emissions data, extracted from EPA's FLIGHT Tool. The data was reported to EPA by facilities as of 08/16/2015. All emissions data is presented in units of metric tons of carbon dioxide equivalent (CO2e) using GWP's from IPCC's AR4. ",
      "source": "EPA Facility Level Information on GeeenHouse gases Tool (FLIGHT)",
      "source_url": "http:\/\/ghgdata.epa.gov\/ghgp\/main.do",
      "sectors": "Energy",
      "download_url": null,
      "metadata_url": null,
      "parameters": {
        // Don't do opacity, they are markers.
        "opacity": false,
        "no_sorting": true
      }
    },
    {
      "id": "hospital",
      "folder": "Public Health",
      "name": "Hospitals",
      "description": "Hospitals in New York State, based on NYS Department of Health data.",
      "source": "New York State Department of Health",
      "source_url": "http:\/\/www.health.ny.gov",
      "sectors": "Public Health",
      "download_url": "http:\/\/maps.nysprofile.ipro.org\/live\/php\/data.php?table=hospitals",
      "metadata_url": "http:\/\/profiles.health.ny.gov\/hospital",
      "parameters": {
        // Don't do opacity, they are markers.
        "opacity": false,
        "no_sorting": true
      }
    },
    {
      "id": "dams",
      "folder": "Water Resources",
      "name": "Dams",
      "description": "Location of dams in New York State, with selected attributes of each dam, including relative risk level." +
        "(http://www.dec.ny.gov/docs/water_pdf/togs315.pdf)",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1130",
      "sectors": "Water Resources",
      "download_url": "http:\/\/www.dec.ny.gov\/maps\/nysdamslink.kmz",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.dams_KML.xml",
      "parameters": {
        // Don't do opacity, they are markers.
        "opacity": false,
        "no_sorting": true
      }
    },
    {
      "id": "carbon",
      "folder": "Ecosystems",
      "name": "Biomass Carbon Stock",
      "description": "Current (2010) and projected future (2050) biomass carbon stock (grams of carbon per square meter) for two different emissions scenarios: IPCC A2 (medium-high emissions) and IPCC B1 (lower emissions). Biomass carbon includes carbon stored in above- and below-ground live plant components (such as leaf, branch, stem and root) as well as in standing and down dead woody debris, and fine litter.",
      "source": "landcarbon.org",
      "source_url": "http:\/\/landcarbon.org\/categories\/biomass-c\/download\/",
      "sectors": "Ecosystems",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:biomass_a2_2010&format=image/png"),
      "download_url": null,
      "metadata_url": null,
      "parameters": {
        "scenario_year": "a2_2010",
        "opacity": 100
      }
    },
    {
      "id": "trout_streams",
      "folder": "Ecosystems",
      "name": "Designated Trout Streams",
      "description": "New York State Department of Environmental Conservation Water Quality Classifications dataset. The symbol (T or TS) after any class designation means that designated waters are trout waters (T) or suitable for trout spawning (TS).",
      "source": "NYS DEC",
      "source_url": "https://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1118",
      "sectors": "Ecosystems",
      "legend_url": CDN("http://52.2.5.122:8080/geoserver/wms?request=GetLegendGraphic&LAYER=nyccsc:trout_streams&format=image/png"),
      "download_url": null,
      "metadata_url": null,
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "wtrcls_line",
      "folder": "Water Resources",
      "name": "DEC Water Quality Classifications-Lines",
      "description": "This NYS DEC data set provides the water quality classifications of New York State's lakes, rivers, streams and ponds, collectively referred to as water bodies. All water bodies in the state are provided a water quality classification based on existing, or expected best usage, of each water body or water body segment. Under New York State's Environmental Conservation Law (ECL), Title 5 of Article 15, certain waters of the state are protected on the basis of their classification. Streams and small water bodies located in the course of a stream that are designated as C (T) or higher (i.e., C (TS), B, or A) are collectively referred to as 'protected streams.'",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1118",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:wtrcls_line&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1118&file=nysdec_wtrcls.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.wtrcls.xml",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "wtrcls_poly",
      "folder": "Water Resources",
      "name": "DEC Water Quality Classifications-Polygons",
      "description": "This NYS DEC data set provides the water quality classifications of New York State's lakes, rivers, streams and ponds, collectively referred to as water bodies. All water bodies in the state are provided a water quality classification based on existing, or expected best usage, of each water body or water body segment. Under New York State's Environmental Conservation Law (ECL), Title 5 of Article 15, certain waters of the state are protected on the basis of their classification. Streams and small water bodies located in the course of a stream that are designated as C (T) or higher (i.e., C (TS), B, or A) are collectively referred to as 'protected streams.'",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1118",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:wtrcls_poly&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1118&file=nysdec_wtrcls.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.wtrcls.xml",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "dow_uncon_aqui_main",
      "folder": "Water Resources",
      "name": "Aquifers- Unconsolidated",
      "description": "These aquifers include those in upstate NY that consist of sand and gravel and yield large supplies of water to wells. Bedrock aquifers, although significant in some areas, are not included here. Source data is 1:250,000, same scale as the NYS Geological Survey surficial and bedrock geology maps on which they were based. Together these maps form a consistent set of geologic and groundwater maps for use in regional management of the groundwater resources of the State. Long Island is represented in the separate 'Hydrogeologic Framework at 1:250,000 - Long Island, NY', published by USGS/NYSDEC. ",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1141",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:dow_uncon_aqui_main&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1141&file=dow_uncon_aqui.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.uncon_aqui.html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "primary_aquifers",
      "folder": "Water Resources",
      "name": "Aquifers- Primary",
      "description": "This layer shows the location of primary aquifers in New York State. Primary aquifers are highly productive aquifers presently being utilized as sources of water supply by major municipal water supply systems.",
      "source": "NYS DEC",
      "source_url": "http:\/\/gis.ny.gov/gisdata\/inventories\/details.cfm?DSID=1232",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:primary_aquifers&format=image\/png"),
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1232&file=primaryaquifers.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.primary.aquifers.shp.xml",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "dec_wetlands",
      "folder": "Ecosystems",
      "name": "Regulatory Wetlands",
      "description": "The State Legislature passed The Freshwater Wetlands Act (PDF) (129 kB)(Act) in 1975 with the intent to preserve, protect and conserve freshwater wetlands and their benefits, consistent with the general welfare and beneficial economic, social and agricultural development of the state. To be protected under the Freshwater Wetlands Act, a wetland must be 12.4 acres (5 hectares or larger). Wetlands smaller than this may be protected if they are considered of unusual local importance. Around every wetland is an 'adjacent area' of 100 feet that is also regulated to provide protection for the wetland. A permit is required to conduct any regulated activity in a protected wetland or its adjacent area. Wetlands shown on the DEC maps usually are also regulated by the Corps, but the Corps also regulates additional wetlands not shown on the DEC maps. Different wetlands provide different functions and benefits and in varying degrees. The Act requires DEC to rank wetlands in classes based on the benefits and values provided by each wetland. The wetland class helps to determine the best uses for each wetland. Higher class wetlands provide the greatest level of benefits and are afforded a higher level of protection. Lower class wetlands still provide important functions and benefits, but typically require less protection to continue to provide these functions.Digital wetlands data are not official regulatory maps and are subject to change.",
      "source": "NYS DEC",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": "Ecosystems,Water Resources",
      "legend_url": null,
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/136",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "lulc_2011",
      "folder": "Land Cover",
      "name": "NY Land Use/Land Class (2011)",
      "description": "Current (2011) land use / land cover map of NY State, from the ClimAID Natural Resource Navigator site.",
      "source": "NYS",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": "Ecosystems",
      "legend_url": null,
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/209",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "lulc_2050",
      "folder": "Land Cover",
      "name": "NY Land Use/Land Class (2050)",
      "description": "Predicted future (2050) land use / land cover map of NY State, from the ClimAID Natural Resource Navigator site.",
      "source": "NYS",
      "source_url": "http:\/\/maps.naturalresourcenavigator.org",
      "sectors": "Ecosystems",
      "legend_url": null,
      "download_url": null,
      "metadata_url": "http:\/\/services.coastalresilience.org\/arcgis\/rest\/services\/New_York\/NY_CLIMAD_toolkit\/MapServer/208",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "sovi",
      "folder": "Public Health",
      "name": "Social Vulnerability Index for U.S. Coastal States",
      "description": "The Social Vulnerability Index (SoVI) 2006-10 measures the social vulnerability of U.S. counties to environmental hazards. The index is a comparative metric that facilitates the examination of the differences in social vulnerability among counties. SoVI is a valuable tool for policy makers and practitioners. It graphically illustrates the geographic variation in social vulnerability. It shows where there is uneven capacity for preparedness and response and where resources might be used most effectively to r",
      "source": "NOAA Office For Coastal Management",
      "source_url": "http:\/\/catalog.data.gov\/dataset\/social-vulnerability-index-sovi-for-the-u-s-coastal-states-based-on-the-2010-census-tracts",
      "sectors": "Water Resources,Coastal Zones",
      "download_url": null,
      "metadata_url": "http:\/\/catalog.data.gov\/dataset\/social-vulnerability-index-sovi-for-the-u-s-coastal-states-based-on-the-2010-census-tracts",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "spdes",
      "folder": "Water Resources",
      "name": "Waste Treatment Plants",
      "description": "The State Pollutant Discharge Elimination System (SPDES) permit program in the Department's Division of Water regulates municipal and industrial wastewater treatment facilities that discharge directly into navigable waters. ",
      "source": "NYS DEC",
      "source_url": "https:\/\/gis.ny.gov\/gisdata\/inventories\/details.cfm?DSID=1010",
      "sectors": "Water Resources,Public Health",
      "legend_url": "./img\/spdes.png",
      "download_url": "https:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=1010&file=spdes.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.spdes.xml",
      "parameters": {
        // No Opacity, b/c it doesn't work on the markers.
        "opacity": false,
        "no_sorting": true
      }
    },
    {
      "id": "remediation_sites",
      "folder": "Miscellaneous",
      "name": "Remediation Sites",
      "description": "The points in this file represent only the existence of a site which has cleanup currently, or has undergone cleanup under the oversight of NYS DEC. This dataset includes a single point location for a subset of sites which are currently included in one of the Remedial Programs being overseen by the Division of Environmental Remediation.",
      "source": "NYS DEC",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1097",
      "sectors": "Public Health",
      "legend_url": CDN("http:\/\/52.2.5.122:8080\/geoserver\/wms?request=GetLegendGraphic&LAYER=nyccsc:remediation_sites&format=image/png"),
      "download_url": "ftp:\/\/ftp.dec.state.ny.us\/der\/FOIL\/RemedialGIS.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/nysdec.remedsite_borders_export.html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "sewer_overflows",
      "folder": "Water Resources",
      "name": "Sewer Overflows",
      "description": "The dataset represents the locations of combined sewer overflow (CSOs) outfall locations in NYS. It also includes overflow detection capabilities of CSO communities and overflow frequency data within a specified timeframe.",
      "source": "NYS Office of Information Technology Services",
      "source_url": "https:\/\/data.ny.gov\/Energy-Environment\/Combined-Sewer-Overflows-CSOs-Map\/i8hd-rmbi",
      "sectors": "Water Resources,Public Health",
      "legend_url": "./img\/sewer-overflows.png",
      "download_url": "https:\/\/data.ny.gov\/resource\/5d4q-pk7d.geojson",
      "metadata_url": "https:\/\/data.ny.gov\/Energy-Environment\/Combined-Sewer-Overflows-CSOs-Map\/i8hd-rmbi",
      "parameters": {
        // No Opacity, b/c it doesn't work on the markers.
        "opacity": false,
        "no_sorting": true
      }
    },
    {
      "id": "subway_lines",
      "folder": "Transportation",
      "name": "NYC Subways",
      "description": "NY Metropolitan Subway Lines",
      "source": "Spatiality Blog",
      "source_url": "http:\/\/spatialityblog.com\/2010\/07\/08\/mta-gis-data-update\/#datalinks",
      "sectors": "Transportation",
      "download_url": "https:\/\/wfs.gc.cuny.edu\/SRomalewski\/MTA_GISdata\/June2010_update\/nyctsubwayroutes_100627.zip",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "railroad",
      "folder": "Transportation",
      "name": "Railroads",
      "description": "Line shapefile of active railroad lines. UTM NAD 83 Zone 18. Copyright 2001 by NYS Dept of Transportation.",
      "source": "NYS DOT",
      "source_url": "https:\/\/www.dot.ny.gov\/index",
      "sectors": "Transportation",
      "download_url": "http:\/\/gis.ny.gov\/gisdata\/fileserver\/?DSID=904&file=NYSDOTRailroad_May2013.zip",
      "metadata_url": "http:\/\/gis.ny.gov\/gisdata\/metadata\/dot.Railroad.shp.xml",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "peja",
      "folder": "Public Health",
      "name": "Potential Environmental Justice Areas",
      "description": "As established in DEC Commissioner Policy 29 on Environmental Justice and Permitting (CP-29), Potential EJ Areas are 2000 U.S. Census block groups of 250 to 500 households each that, in the 2000 Census, had populations that met or exceeded at least one of the following statistical thresholds: 1) At least 51.1% of the population in an urban area reported themselves to be members of minority groups; or 2) At least 33.8% of the population in a rural area reported themselves to be members of minority groups; or 3) At least 23.59% of the population in an urban or rural area had household incomes below the federal poverty level.",
      "source": "NYS DEC",
      "source_url": "http:\/\/www.dec.ny.gov\/public\/899.html",
      "sectors": "Public Health",
      "download_url": "http:\/\/www.dec.ny.gov\/maps\/pejalink.kmz",
      "metadata_url": "http:\/\/www.dec.ny.gov\/public\/899.html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "usgs_streamflow",
      "folder": "Water Resources",
      "name": "USGS Stream Gages",
      "description": "This layer depicts the location and current status of US Geological Survey stream gauges across NYS. An active link with the USGS database provides real-time data, updated hourly.  For more information on a specific guage, click on the map icon, which will provide detailed information and a link to the USGS page for that gauge.",
      "source": "USGS",
      "source_url": "http:\/\/waterwatch.usgs.gov\/index.php?r=ny&id=ww_current",
      "sectors": "Water Resources",
      "download_url": "http:\/\/waterwatch.usgs.gov\/download\/?gt=map&mt=real&st=ny&dt=site&ht=&fmt=csv",
      "metadata_url": "http:\/\/waterwatch.usgs.gov\/index.php?r=ny&id=ww_current",
      "parameters": {
        // No Opacity, b/c it doesn't work on the markers.
        "no_sorting": true,
        "opacity": 70
      }
    },
    {
      "id": "boundary_climate_divisions",
      "folder": "Boundaries",
      "name": "NOAA Climate Divisions",
      "description": "NOAA Climate Divisions for New York State.  Clicking on a climate division will provide links to NOAA web resources where temperature and precipitation data may be queried for that division.",
      "source": "NOAA",
      "source_url": "http://www.ncdc.noaa.gov/monitoring-references/maps/us-climate-divisions.php",
      "metadata_url": "",
      "download_url": "",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "boundary_municipal",
      "folder": "Boundaries",
      "name": "Municipalities",
      "description": "Towns, villages, hamlets, boroughs and other municipalities of New York State.",
      "source": "NY",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "boundary_counties",
      "folder": "Boundaries",
      "name": "Counties",
      "description": "TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.   These boundary files are specifically designed for small scale thematic mapping. ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "metadata_url": "https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html",
      "download_url": "http://www2.census.gov/geo/tiger/GENZ2013/cb_2013_us_county_500k.zip",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "regulated_wells",
      "folder": "Energy",
      "name": "Regulated Wells",
      "description": "This dataset contains locations of regulated wells. The Division of Mineral Resources maintains information and data on over 40,000 wells, categorized under New York State Article 23 Regulated wells. The dataset reflects the status of the wells as of the previous business day. The location data has not been field verified but is expected to be within 100 meters of the actual well location. The data should not be used for precise determination of distances to buildings, property boundaries or other features. This is a public dataset. Wells currently afforded confidential status are plotted but confidential data is redacted. ",
      "source": "GIS NY State",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1272",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/nysdec.dmn.oil.gas.well.forportal_prod.xml",
      "sectors": "",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "water_wells",
      "folder": "Water Resources",
      "name": "Water Wells",
      "description": "This file shows locations and attributes for water wells in New York State. This information has been collected by DEC since April 2000 as required by law. ",
      "source": "GIS NY State",
      "source_url": "http://gis.ny.gov/gisdata/inventories/details.cfm?DSID=1203",
      "metadata_url": "http://gis.ny.gov/gisdata/metadata/nysdec.WaterWells.xml",
      "sectors": "",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "invasive_plants",
      "folder": "Ecosystems",
      "name": "Invasive Plant Species",
      "description": "Summary of observations of mapped locations of invasive plants by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_plants.json",
      "sectors": "Ecosystems, Transportation, Coastal Zones",
      "parameters": {
        "opacity": 70,
        "species": "All Plants",
        "area" : "county"
      }
    },
    {
      "id": "invasive_animals",
      "folder": "Ecosystems",
      "name": "Invasive Animal Species",
      "description": "Summary of observations of mapped occurrence of invasive animals, including mammals, fish and bivalves, by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_animals.json",
      "sectors": "Ecosystems, Transportation, Coastal Zones",
      "parameters": {
        "opacity": 70,
        "species": "All Animals",
        "area" : "county"
      }
    },
    {
      "id": "invasive_insects",
      "folder": "Ecosystems",
      "name": "Invasive Insect Species",
      "description": "Summary of observations of mapped occurrence of invasive or exotic insect pests by county for New York State, provided by iMapInvasives NY -- New York's Online Invasive Species Database and Mapping System (http://imapinvasives.org) © 2016 NatureServe",
      "source": "iMapInvasives",
      "source_url": "http://imapinvasives.org",
      "metadata_url": "http://www.imapinvasives.org/new-yorklogin",
      "download_url": "http://52.2.5.122:8080/geoserver/www/invasive_insects.json",
      "sectors": "Ecosystems, Transportation, Coastal Zones",
      "parameters": {
        "opacity": 70,
        "species": "All Insects",
        "area" : "county"
      }
    },
    {
      "id": "rare_plants_and_animals",
      "folder": "Ecosystems",
      "name": "Rare Plants and Animals",
      "description": "NHP Predicted Future/Current/Delta Species Richness - Species richness of rare species (# species) within each 30m grid cell within NY State for rare species tracked by the NY Natural Heritage Program. Data represent total species or broken down by taxonomic or regulatory groups, based on predicted suitable habitat occurring under current or future climatic and landuse conditions using EDM models developed by NYNHP. Changes in species richness represent the difference between future and current predicted richness. These data represent predicted species richness assuming species precense within predicted suitable habitat. These data do not represent actual species richness based on known occurances.",
      "source": "'Natural Resource Navigator / NY Climate Adaptation",
      "source_url": "http://maps.naturalresourcenavigator.org/",
      "metadata_url": "",
      "sectors": "Ecosystems",
      "parameters": {
        "opacity": 70,
        "time": "Current",  // Future, Current, Change
        "species_group": "All"
      }
    },
    {
      "id": "extreme_precip",
      "folder": "Climate Data.Precipitation",
      "name": "Extreme Precipitation",
      "description": "Natural Heritage Program: Predicted Future and Current Extreme Precipitation Events.  1) Average predicted future return frequency (in years) of a storm event with a precipitation magnitude matching that of a current 10 or 100-year event. 2)Average predicted percent increase in future precipitation amount for 10 and 100-year storm events (1 day duration). 3) Current magnitude of a 10 and 100-year precipitation event (1 day duration) in inches. (Raw data in thousandths of an inch.)",
      "source": "'Natural Resource Navigator / NY Climate Adaptation",
      "source_url": "http://maps.naturalresourcenavigator.org/",
      "metadata_url": null,
      "sectors": "Water Resources",
      "parameters": {
        "opacity": 70,
        "time": "Current Magnitude",  // Future, Current, Change
        "event_type": "10 Year Event"
      }
    }
    */
  ];
