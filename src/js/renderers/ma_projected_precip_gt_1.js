RendererTemplates.ma_projected_climate_data('ma_projected_precip_gt_1', {
  title: " Precipitation &gt; 1\"",
  legend: " Projected change in # Days with precipitation &gt; 1\" ",
  legend_precision: 1,
  legend_units: "days",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=precipgt1",
  color_range: colorbrewer.Purples[5]
});
