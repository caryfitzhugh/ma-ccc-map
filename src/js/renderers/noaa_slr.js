/*global _, Renderers, L */
RendererTemplates.esri("noaa_slr", {
  parameters: {
    opacity: 70,
    sea_level_height: 0,
    display_layer : "slr",
    options: {
      sea_level_height: {
        '0': "0",
        '1': "1",
        '2': "2",
        '3': "3",
        '4': "4",
        '5': "5",
        '6': "6",
      },
      display_layer: {
        'slr': "Sea Level Rise",
        'conf': "Confidence",
      }
    }
  },
  legend_template: `
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a sea level rise scenario'> Predicted Rise: </label>
      <input type='range' 
        min='0'
        max='6'
        value= '{{parameters.sea_level_height}}'> {{parameters.sea_level_height}} ft.
    </div>
    <div class='detail-block show-confidence'>
      <label decorator='tooltip:Choose a layer to display'> Layer: </label>
      <select value='{{parameters.display_layer}}'>
       {{#u.to_sorted_values_from_hash(parameters.options.display_layer)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.options.display_layer)}}
      </select>
    </div>

    <div class='detail-block legend taccimo '>
      <label> Legend </label>
      <img  src="img/noaa_{{parameters.display_layer}}Legend.jpg">
    </div>
  `,
  clone_layer_name: function (active_layer) {
    var p = active_layer.parameters;
    var sea_level_height = p.options.sea_level_height[p.sea_level_height];
    var display_layer = p.options.display_layer[p.display_layer];

    return active_layer.name + " " + view + " : " + rise;
  },
  esri_opts: function (active_layer) {
    var p = active_layer.parameters;
    var sea_level_height = p.sea_level_height;
    var display_layer = p.display_layer;
    console.log(sea_level_height,'_',display_layer)

    return {
      layers: [Number(sea_level_height)+Number(display_layer)],
      url: CDN("https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/"+display_layer+"_"+sea_level_height+"ft/MapServer"),
      attribution: 'NOAA',
      f:"image",
      clickable: false
    };
  },
});
