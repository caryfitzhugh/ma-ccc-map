/*global L , Views, Ractive, console, _, Controllers.Layers */
var LeafletMap = L.map("map", {zoomControl: false});

Views.ControlPanel.set("map", LeafletMap);

var z_indexes = {
  base: 0,
  layers: 1000
};

// Add default scale control to LeafletMap
L.control.scale().addTo(LeafletMap);

// Connect callbacks to the Map to update our data
LeafletMap.on("zoomend", function (evt) {
  Views.ControlPanel.set("map_state.zoom", LeafletMap.getZoom());
});

LeafletMap.on("moveend", function (evt) {
  Views.ControlPanel.set("map_state.center", LeafletMap.getCenter());
});

LeafletMap.on("click", function (evt) {
  Controllers.FeatureInfo.get_details(Views.ControlPanel, evt);
});


// Create the baselayer PANE
LeafletMap.createPane(BASELAYER_PANE);
