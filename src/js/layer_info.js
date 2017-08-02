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
/*  {
    "id": "nfhl",
    "folder": "Public safety/emergency response",
    "name": "National Flood Hazard Layer",
    "description": "FEMA National Flood Hazard Layer",
    "source": "FEMA",
    "source_url": "http:\/\/www.fema.gov\/",
    "sectors": ["Water Resources"],
    "download_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
    "metadata_url": "http:\/\/www.hazards.fema.gov\/gis\/nfhl\/rest\/services\/public\/NFHL\/MapServer",
  },*/
  {
    "id": "acec",
    "folder": "Natural Resources/Habitats",
    "name": "Areas of Critical Environmental Concern",
    "description": "The Areas of Critical Environmental Concern (ACEC) datalayers provide digital polygon and line boundaries for areas that have been designated ACECs by the Secretary of Energy and Environmental Affairs (EEA).  ACECs are places in Massachusetts that receive special recognition because of the quality, uniqueness and significance of their natural and cultural resources.  These areas are identified and nominated at the community level and are reviewed and designated by the state’s EEA Secretary.  ACEC designation creates a framework for local and regional stewardship of these critical resource areas and ecosystems.  ACEC designation also requires stricter environmental review of certain kinds of proposed development under state jurisdiction within the ACEC boundaries.",
    "source": "Department of Conservation and Recreation",
    "source_url": "http://www.mass.gov/eea/agencies/dcr/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/acecs.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/acecs.html",
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
    "id": "transmission_lines",
    "folder": "Energy",
    "name": "Transmission Lines",
    "description": "The U.S. Geological Survey (USGS) distributes Digital Line Graphs (DLG) from its 1:100,000-scale maps showing pipelines, transmission lines, and other miscellaneous transportation features. MassGIS assembled these data into a statewide layer consisting of all the transportation features identified by USGS other than railroads and vehicle roadways and which appear on the 1:100,000 USGS quadrangle sheets.  Although the pipelines and transmission lines appear on maps, they are not necessarily in active use. The linework is generally excellent, although MassGIS has noted that some lines are discontinuous (not perfectly edgematched) at USGS 1:100,000 quadrangle boundaries. Railroad transportation features are included in the Trains layer.",
    "source": "U.S. Geological Survey",
    "source_url": "https://www.usgs.gov/",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/order-restricted-data.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/trnslns.html",
  },
  {
    "id": "impervious_surface",
    "folder": "Land Cover",
    "name": "Impervious Surfaces",
    "description": "The Impervious Surface raster layer represents impervious surfaces covering the Commonwealth of Massachusetts. The surfaces were extracted using semi-automated techniques by Sanborn Map Company from 50-cm Vexcel UltraCam near infrared orthoimagery that was acquired in April 2005 as part of the Color Ortho Imagery project. The pixel size for the impervious surface data is 1-meter.",
    "source": "MassGIS",
    "source_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/ftpimpsurf.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/impervioussurface.html",
  },
  {
    "id": "dcr_roads_trails",
    "folder": "Recreation",
    "name": "DCR Roads and Trails",
    "description": "The Massachusetts Department of Conservation and Recreation (DCR) – Division of State Parks and Recreation (DSPR) Roads and Trails datalayer contains all legal roads and trails (lines and point features) identified by DCR staff and consultants on DCR DSPR properties (as well as some of the Urban Parks; eventually all trails on these properties will be integrated into this dataset). Roads and trails on private and non-DCR public land were mapped if they connected to these roads and trails and should be used with permission and should not be used if posted.",
    "source": "MA Department of Conservation and Recreation",
    "source_url": "http://www.mass.gov/eea/agencies/dcr/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/dcrtrails.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/dcrtrails.html",
  },
  {
    "id": "fire_stations",
    "folder": "Public Safety/Emergency Response",
    "name": "Fire Stations",
    "description": "The Fire Stations layer shows the point locations of 789 Fire stations in the Commonwealth of Massachusetts. The Massachusetts Emergency Management Agency (MEMA) GIS Program in cooperation with the Regional Planning Agencies and participating communities created the data as part of the development of Homeland Security Data Layers.",
    "source": "MassGIS",
    "source_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/firestations_pt.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/fire-stations-.html",
  },
  {
    "id": "police_stations",
    "folder": "Public Safety/Emergency Response",
    "name": "Police Stations",
    "description": "The Police Stations layer shows the point locations of law enforcement and sheriff offices in Massachusetts, covering local, county and state jurisdictions. The Massachusetts Emergency Management Agency (MEMA) GIS Program in cooperation with the Regional Planning Agencies and participating communities created the original data as part of the development of Homeland Security Data Layers. MassGIS has since incorporated updates into the data.",
    "source": "MassGIS",
    "source_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/policestations.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/policestations.html",
  },
  {
    "id": "land_use",
    "folder": "Land Cover",
    "name": "Land Use 2005",
    "description": "The Impervious Surface raster layer represents impervious surfaces covering the Commonwealth of Massachusetts. The surfaces were extracted using semi-automated techniques by Sanborn Map Company from 50-cm Vexcel UltraCam near infrared orthoimagery that was acquired in April 2005 as part of the Color Ortho Imagery project. The pixel size for the impervious surface data is 1-meter.",
    "source": "MassGIS",
    "source_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/ftplus2005.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/lus2005.html",
  },
  {
    "id": "openspace_owner",
    "folder": "Recreation",
    "name": "Open Space by Owner",
    "description": "The protected and recreational open space datalayer contains the boundaries of conservation lands and outdoor recreational facilities in Massachusetts. The associated database contains relevant information about each parcel, including ownership, level of protection, public accessibility, assessor’s map and lot numbers, and related legal interests held on the land, including conservation restrictions. Conservation and outdoor recreational facilities owned by federal, state, county, municipal, and nonprofit enterprises are included in this datalayer. Not all lands in this layer are protected in perpetuity, though nearly all have at least some level of protection.",
    "source": "Executive Office of Energy and Environmental Affairs",
    "source_url": "http://www.mass.gov/eea/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/open_spc/openspace.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/osp.html",
  },
