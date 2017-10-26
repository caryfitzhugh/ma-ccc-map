RendererTemplates.ma_historical_climate_data("ma_historical_consecutive_dry_days", {
  title: "MA Historical Consecutive Dry Days ",
  legend: "Days",
  legend_precision: 0,
  info_legend: " Days ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/consecutive_dry_days.json",
  color_ranges: {
    'cdd': colorbrewer.YlOrRd[8],
  },
  all_metrics: {
    "cdd" : "Consecutive Dry Days"
  }
});
