RendererTemplates.ma_projected_climate_data('ma_projected_min_temp', {
  title: "Minimum Temperature",
  legend: "Projected change in minimum temperature (&deg;F)",
  legend_precision: 1,
  info_precision: 2,
  legend_units: " &deg;F",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=mintemp",
  color_range: colorbrewer.OrRd[6]
});
