RendererTemplates.ma_projected_climate_data("ma_projected_cooling_degree_days", {
  title: "Cooling Degree Days",
  legend: "Projected change in Cooling Degree-Days",
  legend_precision: 0,
  legend_units: "Degree-Days",
  //data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/cooldegdays.json",
  data_url: "https://adirondackatlas.org/api/v1/climatedeltas.php?parameter=cooldegdays",
  color_range: colorbrewer.Blues[6]
});
