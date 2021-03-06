RendererTemplates.ma_projected_climate_data("ma_projected_consecutive_dry_days", {
  title: " Consecutive Dry Days ",
  legend: " Projected change in # of consecutive dry days",
  legend_precision: 1,
  legend_units: "# Consecutive Days",
  info_precision: 2,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=consdrydays",
  color_range: colorbrewer.YlOrRd[8],
});
