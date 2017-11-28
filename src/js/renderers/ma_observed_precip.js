RendererTemplates.ma_observed_climate_data('ma_observed_precip', {
  title: "Total Precipitation",
  legend: " Total Precipitation (inches)",
  legend_precision: 1,
  legend_units: "inches",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precip.json",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=precip",
  color_range: colorbrewer.Blues[7]
});
