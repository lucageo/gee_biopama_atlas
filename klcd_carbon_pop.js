var baseChange =
    [{featureType: 'all', stylers: [{saturation: -100}, {lightness: 45}]}];
Map.setOptions('baseChange', {'baseChange': baseChange});
var image1975 = ee.Image('JRC/GHSL/P2023A/GHS_POP/1975');
var image1990 = ee.Image('JRC/GHSL/P2023A/GHS_POP/1990');
var image2020 = ee.Image('JRC/GHSL/P2023A/GHS_POP/2020');
var image2030 = ee.Image('JRC/GHSL/P2023A/GHS_POP/2030');
var imageabgc = ee.Image('WCMC/biomass_carbon_density/v1_0/2010');

image1975 = image1975.updateMask(image1975.gt(0));
image1990 = image1990.updateMask(image1990.gt(0));
image2020 = image2020.updateMask(image2020.gt(0));
image2030 = image2030.updateMask(image2030.gt(0));

var regions = ee.FeatureCollection('projects/ee-falkobuschke/assets/NaturAfrica');

var col_2030 = image2030
var col_2020 = image2020
var col_1990 = image1990
var col_1975 = image1975


var stats75 = col_1975.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum().setOutputs(['sum_1975']),
  'scale': 100

});

var stats90 = col_1990.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum().setOutputs(['sum_1990']),
  'scale': 100

});

var stats20 = col_2020.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum().setOutputs(['sum_2020']),
  'scale': 100

});

var stats30 = col_2030.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum().setOutputs(['sum_2030']),
  'scale': 100

});

var stats_carbon_sum = imageabgc.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.sum().setOutputs(['sum_carbon']),
  'scale': 300

});

var stats_carbon_avg = imageabgc.reduceRegions({
  'collection': regions,
  'reducer': ee.Reducer.mean().setOutputs(['mean_carbon']),
  'scale': 300

});

var ret = ee.Join.inner().apply(stats75, stats90, 
ee.Filter.equals({  leftField:"ID",   rightField: "ID"}))
    .map(function(f) { 
      return ee.Feature(f.get('primary')).set(ee.Feature(f.get('secondary')).toDictionary())
    })
var ret2 = ee.Join.inner().apply(ret, stats20, 
ee.Filter.equals({  leftField:"ID",   rightField: "ID"}))
    .map(function(f) { 
      return ee.Feature(f.get('primary')).set(ee.Feature(f.get('secondary')).toDictionary())
    })
var ret3 = ee.Join.inner().apply(ret2, stats30, 
ee.Filter.equals({  leftField:"ID",   rightField: "ID"}))
    .map(function(f) { 
      return ee.Feature(f.get('primary')).set(ee.Feature(f.get('secondary')).toDictionary())
    })
    
var ret4 = ee.Join.inner().apply(ret3, stats_carbon_sum, 
ee.Filter.equals({  leftField:"ID",   rightField: "ID"}))
    .map(function(f) { 
      return ee.Feature(f.get('primary')).set(ee.Feature(f.get('secondary')).toDictionary())
    })
var ret5 = ee.Join.inner().apply(ret4, stats_carbon_avg, 
ee.Filter.equals({  leftField:"ID",   rightField: "ID"}))
    .map(function(f) { 
      return ee.Feature(f.get('primary')).set(ee.Feature(f.get('secondary')).toDictionary())
    })
    
Export.table.toDrive({
  collection: ret3,
  description:'KLCD_all_out',
  fileFormat: 'CSV',
    selectors:["ID","sum_1975","sum_1990","sum_2020","sum_2030","sum_carbon","mean_carbon"]
});

print(ret5.limit(5))




