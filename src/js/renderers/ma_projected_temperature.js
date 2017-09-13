RendererTemplates.ma_projected_climate_data('ma_projected_temperature', {
  title: "MA Projected Temps",
  legend: "Temperature &deg;F",
  legend_precision: 2,
  info_legend: "&deg; ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
  color_ranges: {
    'tmax': colorbrewer.OrRd[9],
    'tmin': colorbrewer.OrRd[9],
    'tavg': colorbrewer.OrRd[9],
  },
  all_metrics: {
    "tmin" : "Minimum Temp &deg;F",
    "tmax" : "Maximum Temp &deg;F",
    "tavg" : "Average Temp &deg;F",
  },
});
