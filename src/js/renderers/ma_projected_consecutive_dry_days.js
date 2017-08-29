RendererTemplates.ma_projected_climate_data("ma_projected_consecutive_dry_days", {
  title: "MA Projected Consecutive Dry Days ",
  legend: "Days",
  legend_precision: 0,
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/consecutive_dry_days.json",
  color_ranges: {
    'cdd': colorbrewer.YlOrRd[9],
  },
  all_metrics: {
    "cdd" : "Consecutive Dry Days"
  }
});
