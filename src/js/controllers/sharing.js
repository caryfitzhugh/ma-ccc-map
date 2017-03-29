Controllers.Sharing = {
  version: 1,
  get_save_data: function (cp) {
    var data_to_share =  {
      version: Controllers.Sharing.version,
      active_layers: _.map(cp.get("layers.active"), function (layer) {
                  return Controllers.Layers.pickle_active_layer(layer);
                }),
      map_state: cp.get("map_state")
    };
    return data_to_share;
  },
  open_sharing: function (cp, evt) {
    cp.set("sharing_modal.open", true);
    cp.set("sharing_modal.token", null);
    cp.set("sharing_modal.copied", false);
  },
  sharing_url: function (token) {
    var current = URI(window.location.href);
    current.removeSearch("map_state_token");
    current.addSearch("map_state_token", token);
    return current.toString();
  },
  add_token_copy: function (cp) {
    // Make the copyer
    var element = $("#sharing_copy_button");
    var clipper =  new ZeroClipboard(element);
    clipper.on("copy", function (evt) {
      cp.set("sharing_modal.copied", true);
      evt.clipboardData.setData("text/plain", Controllers.Sharing.sharing_url(cp.get("sharing_modal.token")));
      /// Now, later, go back to the original text "Copy"
      setTimeout(function () {
        cp.set("sharing_modal.copied", false);
      }, 3000);
    });
  },
  hide_sharing: function (cp, evt) {
    cp.set("sharing_modal.open", false);
  },
  load_active_layers: function (cp, pickle_string) {
    var data = JSON.parse(pickle_string);
    if (data.version !== Controllers.Sharing.version) {
      alert("This data is not the correct version. Sorry!");
    } else {
      cp.set("layers.active",data.data);
      cp.set("sharing_modal.open", false);
    }
  },
  save_state: function (data, cb) {
    $.ajax({
      url: CDN("http://52.2.5.122/api/v1/savemap.php"),
      method: "POST",
      data: { data:  JSON.stringify(data) },
      success: function (token) {
        cb(token);
      }
      });
  },
  load_state: function (token, cp, map) {
    cp.set("sharing_modal_loading", true);
    $.ajax({
      url: CDN("http://52.2.5.122/api/v1/getmap.php"),
      data: { token:  token},
      success: function (data) {
        var json = JSON.parse(JSON.parse(data)[0].data);
        if (json.version != Controllers.Sharing.version) {
          alert("Ack! We can't load this saved map!")
        } else {
          cp.set("layers.active", json.active_layers);
          /// Get the center and zoom from map state
          map.setView(json.map_state.center,json.map_state.zoom);

        }

        map.invalidateSize();

        setTimeout(function () {
          cp.set("sharing_modal_loading", false);
        }, 1500);
      }
    });
  }
};
