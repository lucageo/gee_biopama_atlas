var display = true; 
var scale = 30; 
var display = true; 
var scale = 30;
var year = '2022'
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var ft_selected_prot = ft.filterMetadata('protection', 'equals', 'protected');
var ft_selected_unprot = ft.filterMetadata('protection', 'equals', 'unprotected' );


var image = ee.Image("JRC/GSW1_3/GlobalSurfaceWater").clip(ft);


var transitions = image.select('transition');
//Permanent prot
var permanent = transitions.eq(1).multiply(ee.Image.pixelArea().divide(1000000))
var stats_p_prot = permanent.reduceRegions({
  'collection': ft_selected_prot,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});
//seasonal prot
var seasonal = transitions.eq(4).multiply(ee.Image.pixelArea().divide(1000000))
var stats_s_prot = seasonal.reduceRegions({
  'collection': ft_selected_prot,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});
//Permanent unprot
var permanent = transitions.eq(1).multiply(ee.Image.pixelArea().divide(1000000))
var stats_p_unprot = permanent.reduceRegions({
  'collection': ft_selected_unprot,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});
//seasonal unprot
var seasonal = transitions.eq(4).multiply(ee.Image.pixelArea().divide(1000000))
var stats_s_unprot = seasonal.reduceRegions({
  'collection': ft_selected_unprot,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});
// export data
Export.table.toDrive({
  collection: stats_p_prot,
  description:'Permanent_prot_'+year,
  fileFormat: 'CSV',
  selectors:["isoa3_id","sum"]
});
Export.table.toDrive({
  collection: stats_s_prot,
  description:'Seasonal_prot_'+year,
  fileFormat: 'CSV',
  selectors:["isoa3_id","sum"]
});
// export data
Export.table.toDrive({
  collection: stats_p_unprot,
  description:'Permanent_unprot_'+year,
  fileFormat: 'CSV',
  selectors:["isoa3_id","sum"]
});
Export.table.toDrive({
  collection: stats_s_unprot,
  description:'Seasonal_unprot_'+year,
  fileFormat: 'CSV',
  selectors:["isoa3_id","sum"]
});
print(stats_s_unprot)
print(stats_p_unprot)
Map.addLayer(ft);
Map.addLayer(transitions.mask(transitions), {'palette': 'blue'}, 'water', display); 
