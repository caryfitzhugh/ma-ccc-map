RendererTemplates.ma_projected_climate_data("ma_projected_precipitation", {
  title: "MA Projected Precipitation ",
  legend: "Inches",
  legend_precision: 1,
  info_legend: " Inches",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precipitation.json",
  color_ranges: {
    'tot': colorbrewer.Blues[7],
  },
  all_metrics: {
    "tot" : "Total Precipitation",
  }
});
