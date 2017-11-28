RendererTemplates.ma_observed_climate_data('ma_observed_precip_gt_2', {
  title: " Precipitation &gt; 2\"",
  legend: " Days with precip. &gt; 2\" ",
  legend_precision: 2,
  legend_units: "days",
 // data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=precipgt2",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=precipgt2",
  color_range: colorbrewer.Purples[5]
});
