RendererTemplates.ma_historical_climate_data("ma_historical_precipitation", {
  title: "MA Historical Precipitation ",
  legend: "Inches",
  legend_precision: 2,
  info_legend: "Inches of ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precipitation.json",
  color_ranges: {
    'tot': colorbrewer.Purples[7],
  },
  all_metrics: {
    "tot" : "Total Precipitation",
  }
});
