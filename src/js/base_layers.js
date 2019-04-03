/*global API_Handler, LayerInfo, _ , L , Views */
const BASELAYER_PANE = 'baselayers';

var BaseLayers = [
  {
    name: "Terrain",
    data: L.tileLayer(
      /* Already a CDN */
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png",
      { maxZoom: 19,
        attribution: 'Basemap Courtesy of <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ESRI</a>',
        pane: BASELAYER_PANE
      })
  },
  {
    name: "Street Map",
    data: L.tileLayer(
      /* Already a CDN */
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {  maxZoom: 19,
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
  },
  {
    name: "Imagery",
    data: L.tileLayer(/* Already a CDN */
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 18,
            attribution: 'Esri, DigitalGlobe, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
          })
  },
  {
    name: "2001 Imagery",
    data: L.tileLayer(/* Already a CDN */
            "https://tiles.arcgis.com/tiles/hGdibHYSPO59RG1h/arcgis/rest/services/orthos_2001_tile_package/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 18,
            attribution: '2001-2003 Imagery Courtesy of <a href="https://docs.digital.mass.gov/dataset/massgis-data-15000-color-ortho-imagery-2001-2003" target="_blank">Massachusetts Dept. of Transportation</a>'
          })
  },
  {
    name: "Watercolor",
    data: L.tileLayer(
      /* Already a CDN */
      'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
      })
  },
  {
    name: "Toner",
    data: L.tileLayer(
      /* Already a CDN */
      'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
    })
  },
  {
    name: "None",
    data: {
      'Empty': L.tileLayer(''),
      'OpenStreetMap': L.tileLayer(/* Already a CDN */'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'attribution': 'Map data &copy; OpenStreetMap contributors'
      })
  }}

];
