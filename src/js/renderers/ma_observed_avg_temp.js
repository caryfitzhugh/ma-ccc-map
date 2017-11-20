RendererTemplates.ma_observed_climate_data('ma_observed_avg_temp', {
  title: "Average Temperature",
  legend: "Observed Average Temp. (&deg;F)",
  legend_units: "&deg;F",
  legend_precision: 1,
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=avgtemp",
  color_range: colorbrewer.OrRd[6]
});
