RendererTemplates.ma_historical_climate_data("ma_historical_days_above_temp", {
  title: "MA Historical Days Above Temp ",
  legend: "Days",
  legend_precision: 1,
  info_legend: " Days ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/above_temp_thresholds.json",
  color_ranges: {
    'gt90': colorbrewer.OrRd[5],
    'gt95': colorbrewer.OrRd[5],
    'gt100': colorbrewer.OrRd[5],
  },
  all_metrics: {
    "gt90" : "Days Above 90&deg;F",
    "gt95" : "Days Above 95&deg;F",
    "gt100" : "Days Above 100&deg;F",
  }
});