/*  {
    "id": "openspace_type",
    "folder": "Recreation",
    "name": "Open Space by Type",
    "description": "The protected and recreational open space datalayer contains the boundaries of conservation lands and outdoor recreational facilities in Massachusetts. The associated database contains relevant information about each parcel, including ownership, level of protection, public accessibility, assessor’s map and lot numbers, and related legal interests held on the land, including conservation restrictions. Conservation and outdoor recreational facilities owned by federal, state, county, municipal, and nonprofit enterprises are included in this datalayer. Not all lands in this layer are protected in perpetuity, though nearly all have at least some level of protection.",
    "source": "Executive Office of Energy and Environmental Affairs",
    "source_url": "http://www.mass.gov/eea/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/open_spc/openspace.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/osp.html",
  },*/
  {
    "id": "biomap_core",
    "folder": "Natural Resources/Habitats",
    "name": "BioMAP2",
    "description": "The Massachusetts Natural Heritage & Endangered Species Program and The Nature Conservancy’s Massachusetts Program developed BioMap2 in 2010 as a conservation plan to protect the state’s biodiversity. BioMap2 is designed to guide strategic biodiversity conservation in Massachusetts over the next decade by focusing land protection and stewardship on the areas that are most critical for ensuring the long-term persistence of rare and other native species and their habitats, exemplary natural communities, and a diversity of ecosystems.",
    "source": "The Massachusetts Natural Heritage & Endangered Species Program",
    "source_url": "http://www.mass.gov/eea/agencies/dfg/dfw/natural-heritage/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/biomap2.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/biomap2.html",
  },
  {
    "id": "tax_parcels",
    "folder": "Boundaries",
    "name": "Tax Parcels",
    "description": "MassGIS' Level 3 Assessors’ Parcel Mapping data set, containing property (land lot) boundaries and database information from each community's assessor, was developed through a competitive procurement funded by MassGIS.  Each community in the Commonwealth was bid on by one or more vendors and the unit of work awarded was a city or town.  The specification for this work was Level 3 of the MassGIS Digital Parcel Standard.  As of October 30, 2013, standardization of assessor parcel mapping for 350 of Massachusetts' 351 cities and towns has been completed (data for Boston is not part of this project and will be processed separately). MassGIS is continuing the project, updating parcel data provided by municipalities.",
    "source": "MassGIS",
    "source_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/l3parcels.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/l3parcels.html",
  },
  {
    "id": "flood_zones",
    "folder": "Public Safety/Emergency Response",
    "name": "Flood Zones",
    "description": "These data represent a subset of the data available on the paper Flood Insurance Rate Maps (FIRM) as provided by the Federal Emergency Management Agency (FEMA). The Q3 flood data were developed to support floodplain management and planning activities but do not replace the official paper FIRMs. These data are not suitable for engineering applications or site work nor can the data be used to determine absolute delineation of flood boundaries. Instead the data should be used to portray zones of uncertainty and possible risks associated with flooding. All counties except Franklin are available for Massachusetts.",
    "source": "FEMA",
    "source_url": "http://www.fema.gov/",
    "sectors": ["Ecosystems"],
    "download_url": "http://wsgw.mass.gov/data/gispub/shape/state/FEMA_Q3_Flood.zip",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/q3.html",
  },
  {
    "id": "env_justice",
    "folder": "Demographics",
    "name": "Environmental Justice Populations",
    "description": "??",
    "source": "???",
    "source_url": "http://www.nrcs.usda.gov/",
    "sectors": ["Ecosystems"],
    "download_url": "",
    "metadata_url": "",
  },
  {
    "id": "soils",
    "folder": "Land Cover",
    "name": "Soils",
    "description": "The Soils datalayer has been automated from published soils surveys as provided on various media by the United States Department of Agriculture (USDA) Natural Resources Conservation Service (NRCS). All soils data released by MassGIS have been SSURGO-certified, which means they have been reviewed and approved by the NRCS and meet all standards and requirements for inclusion in the national release of county-level digital soils data. Soil survey areas are roughly based on county boundaries. The SSURGO-certified soils dataset is generally the most detailed level of soil geographic data developed by the National Cooperative Soil Survey. The information was prepared by digitizing maps, by compiling information onto a planimetric correct base and digitizing, or by revising digitized maps using remotely sensed and other information. The data include a detailed, field verified inventory of soils and miscellaneous areas that normally occur in a repeatable pattern on the landscape and that can be cartographically shown at the scale mapped. Data for survey areas were developed using various scale base maps: some areas at a 1:25,000 or 1:12,000 scale, or at larger scales where source materials (e.g. 1:5,000 MassGIS ortho imagery) were available. Details for a specific survey area are provided in the NRCS-produced metadata that are distributed with the spatial data.  The soil map units are linked to attributes in the National Soil Information System (NASIS) relational database, which gives the proportionate extent of the component soils and their properties.",
    "source": "United States Department of Agriculture (USDA) Natural Resources Conservation Service ",
    "source_url": "http://www.nrcs.usda.gov/",
    "sectors": ["Ecosystems"],
    "download_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/ftpsoi.html",
    "metadata_url": "http://www.mass.gov/anf/research-and-tech/it-serv-and-support/application-serv/office-of-geographic-information-massgis/datalayers/soi.html",
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
    "folder": "Energy",
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
