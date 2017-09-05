RendererTemplates.ma_projected_climate_data("ma_projected_precipitation", {
  title: "MA Projected Precipitation ",
  legend: "Inches",
  legend_precision: 2,
  info_legend: "Inches of ",
  data_url: "https://repository.nescaum-ccsc-dataservices.com/data/ma/precipitation.json",
  color_ranges: {
    'tot': colorbrewer.Blues[7],
  },
  all_metrics: {
    "tot" : "Total Precipitation",
  }
});
