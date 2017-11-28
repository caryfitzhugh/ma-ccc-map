RendererTemplates.ma_observed_climate_data("ma_observed_temp_gt_90", {
  title: "Days > 90 &deg;F",
  legend: " Days above 90 &deg;F",
  legend_precision: 1,
  legend_units: " days ",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/tempgt90.json",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=tempgt90",
  color_range: colorbrewer.OrRd[6]
});
