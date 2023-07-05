var display = true; 
var scale = 30; 
var year = '2022'
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var GoogleDrivefolder = 'burned'; //to be changed 
var burnedArea = ee.ImageCollection('ESA/CCI/FireCCI/5_1').filterDate('2020-01-01', '2020-12-31').select('BurnDate');
var burnedarea_sum = ee.Image(burnedArea.reduce(ee.Reducer.sum()).clip(ft));
var area = ee.Image.pixelArea();
var burntArea = burnedarea_sum.multiply(area).rename('burntArea');
burnedarea_sum = burnedarea_sum.addBands(burntArea);




var stats = burntArea.divide(1000000).reduceRegions({
  'collection': ft,
  'reducer': ee.Reducer.sum(),
  'scale': scale

});


Export.table.toDrive({
  collection: stats,
  description:'Burned_'+year,
  fileFormat: 'CSV',
  folder: GoogleDrivefolder,
  selectors:["isoa3_id","isoa3_id_1","protection","sum"]
});



var baVis = {min: 1, max: 454798734, palette: ['ff0000']};
Map.addLayer(burnedarea_sum.select('burntArea'), baVis, 'Burned Area');

