RendererTemplates.ma_projected_climate_data("ma_projected_temp_gt_90", {
  title: "Days > 90&deg;F",
  legend: "Projected change in # days above 90&deg;F",
  legend_precision: 1,
  legend_units: " Days ",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/tempgt90.json",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=tempgt90",
  color_range: colorbrewer.OrRd[6]
});
