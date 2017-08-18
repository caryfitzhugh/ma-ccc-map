RendererTemplates.ma_projected_climate_data("ma_projected_degree_days", {
  title: "MA Projected Degree Days",
  legend: "Degree Days",
  legend_precision: 0,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/degree_days.json",
  color_ranges: {
    'h': colorbrewer.OrRd[9],
    'g': colorbrewer.OrRd[9],
    'c': colorbrewer.Blues[9],
  },
  all_metrics: {
    "h" : "Heating Degree Day Accumulation",
    "g" : "Growing Degree Day Accumulation",
    "c" : "Cooling Degree Day Accumulation",
  }
});
