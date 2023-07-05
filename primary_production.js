
var year = '2016'

var dataset = ee.ImageCollection('MODIS/006/MOD17A2H').filter(ee.Filter.date('2015-01-01', '2015-12-01')).select('Gpp');
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);

var pp = ee.Image(dataset.reduce(ee.Reducer.sum()).clip(ft));

var pp_out = pp.reduceRegions({
  'collection': ft,
  'reducer': ee.Reducer.sum(),
  'scale': 500
});

Export.table.toDrive({collection: pp_out, 
                      folder: 'primaryprod',
                      description: "pp_"+year, 
                      fileNamePrefix: "pp_"+year,
                      selectors:["protection","isoa3_id_1","isoa3_id ","sum"]
                      });
                      
                      
var gppVis = {
  min: 0,
  max: 10000,
  palette: ['bbe029', '0a9501', '074b03'],
};

Map.addLayer(pp, gppVis, 'GPP');
