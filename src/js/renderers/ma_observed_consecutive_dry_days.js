RendererTemplates.ma_observed_climate_data("ma_observed_consecutive_dry_days", {
  title: " Consecutive Dry Days ",
  legend: " Consecutive Dry Days",
  legend_precision: 1,
  legend_units: " days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/consdrydays.json",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=consdrydays",
  color_range: colorbrewer.YlOrRd[8],
});
