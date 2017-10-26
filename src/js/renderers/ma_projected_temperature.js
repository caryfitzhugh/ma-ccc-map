RendererTemplates.ma_projected_climate_data('ma_projected_temperature', {
  title: "MA Projected Temps",
  legend: "Temperature &deg;F",
  legend_precision: 1,
  info_legend: "&deg; ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/temperature.json",
  color_ranges: {
    'tmax': colorbrewer.OrRd[8],
    'tmin': colorbrewer.OrRd[8],
    'tavg': colorbrewer.OrRd[8],
  },
  all_metrics: {
    "tavg" : "Average Temp &deg;F",
    "tmin" : "Minimum Temp &deg;F",
    "tmax" : "Maximum Temp &deg;F",
  },
});
