var TransitionMap = ee.ImageCollection('projects/JRC/TMF/v1_2019/TransitionMap_MainClasses').mosaic();
var tmf_t = ee.Image(TransitionMap);
var year = '2022'
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var ft_selected_prot = ft.filterMetadata('protection', 'equals', 'protected');
var ft_selected_unprot = ft.filterMetadata('protection', 'equals', 'unprotected' );

Map.addLayer(ft_selected_prot);
var out_prot = tmf_t.reduceRegions({
  'collection': ft_selected_prot,
  'reducer': ee.Reducer.frequencyHistogram(),
  'scale':30
}).map(function(f) {
  var hist = f.get("histogram")
  var features = ee.Dictionary(hist).map(function(key, value) {
    return ee.Feature(null).set({
      "class": key, 
      "area_sqkm":((ee.Number(value).round()).multiply(900)).divide(1000000),
      "id": f.get("isoa3_id"),
    })
  }).values()
  return ee.FeatureCollection(ee.List(features))
}).flatten();

 Export.table.toDrive({
  collection: out_prot,
  description: 'transition_TMF_GAUL',
  fileFormat: 'CSV'
});
print (out_prot)

var out_unprot = tmf_t.reduceRegions({
  'collection': ft_selected_unprot,
  'reducer': ee.Reducer.frequencyHistogram(),
  'scale':30
}).map(function(f) {
  var hist = f.get("histogram")
  var features = ee.Dictionary(hist).map(function(key, value) {
    return ee.Feature(null).set({
      "class": key, 
      "area_sqkm":((ee.Number(value).round()).multiply(900)).divide(1000000),
      "id": f.get("isoa3_id"),
    })
  }).values()
  return ee.FeatureCollection(ee.List(features))
}).flatten();

 Export.table.toDrive({
  collection: out_unprot,
  description: 'transition_TMF_GAUL',
  fileFormat: 'CSV'
});
print (out_unprot)
