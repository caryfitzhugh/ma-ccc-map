RendererTemplates.ma_projected_climate_data('ma_projected_max_temp', {
  title: "Maximum Temperature",
  legend: "Projected change in maximum temperature (&deg;F)",
  legend_precision: 1,
  info_precision: 2,
  legend_units: " &deg;F",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=maxtemp",
  color_range: colorbrewer.OrRd[6]
});
