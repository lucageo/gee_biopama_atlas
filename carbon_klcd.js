
var image = ee.Image('WCMC/biomass_carbon_density/v1_0/2010');

Map.addLayer(ee.Image(1), {min: 0, max: 1}, 'base_map');
Map.addLayer(
    image, {
      min: 1,
      max: 180,
      palette: ['d9f0a3', 'addd8e', '78c679', '41ab5d', '238443', '005a32']
    },
    'carbon_tonnes_per_ha');



var regions = ee.FeatureCollection('projects/ee-lucabattistellageo/assets/KLCD_2023');
Map.addLayer(regions);

var carbon = image

var stats_carbon = carbon.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum(),
  'scale': 100

});


Export.table.toDrive({
  collection: stats_carbon,
  description:'stats_carbon_KLCD',
  fileFormat: 'CSV',
  selectors:["NAME","area_km2","total_pop","sum"]
});

