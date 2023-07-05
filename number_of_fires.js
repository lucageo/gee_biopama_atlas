var year = '2001'
var start_year = '2004-01-01'
var end_year = '2004-12-31'

var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);


// Filter fire with more than 50% confidence and add a new band representing areas where confidence of fire > 50%
var filterConfidence = function(image) {
  var line_number = image.select('line_number');
  var confidence = image.select('confidence');
  var conf_50 = confidence.gt(50).rename('confidence_50');
  var count_band = line_number.updateMask(conf_50).rename('count');
  return image.addBands(count_band);
};


var prot_out = ft.map(function(feature) {
  
var fire = ee.ImageCollection('FIRMS')
             .filterBounds(feature.geometry())
             .filterDate(start_year, end_year);
  
var fire_conf = fire.map(filterConfidence);
var fire_ind_count =fire_conf.map(function(img) {
  var vals = img.reduceRegion({
    reducer: ee.Reducer.countDistinct(),
    scale: 1000,
    geometry: feature.geometry()
  });
  return img.set(vals);
});
  var total_fires2 =  fire_ind_count.aggregate_sum('count');
  
  return  ee.Feature(null, {result: total_fires2}).set({
        "iso3": feature.get("isoa3_id"),
        "protection" : feature.get("protection"),
        "iso3_" : feature.get("isoa3_id_1")
    })

});


Export.table.toDrive({collection: prot_out, 
                      folder: 'fires',
                      description: "Fires_"+year, 
                      fileNamePrefix: "Fires_"+year,
                      selectors:["protection","iso3_","iso3","result"]
                      });




var dataset = ee.ImageCollection('FIRMS').filterDate(start_year, end_year);
var fires = dataset.select('T21');
var firesVis = {
  min: 325.0,
  max: 400.0,
  palette: ['red', 'orange', 'yellow'],
};
Map.addLayer(fires, firesVis, 'Fires');



