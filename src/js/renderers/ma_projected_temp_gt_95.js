RendererTemplates.ma_projected_climate_data("ma_projected_temp_gt_95", {
  title: "Days > 95&deg;F",
  legend: "Projected change in # days above 95&deg;F",
  legend_precision: 1,
  info_precision: 2,
  legend_units: " Days ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=tempgt95",
  color_range: colorbrewer.OrRd[6]
});
