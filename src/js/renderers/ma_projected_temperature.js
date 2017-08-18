RendererTemplates.ma_projected_climate_data('ma_projected_temperature', {
  title: "MA Projected Temps",
  legend: "Temperature &deg;F",
  legend_precision: 2,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
  color_ranges: {
    'tmax': colorbrewer.OrRd[9],
    'tmin': colorbrewer.OrRd[9],
    'tavg': colorbrewer.OrRd[9],
  },
  all_metrics: {
    "tmin" : "Minimum Temp",
    "tmax" : "Maximum Temp",
    "tavg" : "Average Temp",
  },
});