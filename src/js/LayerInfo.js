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

var LayerInfo = [
    {
      "id": "vt_health_status",
      "sort_key": 0,
      "folder": "Public Health",
      "name": "VT Health Status",
      "description": "Vermont tracks adult health-related risk behaviors, chronic health conditions, and use of preventive services using a telephone survey called the Behavioral Risk Factor Surveillance Survey (BRFSS). This layer shows self-reported health status data, taken from BRFSS data, and aggregated in two-year increments at the county level. In this question, Vermonters were asked to rank their health as either excellent, very good, good, fair, or poor. This layer contains data on the percent of Vermonters, by county, who reported their health as fair or poor. ",
      "source": "Vermont Behavioral Risk Factor Surveillance Survey",
      "source_url": "http://www.healthvermont.gov/health-statistics-vital-records/population-health-surveys-data/brfss",
      "download_url": "https://www.arcgis.com/home/item.html?id=6cae19331d454eacadf44da496e07bd4",
      "metadata_url": "https://services.arcgis.com/YKJ5JtnaPQ2jDbX8/arcgis/rest/services/Vermont_Health_Status_BRFSS/FeatureServer/0",
      "sectors": "",
      "parameters": {
        "opacity": 70,
        "facet_index": 12,
      }
    },
    {
      "id": "vt_social_vuln",
      "sort_key": 0,
      "folder": "Public Health",
      "name": "VT Social Vulnerability",
      "description": "Social vulnerability refers to the resilience of communities when responding to or recovering from threats to public health. The Vermont Social Vulnerability Index is a planning tool to evaluate the relative social vulnerability across the state. It can be used if there is a disease outbreak or in the event of an emergency—either natural or human-caused—to identify populations that may need more help. The Vermont Social Vulnerability Index draws together 16 different measures of vulnerability in three different themes: socioeconomic, demographic, and housing/transportation. For every measure, census tracts above the 90th percentile, or the most vulnerable 10%, are assigned a flag. The vulnerability index is created by counting the total number of flags in each census tract. The higher the count, the more vulnerable the population.",
      "source": "",
      "source_url": "http://geodata.vermont.gov/datasets/ea4359cfef7d4527b87a9e0a4eb8120a",
      "download_url": "https://ahs-vt.maps.arcgis.com/sharing/rest/content/items/af020f957afa471db8b2857c9b026d3c/data",
      "metadata_url": "https://ahs-vt.maps.arcgis.com/sharing/rest/content/items/3b7bbc5f66684cde98c92d963a53e155/data",
      "sectors": "",
      "parameters": {
        "opacity": 70,
        "facet_index": 0,
      }
    },
    {
      "id": "aadt",
      "sort_key": 0,
      "folder": "Infrastructure",
      "name": "Traffic",
      "description": "",
      "source": "",
      "source_url": "",
      "sectors": "",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "vt_boundary",
      "sort_key": 0,
      "folder": "Boundaries",
      "name": "VT State Boundary",
      "description": "This layer shows the Vermont State Boundary.  Derived from TIGER 2013 Simplified County Boundaries, designed for 1:500k or smaller.  The cartographic boundary files are simplified representations of selected geographic areas from the Census Bureau’s MAF/TIGER geographic database.  ",
      "source": "US Census Bureau",
      "source_url": "https://www.census.gov/en.html",
      "sectors": "",
      "active_on_load": true,
      "parameters": {
        "opacity": 25,
        "color": "#000",
        "no_sorting": true
      }
    },
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
        "style": "vt_mask_black",
        "opacity": 50,
        "no_sorting": true
      }
    },
    {
      "id": "boundary_huc8",
      "folder": "Boundaries",
      "name": "Major Watersheds",
      "description": "The Watershed Boundary Dataset (WBD) defines the areal extent of surface water drainage to a point, accounting for all land and surface areas. Watershed Boundaries are determined solely upon science-based hydrologic principles, not favoring any administrative boundaries or special projects, nor particular program or agency. The intent of defining Hydrologic Units (HU) for the Watershed Boundary Dataset is to establish a baseline drainage boundary framework, accounting for all land and surface areas. At a minimum, the WBD is being delineated and georeferenced to the USGS 1:24,000 scale topographic base map meeting National Map Accuracy Standards (NMAS). Hydrologic units are given a Hydrologic Unit Code (HUC).",
      "source": "USDA",
      "source_url": "https://datagateway.nrcs.usda.gov/GDGOrder.aspx?order=QuickState",
      "metadata_url": "https://gdg.sc.egov.usda.gov/Catalog/ProductDescription/WBD.html",
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
      "id": "culverts",
      "folder": "Infrastructure",
      "name": "Culverts",
      "description": "Statewide list of transportation structures, which includes town owned (maintained) culverts inventoried by Regional Planning Commissions, towns, and/or consultants. The dataset is limited to structures (bridges and culverts) maintained by municipalities, typically Town Shorts (TS) and Town Ultra-Shorts (TU).",
      "source": "US Census Bureau",
      "source_url": "geodata.vermont.gov/datasets/vt-town-bridges-vobcit-extract",
      "metadata_url": "https://opendata.arcgis.com/datasets/872f86b1f43a4077af2749a14e6b41f7_5.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "download_url": "maps.vcgi.vermont.gov/gisdata/metadata/TransStructures_BCVOBCIT.htm",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "lyme",
      "folder": "Public Health",
      "name": "Lyme Disease Incidence Per 100,000 Persons, 2015",
      "description": "This data layer shows county-level Lyme disease incidence for the year 2015. Incidence rates are displayed as the number of cases per 100,000 persons, per year. Lyme disease is caused by a bacterium (Borrelia burgdorferi) that is transmitted by blacklegged ticks (Ixodes scapularis). To survive and reproduce, ticks require forest cover and hosts to feed on, including mice and deer. Blacklegged ticks and their hosts also require a suitable climate. Warmer temperatures can speed the tick life cycle, and make them more likely to reproduce, and warmer winter temperatures also may make it easier for ticks and their hosts to survive through the cold season. ",
      "sectors": "Public Health",
      "source": "Vermont Department of Health",
      "source_url": "http://www.healthvermont.gov/immunizations-infectious-disease/mosquito-tick-zoonotic-diseases/lyme-disease",
      "metadata_url": null,
      "download_url": null,
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "prism_temp",
      "folder": "Climate Data.Temperature",
      "name": "Historical Temperatures 1980-2014",
      "description": "Gridded 4km resolution monthly temperature data averaged over the period 1980 to 2014 for two different user-selected spatial units in Vermont: counties and HUC8 watersheds. Data are adapted from publicly-available datasets from the PRISM Climate Group at Oregon State University.",
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
      "name": "Historical Precipitation 1980-2014",
      "description": "Gridded 4km resolution monthly precipitation data averaged over the period 1980 to 2014 for two different user-selected spatial units in Vermont: counties and HUC8 watersheds. Data are adapted from publicly-available datasets from the PRISM Climate Group at Oregon State University.",
      "source": "PRISM",
      "source_url": "http:\/\/www.prism.oregonstate.edu",
      "sectors": "All",
      "download_url": null,
      "metadata_url": "http:\/\/www.prism.oregonstate.edu",
      "parameters": {
        "opacity": 70,
        "area" : "county",
        "season" : "ANN"
      }
    },
    {
      "id": "narccap_precip",
      "folder": "Climate Data.Precipitation",
      "name": "Seasonal/Annual Precipitation Projections",
      "description": "NARCCAP (North American Regional Climate Change Assessment Program) projected changes in average precipitation summarized by year, season, watershed and county from 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html ",
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
      "id": "narccap_precip_days",
      "folder": "Climate Data.Precipitation",
      "name": "Days > Threshold Projections",
      "description": "NARCCAP (North American Regional Climate Change Assessment Program) projected days/year of precipitation above or below threshold values, summarized by year and county, for the years 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html ",
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
        "prod": "pcpn_1",
        "season" : "ANN"
      }
    },
    {
      "id": "narccap_temp",
      "folder": "Climate Data.Temperature",
      "name": "Seasonal/Annual Temperature Projections",
      "description": "NARCCAP (North American Regional Climate Change Assessment Program) projected changes in average minimum, maximum, and average temperature summarized by year and county, for the years 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html ",
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
      "id": "narccap_degree_days",
      "folder": "Climate Data.Temperature",
      "name": "Degree-day Accumulation Projections",
      "description": "NARCCAP (North American Regional Climate Change Assessment Program) projected degree-day accumulations, summarized by year and county, for the years 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html",
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
        "prod": "gdd50",
        "season" : "ANN"
      }
    },
    {
      "id": "narccap_temp_days",
      "folder": "Climate Data.Temperature",
      "name": "Days > Threshold Projections",
      "description": "NARCCAP (North American Regional Climate Change Assessment Program) projected days/year of temperature above or below threshold values, summarized by year and county, for the years 2039 to 2069. Data shown are decadal means, i.e., average values for the year selected and the previous 9 years, relative to the 1971-2000 average for that variable. More information on NARCCAP models and data products can be found here: http://www.narccap.ucar.edu/about/index.html",
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
        "prod": "tx90",
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
      "description": "GAP Land Cover 3 National Vegetation Classification-Formation Land Use for the contiguous United States. This dataset was created for regional terrestrial biodiversity assessment. These data are not intended to be used at scales larger than 1:100,000. For more information about the National Vegetation Classification Standard please visit this link: http://usnvc.org/data-standard/",
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
      "description": "National Land Cover Dataset (NLCD). NLCD 2011 is a National Land Cover Database classification scheme based primarily on Landsat data along with ancillary data sources, such as topography, census and agricultural statistics, soil characteristics, wetlands, and other land cover maps. NLCD is a 21-class land cover classification scheme that has been applied consistently across the conterminous U.S. at a spatial resolution of 30 meters.",
      "source": "USGS",
      "source_url": "http:\/\/www.mrlc.gov",
      "sectors": "Agriculture,Ecosystems,Buildings and Transportation",
      "download_url": null,
      "metadata_url": "http:\/\/catalog.data.gov\/dataset\/usgs-land-cover-nlcd-overlay-map-service-from-the-national-map-national-geospatial-data-asset-#sec-dates",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "high_priority_terrestrial_diversity",
      "folder": "Ecosystems.Vermont Conservation Design",
      "name": "Physical Landscape Diversity Blocks",
      "description": "These layers are component layers of BioFinder, a map and database identifying Vermont's lands and waters supporting high priority ecosystems, natural communities, habitats, and species. The most comprehensive assessment of its kind in Vermont, BioFinder was developed by the Agency of Natural Resources and partners to further our collective stewardship and conservation efforts. \n\n The map layers included here identify ecosystem features that provide broad ecosystem services and as a group, maintaining or enhancing these features is likely to conserve the majority of Vermont's species and natural communities, even as the climate changes.  Physical landscapes are the parts of the landscape that resist change. They are the hills and valleys, the underlying bedrock, and the deposits left behind by glaciers or ancient lakes. They remain largely static when natural or human-induced changes in land cover and wildlife occur, as plants and animals expand or contract their ranges, and even as the climate changes. Understanding the physical landscape can help us predict habitat conditions and species presence. Physically diverse landscapes support diverse natural communities and species, and so one way to ensure that biological diversity persists on our landscape is to conserve a variety of physical landscapes. The degree to which forests are connected or separated has implications both for where wildlife will be and which wildlife are present. This concept of connectivity is particularly important in the face of climate change; maintaining connected pathways of natural vegetation across the landscape is considered a critical strategy for adapting to a changing climate, allowing animals and plants to disperse to locations that provide favorable conditions.",
      "source": "VT ANR",
      "source_url": "http://biofinder.vt.gov/biofinderresults.htm",
      "sectors": "Ecosystems,",
      "download_url": "http://anrmaps.vermont.gov/websites/BioFinder2016",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/fe24a98a5e06463cb4841d5f60f21858/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "high_priority_terrestrial_forest",
      "folder": "Ecosystems.Vermont Conservation Design",
      "name": "Highest Priority Interior Forest Blocks",
      "description": "These layers are component layers of BioFinder, a map and database identifying Vermont's lands and waters supporting high priority ecosystems, natural communities, habitats, and species. The most comprehensive assessment of its kind in Vermont, BioFinder was developed by the Agency of Natural Resources and partners to further our collective stewardship and conservation efforts. \n\n The map layers included here identify ecosystem features that provide broad ecosystem services and as a group, maintaining or enhancing these features is likely to conserve the majority of Vermont's species and natural communities, even as the climate changes.  Physical landscapes are the parts of the landscape that resist change. They are the hills and valleys, the underlying bedrock, and the deposits left behind by glaciers or ancient lakes. They remain largely static when natural or human-induced changes in land cover and wildlife occur, as plants and animals expand or contract their ranges, and even as the climate changes. Understanding the physical landscape can help us predict habitat conditions and species presence. Physically diverse landscapes support diverse natural communities and species, and so one way to ensure that biological diversity persists on our landscape is to conserve a variety of physical landscapes. The degree to which forests are connected or separated has implications both for where wildlife will be and which wildlife are present. This concept of connectivity is particularly important in the face of climate change; maintaining connected pathways of natural vegetation across the landscape is considered a critical strategy for adapting to a changing climate, allowing animals and plants to disperse to locations that provide favorable conditions.",
      "source": "VT ANR",
      "source_url": "http://biofinder.vt.gov/biofinderresults.htm",
      "sectors": "Ecosystems,",
      "download_url": "http://anrmaps.vermont.gov/websites/BioFinder2016",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/fe24a98a5e06463cb4841d5f60f21858/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "high_priority_terrestrial_connectivity",
      "folder": "Ecosystems.Vermont Conservation Design",
      "name": "Highest Priority Connectivity Blocks",
      "description": "These layers are component layers of BioFinder, a map and database identifying Vermont's lands and waters supporting high priority ecosystems, natural communities, habitats, and species. The most comprehensive assessment of its kind in Vermont, BioFinder was developed by the Agency of Natural Resources and partners to further our collective stewardship and conservation efforts. \n\n The map layers included here identify ecosystem features that provide broad ecosystem services and as a group, maintaining or enhancing these features is likely to conserve the majority of Vermont's species and natural communities, even as the climate changes.  Physical landscapes are the parts of the landscape that resist change. They are the hills and valleys, the underlying bedrock, and the deposits left behind by glaciers or ancient lakes. They remain largely static when natural or human-induced changes in land cover and wildlife occur, as plants and animals expand or contract their ranges, and even as the climate changes. Understanding the physical landscape can help us predict habitat conditions and species presence. Physically diverse landscapes support diverse natural communities and species, and so one way to ensure that biological diversity persists on our landscape is to conserve a variety of physical landscapes. The degree to which forests are connected or separated has implications both for where wildlife will be and which wildlife are present. This concept of connectivity is particularly important in the face of climate change; maintaining connected pathways of natural vegetation across the landscape is considered a critical strategy for adapting to a changing climate, allowing animals and plants to disperse to locations that provide favorable conditions.",
      "source": "VT ANR",
      "source_url": "http://biofinder.vt.gov/biofinderresults.htm",
      "sectors": "Ecosystems,",
      "download_url": "http://anrmaps.vermont.gov/websites/BioFinder2016",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/fe24a98a5e06463cb4841d5f60f21858/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
      }
    },
    {
      "id": "spa_surface_water",
      "folder": "Water Resources",
      "name": "Surface Water SPA",
      "description": "Source Protection Area (SPA) boundaries have been located on RF 24000 & RF 25000 scale USGS topographic maps by Drinking Water and Groundwater Protection Division (DEC) and VT Dept of Health (historical) personnel. Buffered SPAs are based on the point location of the water source(s) Refer to the SOURCE coverage documentation file for information on data sources used. This GIS layer consists of the geographic location of the Source Protection Areas for active and inactive Public Community and Non-Transient Non-Community for surface water intakes labeled by the Water System Identification Number (WSID) and source number (i.e. IN002). The SPA generally consists of a buffer around the upstream river and tributaries and watershed boundary. The source locations are drawn from the State Drinking Water database (SDWIS). The water sources are surface water intakes on lakes or rivers that predate regulations developed in the 1970s to new sources under review now.",
      "source": "VT ANR",
      "source_url": "http://geodata.vermont.gov/datasets/VTANR::surfacewater-source-protection-areas-spas",
      "sectors": "",
      "download_url": "https://opendata.arcgis.com/datasets/fe35e66df2e64d31b5523812b095c868_184.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/fe35e66df2e64d31b5523812b095c868/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
        "display_layer": 33
      }
    },
    {
      "id": "spa_ground_water",
      "folder": "Water Resources",
      "name": "Ground Water SPA",
      "description": "Groundwater SPA. This GIS layer consists of the geographic location of the Source Protection Areas for active and inactive Public Community and Non-Transient Non-Community groundwater sources labeled by the Water System Identification Number (WSID) and source number (i.e. WL001 or WL002). The source locations are drawn from the State Drinking Water database (SDWIS). The water sources are wells and springs that predate regulations developed in the 1970s to new sources under review now. Source Protection Area (SPA) boundaries have been located on RF 24000 & RF 25000 scale USGS topographic maps by Drinking Water and Groundwater Protection Division (DEC) and VT Dept of Health (historical) personnel. Buffered SPAs are based on the point location of the water source(s). Refer to the SOURCE coverage documentation file for information on data sources used.",
      "source": "VT ANR",
      "source_url": "geodata.vermont.gov/datasets/VTANR::ground-water-spa",
      "sectors": "",
      "download_url": "https://opendata.arcgis.com/datasets/43d5689ed7bb4473a0b318875eaaf770_187.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/43d5689ed7bb4473a0b318875eaaf770/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 100,
      }
    },
    {
      "id": "private_wells",
      "folder": "Water Resources",
      "name": "Private Wells",
      "description": "Private wells in this layer come from the Department of Environmental Conservation's Water Supply Data Composite. Managed by the Drinking Water and Groundwater Protection Division's Well Driller and Well Location Program, the database contains private well information submitted by Vermont licensed well drillers. Licensed well drillers have been required to submit well completion reports (well logs) to the state since 1966. Well tags have been required since 1986. NOTE: the data contained here is only as accurate as what was submitted - many wells were completed, but not reported, many reports have missing information, were recorded inaccurately or poorly located geographically. If a report cannot be found but you know the driller of a particular well, you may want to contact them directly.",
      "source": "VT ANR",
      "source_url": "http://geodata.vermont.gov/datasets/VTANR::private-wells-1",
      "sectors": "",
      "download_url": "https://opendata.arcgis.com/datasets/d17192903e80420394b7e8f0405b18a9_162.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/d17192903e80420394b7e8f0405b18a9/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
        "display_layer": 33
      }
    },
    {
      "id": "public_water_sources",
      "folder": "Water Resources",
      "name": "Public Water Sources",
      "description": "This GIS layer consists of the geographic location of active and inactive public (Community, non-transient non-community and transient non-community) water sources labeled by the Water System Identification Number (WSID) and source number (i.e. WL001 or IN002). The water source data and locations are drawn from the State Drinking Water database (SDWIS). The water sources are wells, springs and surface water intakes that predate regulations developed in the 1970s to the present. SDWIS is the repository for state and federal information collected from and about each public water system in Vermont, including bulk and bottled water facilities along with water production and water quality data.",
      "source": "VT ANR",
      "source_url": "http://geodata.vermont.gov/datasets/VTANR::public-water-sources-1",
      "sectors": "",
      "download_url": "https://opendata.arcgis.com/datasets/4c8db80cb2d04819b4d69053cf4609ae_161.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/4c8db80cb2d04819b4d69053cf4609ae/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70,
        "display_layer": 33
      }
    },
    {
      "id": "vt_heat_vuln",
      "folder": "Public Health",
      "name": "VT Heat Vulnerability",
      "description": "The Vermont Heat Vulnerability Index draws together 17 different measures of vulnerability in 6 different themes: population, socioeconomic, health, environmental, climate, and heat illness. These measures are combined to measure the overall vulnerability of Vermont towns to heat-related events. Darker brown colors indicate towns or cities at relatively higher risk for heat illnesses. The heat index provides a first step to identifying populations that may be more vulnerable to extreme heat, however local knowledge should always be considered when it is available.",
      "source": "VT ANR",
      "source_url": "http://geodata.vermont.gov/datasets/24e578770db24055a9be1860c60031b8",
      "sectors": "Ecosystems,",
      "download_url": "http://geodata.vermont.gov/datasets/24e578770db24055a9be1860c60031b8",
      "metadata_url": "http://www.healthvermont.gov/sites/default/files/documents/2016/12/ENV_EPHT_heat_vulnerability_in_VT_0.pdf",
      "parameters": {
        "opacity": 70,
        "selected_facet_index": 0,
      }
    },
    {
      "id": "superfund",
      "folder": "Miscellaneous",
      "name": "Superfund Sites",
      "description": "The Agency for Toxic Substances and Disease Registry (ATSDR) Hazardous Waste Site Polygon Data with CIESIN Modifications, Version 2 is a database providing georeferenced data for 1,572 National Priorities List (NPL) Superfund sites",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "http:\/\/sedac.ciesin.columbia.edu\/data\/set\/superfund-atsdr-hazardous-waste-site-ciesin-mod-v2",
      "sectors": "",
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
      "description": "Modeled importance value (IV) of 20 Vermont native tree species for three climate conditions: 1) current climate (1961-1990 average); 2) future climate (2071-2100 average) with IPCC scenario B1 (significant conservation and reduction of CO2 emissions); and 3) future climate (2071-2100 average) with IPCC scenario A1FI (high emissions, no modification in current emission trends). Importance Value measures the dominance of a tree species in a forest, based on the relative frequency, density, and basal area of the species. For more information on the models and to explore more tree species and climate scenarios, visit the US Forest Service Climate Change Atlas: http://www.fs.fed.us/nrs/atlas/",
      "source": "USDA Forest Service Northern Research Station",
      "source_url": "http:\/\/www.fs.fed.us\/nrs\/atlas\/",
      "sectors": "Ecosystems",
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
      "description": "The Anthropogenic Biomes of the World, Version 2: 2000 data set describes anthropogenic transformations within the terrestrial biosphere caused by sustained direct human interaction with ecosystems, including agriculture and urbanization c. 2000. Potential natural vegetation, biomes, such as tropical rainforests or grasslands, are based on global vegetation patterns related to climate and geology. Anthropogenic transformation within each biome is approximated using population density, agricultural intensity (cropland and pasture) and urbanization. This data set is part of a time series for the years 1700, 1800, 1900, and 2000 that provides global patterns of historical transformation of the terrestrial biosphere during the Industrial Revolution.",
      "source": "Center for International Earth Science Information Network (CIESIN)",
      "source_url": "sedac.ciesin.columbia.edu/data/set/anthromes-anthropogenic-biomes-world-v2-2000",
      "sectors": "Ecosystems, Agriculture, Buildings",
      "download_url": null,
      "metadata_url": "sedac.ciesin.columbia.edu/data/set/anthromes-anthropogenic-biomes-world-v2-2000",
      "parameters": {
        "opacity": 70,
        "year": "2000"
      }
    },
    {
      "id": "croplands",
      "folder": "Agriculture",
      "name": "Global Croplands",
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
      "id": "pastures",
      "folder": "Agriculture",
      "name": "Global Pasturelands",
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
      "id": "fema_historic",
      "folder": "Miscellaneous",
      "name": "FEMA Historic Emergencies 1964-2014",
      "description": "This layer summarizes FEMA historic disaster declarations from 1964 through 2014, categorized by type.",
      "source": "FEMA",
      "source_url": "https://catalog.data.gov/dataset/fema-historical-disaster-declarations-shp",
      "sectors": "All Sectors",
      "download_url": "http:\/\/gis.fema.gov\/kmz\/HistoricDeclarations.zip",
      "metadata_url": "https:\/\/www.fema.gov\/openfema-dataset-disaster-declarations-summaries-v1",
      "parameters": {
        "opacity": 70,
        "fema_historic_layer" : "0"
      }
    },
    {
      "id": "bridges",
      "folder": "Infrastructure",
      "name": "Bridges",
      "description": "Statewide list of transportation structures, which includes town owned (maintained) bridges inventoried by Regional Planning Commissions, towns, and/or consultants. The dataset is limited to structures (bridges and culverts) maintained by municipalities, typically Town Shorts (TS) and Town Ultra-Shorts (TU).",
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
      "id": "invasives",
      "folder": "Ecosystems",
      "name": "Invasives",
      "description": " The Invasive Species layer is created from the ANR Invasive Species database and records sightings of species known to be non-native invasive plants. ",
      "source": "Vermont Open Geodata Portal",
      "source_url": "geodata.vermont.gov/datasets/VTANR::invasive-species-1",
      "sectors": "Ecosystems",
      "download_url": "https://opendata.arcgis.com/datasets/b1ae7b7b110447c3b452d9cacffeed36_174.geojson",
      "metadata_url": "https:\/\/www.arcgis.com\/sharing\/rest\/content\/items\/b1ae7b7b110447c3b452d9cacffeed36\/info\/metadata\/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 70
      }
    },
    {
      "id": "dams",
      "folder": "Infrastructure",
      "name": "Dams",
      "description": "This dataset is generated from from the Vermont Dam Inventory (VDI). The VDI is managed by the VT DEC's Dam Safety and Hydrology Section and contains information about Vermont's dams. The Dam Safety and Hydrology Section manages programs that promote dam safety and protection of flows in Vermont's rivers and streams. The VDI supports them in this effort by tracking physical attributes, managing construction (permits) and inspection information, and reporting to the US Army Corps of Engineers.",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://geodata.vermont.gov/datasets/VTANR::dams-1",
      "sectors": "Ecosystems",
      "download_url": "https://opendata.arcgis.com/datasets/75b9d3671f474323a22165ba5a4c2677_161.geojson",
      "metadata_url": "https://www.arcgis.com/sharing/rest/content/items/75b9d3671f474323a22165ba5a4c2677/info/metadata/metadata.xml?format=default&output=html",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "beach_closures",
      "folder": "Public Health",
      "name": "Beach Closures",
      "description": "This map layer provides an overview of beach closures on Lake Champlain between 2012 and 2014. When a public beach is closed for health concerns, it is typically due to either risk of exposure to coliform bacteria (e.g. E. coli) or cyanobacteria (“blue-green algae”) blooms. Data for this layer were aggregated from Vermont State Parks and municipal beaches by the Lake Champlain Basin Program (LCBP). The beach score is based on the number of closures for any purpose between 2012-2014: good, 0-2 closures; fair, 3-7 closures; poor, 8+ closures.",
      "source": "Vermont Open Geodata Portal",
      "source_url": "http://www.lcbp.org/water-environment/human-health/swimming-concerns/beach-closures/",
      "sectors": "",
      "download_url": "Not downloadable elsewhere, obtained by request from LCBP",
      "metadata_url": "",
      "parameters": {
        "opacity": 100
      }
    },
    {
      "id": "flood_hazard_areas",
      "folder": "Water Resources",
      "name": "DFIRM Flood Hazard Areas",
      "description": "Flood Hazard Areas available in a Geographic Information System format, referred to as Digital Flood Insurance Rate Maps (DFIRMs), are only available for select areas of Vermont.  For areas where DFIRMs are not available, users may view and download scans of paper FIRMs at FEMA’s Map Service Center: https://msc.fema.gov/portal",
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
        "opacity": 100
      }
    },
    {
      "id": "hospitals",
      "folder": "Public Health",
      "name": "Hospitals",
      "description": "This data layer contains point locations of all major community, regional, comprehensive health, and healthcare provider hospitals in the state of Vermont. The listing of current hospitals was obtained from the 1998/1999 & 2000/2001 Vermont Manufacturers' Directory, published annually by the Vermont Business Magazine. Included within the attributes of the database are Annual Sales Ranges, Employment numbers, and hospital contact information. This data layer does not include Psychiatric or Specialty hospitals. Many of the point locations of hospital sites were obtained from EmergencyE911_ESITE data layers and verified with checking USGS topographic quadrangle maps, while other point locations were captured from orthophotos or USGS topographic quadrangle maps directly.",
      "source": "Vermont Open Geodata Portal",
      "source_url": "geodata.vermont.gov/datasets/vt-hospital-site-locations",
      "sectors": "Public Health",
      "download_url": "https://opendata.arcgis.com/datasets/128c419772234581ac4209e4e429f882_5.zip?outSR=%7B%22wkid%22%3A32145%2C%22latestWkid%22%3A32145%7D",
      "metadata_url": "maps.vcgi.vermont.gov/gisdata/metadata/FacilitiesHospitals_HOSPITAL.htm",
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
      "id": "climaid_temp",
      "folder": "Climate Data.Temperature",
      "name": "CLIMAID Temperature Change",
      "description": "Future temperature projections developed for and utilized by the New York ClimAID Report. Projected temperature change for the years 2020, 2050, and 2080, compared with the baseline period of 1971-2000, at a 50x50km resolution. Projections are available for two different emissions scenarios, RCP 4.5 (substantial reductions in GHG emissions before 2100) and RCP 8.5 (increasing GHG emissions with time). Users can select results by percentiles. For example, the 75th percentile means that 75 percent of the model results are lower in value (and 25 percent are higher).",
      "source": "CLIMAID",
      "source_url": "http:\/\/www.nyserda.ny.gov\/climaid",
      "sectors": "",
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
