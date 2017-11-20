RendererTemplates.ma_observed_climate_data("ma_observed_growing_degree_days", {
  title: "Growing Degree Days",
  legend: "Growing Degree-Days (Observed)",
  legend_precision: 0,
  legend_units: "Accumulation",
  data_url: "https://adirondackatlas.org/api/v1/climateobs.php?parameter=growdegdays",
  color_range: colorbrewer.Greens[6],
});
