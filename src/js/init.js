/*global API_Handler, LayerInfo, _ , L , Views, BaseLayers */
// We have the views already created and waiting.
// The map has been attached to #map

// Parse the query parameters and set them
var all_layer_ids =  _.pluck(available_layers, "id");
var parameters = API_Handler.get_parameters(window.location.search.substr(1), all_layer_ids);

Views.ControlPanel.set({"base_layers": BaseLayers});

// Load all the layers into the view
Views.ControlPanel.set("layers.defaults", available_layers);

// Load the parameters (initial configuration)
Views.ControlPanel.set({"parameters": parameters});

// If the URL has a token on it....
var params = URI.parseQuery(window.location.search);
if (params.map_state_token) {
  Controllers.Sharing.load_state(params.map_state_token, Views.ControlPanel, LeafletMap);
}

if (params.sectors) {
  Views.ControlPanel.set('sectors.selected', params.sectors.split(","));
}

// If the cookie is such that they haven't seen the welcome schpiel, then show it now!
if (document.cookie.replace(/(?:(?:^|.*;\s*)show_welcome_modal_to_new_users\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
  Views.ControlPanel.fire("show-wizard");
  document.cookie = "show_welcome_modal_to_new_users=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
}

// Look through all the available_layers fields for "active_on_load"
//     add those layers automatically to the map
if (desired_active_on_load.length > 0) {
  var already_active_layers = _.pluck(Views.ControlPanel.get("layers.active"), "layer_default_id");
  Controllers.Layers.force_layers_active(Views.ControlPanel, already_active_layers.concat(desired_active_layer_ids));
}
