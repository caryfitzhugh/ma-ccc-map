/*global API_Handler, LayerInfo, _ , L , Views */
var BaseLayers = [
  {
    name: "Terrain",
    data: new L.TileLayer(
      /* Already a CDN */
      "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png",
      { maxZoom: 19,
        attribution: 'Basemap Courtesy of <a href="http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer" target="_blank">ESRI</a>'
      })
  },
  {
    name: "Street Map",
    data: new L.tileLayer(
      /* Already a CDN */
      "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {  maxZoom: 19,
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
  },
  {
    name: "Imagery",
    data: new L.tileLayer(/* Already a CDN */
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 18,
            attribution: 'Esri, DigitalGlobe, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, and the GIS User Community'
          })
  },
  {
    name: "Watercolor",
    data: new L.tileLayer(
      /* Already a CDN */
      'http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
      })
  },
  {
    name: "Toner",
    data: new L.tileLayer(
      /* Already a CDN */
      'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'png'
    })
  },
  /*
  {
    name: "OAM",
    data: new L.tileLayer(
      "http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
        maxZoom: 18,
        subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
        attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency'
      })
  },
  */
  {
    name: "None",
    data: {
      'Empty': L.tileLayer(''),
      'OpenStreetMap': L.tileLayer(/* Already a CDN */'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'attribution': 'Map data &copy; OpenStreetMap contributors'
      })
  }}

];
