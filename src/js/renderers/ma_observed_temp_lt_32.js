RendererTemplates.ma_observed_climate_data('ma_observed_temp_lt_32', {
  title: "Days Below 32 &deg;F ",
  legend: " Days below 32 &deg;F",
  legend_precision: 1,
  legend_units: "days",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma_observed/templt32.json",
  color_range: colorbrewer.Blues[6],
  invert_scale: false
});
