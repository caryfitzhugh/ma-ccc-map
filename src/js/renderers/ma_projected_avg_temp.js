RendererTemplates.ma_projected_climate_data('ma_projected_avg_temp', {
  title: "Average Temperature",
  legend: "Projected change in Average Temp. (&deg;F)",
  legend_units: " &deg;F",
  legend_precision: 2,
  info_precision: 2,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=avgtemp",
  color_range: colorbrewer.OrRd[6]
});
