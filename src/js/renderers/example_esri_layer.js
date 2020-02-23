/*global _, Renderers, L */
RendererTemplates.esri("example_esri_layer", {
  parameters: {
    opacity: 70,
    species: 5,
    scenario: 0,
    options: {
      species: {
        '4': "Red Maple",
        '5': "Sugar Maple",
        '7': "Yellow Birch",
        '10': "Pignut Hickory",
        '14': "American Beech",
        '15': "White Ash",
        '28': "Red Spruce",
        '35': "Eastern White Pine",
        '40': "Quaking Aspen",
        '41': "Black Cherry",
        '42': "White Oak",
        '49': "Northern Red Oak",
        '55': "Eastern Hemlock"
      },
      scenarios: {
        '0': "Current",
        '56': "Low",
        '112': "High",
      }
    }
  },
  legend_template: `
    <div class='detail-block show-confidence'>
      <label as-tooltip='"Choose a tree species"'> Species: </label>

      <select value='{{parameters.species}}'>
        {{#u.to_sorted_values_from_hash(parameters.options.species)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.options.species)}}
      </select>
    </div>
    <div class='detail-block show-confidence'>
      <label as-tooltip='"Choose a tree species"'> Scenario: </label>
      <select value='{{parameters.scenario}}'>
        {{#u.to_sorted_values_from_hash(parameters.options.scenarios)}}
          <option value='{{key}}'>{{value}}</option>
        {{/u.to_sorted_values_from_hash(parameters.options.scenarios)}}
      </select>
    </div>

    <div class='detail-block legend taccimo '>
      <label> Legend </label>
      <img  src="img/taccimo.jpg">
    </div>
  `,
  clone_layer_name: function (active_layer) {
    var p = active_layer.parameters;
    var scenario = p.options.scenarios[p.scenario];
    var species = p.options.species[p.species];

    return active_layer.name + " " + species + " : " + scenario;
  },
  esri_opts: function (active_layer) {
    var scenario = active_layer.parameters.scenario;
    var species = active_layer.parameters.species;

    return {
      layers: [Number(scenario)+Number(species)],
      url: CDN("http://wassimap.sgcp.ncsu.edu:8399/arcgis/rest/services/taccimo/treeatlas_high/MapServer"),
      attribution: 'USFS',
      f:"image",
      clickable: false
    };
  },
});
