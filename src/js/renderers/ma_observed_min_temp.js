RendererTemplates.ma_observed_climate_data('ma_observed_min_temp', {
  title: "Minimum Temperature",
  legend: "Observed Min Temp. (&deg;F)",
  legend_precision: 1,
  legend_units: " &deg;F",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/mintemp.json",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=mintemp",
  color_range: colorbrewer.OrRd[6]
});
