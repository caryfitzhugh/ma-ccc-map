RendererTemplates.ma_delta_climate_data("ma_precipitation", {
  title: "MA Precipitation ",
  legend: "Predicted Change in Precipitation (Inches)",
  legend_precision: 2,
  info_legend: " Inches ",
  data_url: "precip.json",
  color_ranges: {
    'tot': colorbrewer.Purples[8],
  },
  all_metrics: {
    "tot" : "Total Precipitation",
  }
});
