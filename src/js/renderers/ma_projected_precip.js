RendererTemplates.ma_projected_climate_data('ma_projected_precip', {
  title: "Total Precipitation",
  legend: " Projected change in inches of total precip.",
  legend_precision: 1,
  legend_units: "Inches",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precip.json",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=precip",
  color_range: colorbrewer.Blues[7]
});
