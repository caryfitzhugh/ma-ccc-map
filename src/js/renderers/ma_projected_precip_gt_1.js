RendererTemplates.ma_projected_climate_data('ma_projected_precip_gt_1', {
  title: " Precipitation &gt; 1 inch",
  legend: " Projected change in # Days with precipitation &gt; 1 inch ",
  legend_precision: 1,
  info_precision: 2,
  legend_units: "days",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=precipgt1",
  color_range: colorbrewer.Purples[5]
});
