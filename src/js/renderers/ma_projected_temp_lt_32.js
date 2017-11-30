RendererTemplates.ma_projected_climate_data('ma_projected_temp_lt_32', {
  title: "Days Below 32 &deg;F ",
  legend: " Projected change in # days below 32 &deg;F",
  legend_precision: 1,
  legend_units: "days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/templt32.json",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=templt32",
  color_range: colorbrewer.Blues[6],
  invert_scale: true
});
