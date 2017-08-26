RendererTemplates.ma_historical_climate_data('ma_historical_degree_days', {
  title: "MA Historical Degree Days ",
  legend: "Degree Days",
  legend_precision: 0,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/degree_days.json",
  color_ranges: {
    'h': colorbrewer.OrRd[9],
    'g': colorbrewer.OrRd[9],
    'c': colorbrewer.Blues[9],
  },
  all_metrics: {
    "h" : "Heating Degree Days Accumulation",
    "g" : "Growing Degree Days Accumulation",
    "c" : "Cooling Degree Days Accumulation",
  }
});
