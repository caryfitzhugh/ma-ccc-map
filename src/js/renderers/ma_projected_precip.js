RendererTemplates.ma_projected_climate_data('ma_projected_precip', {
  title: "Total Precipitation",
  legend: " Projected change in inches of total precipitation",
  legend_precision: 1,
  info_precision: 2,
  legend_units: "Inches",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/umass/projected/?variable_name=precip",
  color_range: colorbrewer.Blues[7]
});
