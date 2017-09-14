RendererTemplates.ma_historical_climate_data("ma_historical_extreme_precipitation", {
  title: "MA Historical Extreme Precipitation Events",
  legend: "Number of Events",
  legend_precision: 1,
  info_legend: " Events ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precip_events.json",
  color_ranges: {
    'gt1in': colorbrewer.Purples[7],
    'gt2in': colorbrewer.Purples[7],
    'gt4in': colorbrewer.Purples[7],
  },
  all_metrics: {
    'gt1in': "Greater than 1\" Precipitation",
    'gt2in': "Greater than 2\" Precipitation",
    'gt4in': "Greater than 4\" Precipitation",
  }
});
