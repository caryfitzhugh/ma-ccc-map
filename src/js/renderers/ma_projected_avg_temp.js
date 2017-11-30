RendererTemplates.ma_projected_climate_data('ma_projected_avg_temp', {
  title: "Average Temperature",
  legend: "Projected change in Average Temp. (&deg;F)",
  legend_units: " &deg;F",
  legend_precision: 1,
  //data_url: "http://repository.nescaum-ccsc-dataservices.com/data/ma/avgtemp.json",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=avgtemp",
  color_range: colorbrewer.OrRd[6]
});
