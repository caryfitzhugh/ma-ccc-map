RendererTemplates.ma_projected_climate_data("ma_projected_temp_gt_100", {
  title: "MA Projected Days > 100&deg;F",
  legend: " Change in # days above 100&deg;F",
  legend_precision: 1,
  legend_units: " Days ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/tempgt100.json",
  color_ranges: colorbrewer.OrRd[4]
});
