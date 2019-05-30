RendererTemplates.ma_projected_climate_data('ma_projected_precip_gt_2', {
  title: " Precipitation &gt; 2 inches",
  legend: " Projected change in # Days with precipitation &gt; 2 inches ",
  legend_precision: 2,
  info_precision: 2,
  legend_units: "days",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=precipgt2",
  color_range: colorbrewer.Purples[5]
});
