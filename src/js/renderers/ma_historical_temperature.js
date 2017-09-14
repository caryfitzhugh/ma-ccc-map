RendererTemplates.ma_historical_climate_data("ma_historical_temperature", {
  title: "MA Historical Temps",
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
    "tavg" : "Average Temp &deg;F",
    "tmin" : "Minimum Temp &deg;F",
    "tmax" : "Maximum Temp &deg;F",
  }
});
