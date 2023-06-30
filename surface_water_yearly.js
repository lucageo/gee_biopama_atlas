var gswYearly = ee.ImageCollection("JRC/GSW1_4/YearlyHistory");
var scale = 30;
var year = '2022'
var GoogleDrivefolder = 'water'; //to be changed 
var filtered = gswYearly.filter(ee.Filter.eq('year', 2021))
var gsw2020 = ee.Image(filtered.first())

var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
Map.addLayer(ft);

var seasonal = gsw2020.eq(2).multiply(ee.Image.pixelArea().divide(1000000))
var stats_s = seasonal.reduceRegions({
  'collection': ft,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});


var permanent = gsw2020.eq(3).multiply(ee.Image.pixelArea().divide(1000000))

var stats_p = permanent.reduceRegions({
  'collection': ft,
  'reducer': ee.Reducer.sum(),
  'scale': scale
});

Export.table.toDrive({
  collection: stats_p,
  description:'Permanent_'+year,
  fileFormat: 'CSV',
  folder: GoogleDrivefolder,
  selectors:["isoa3_id","protection","sum"]
});

Export.table.toDrive({
  collection: stats_s,
  description:'Seasonal_'+year,
  fileFormat: 'CSV',
  folder: GoogleDrivefolder,
  selectors:["isoa3_id","protection","sum"]
});
