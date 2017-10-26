RendererTemplates.ma_historical_climate_data("ma_historical_days_below_temp", {
  title: "MA Historical Days Below Temp ",
  legend: "Days",
  legend_precision: 0,
  info_legend: " Days ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/below_temp_thresholds.json",
  color_ranges: {
    'lt0': colorbrewer.Blues[8],
    'lt32': colorbrewer.Blues[8],
  },
  all_metrics: {
    "lt0" : "Days Below 0&deg;F",
    "lt32" : "Days Below 32&deg;F",
  }
});
