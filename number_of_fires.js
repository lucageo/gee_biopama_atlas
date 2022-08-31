
var year = '2006'
var start_year = '2002-01-01'
var end_year = '2006-01-01'

var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var ft_selected_prot = ft.filterMetadata('protection', 'equals', 'protected');
var ft_selected_unprot = ft.filterMetadata('protection', 'equals', 'unprotected' );

// Filter fire with more than 50% confidence and add a new band representing areas where confidence of fire > 50%
var filterConfidence = function(image) {
  var line_number = image.select('line_number');
  var confidence = image.select('confidence');
  var conf_50 = confidence.gt(50).rename('confidence_50');
  var count_band = line_number.updateMask(conf_50).rename('count');
  return image.addBands(count_band);
};


var prot_out = ft_selected_prot.map(function(feature) {
  
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
        "isoa3_id": feature.get("isoa3_id"),
        "name1" : feature.get("name1")
    })

});


Export.table.toDrive({collection: prot_out, 
                      folder: 'fires',
                      description: "Fires_"+year, 
                      fileNamePrefix: "Fires_"+year,
                      selectors:["isoa3_id","name1","result"]
                      });

var unprot_out = ft_selected_prot.map(function(feature) {
  
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
        "isoa3_id": feature.get("isoa3_id"),
        "name1" : feature.get("name1")
    })

});


Export.table.toDrive({collection: unprot_out, 
                      folder: 'fires',
                      description: "Fires_"+year, 
                      fileNamePrefix: "Fires_"+year,
                      selectors:["isoa3_id","name1","result"]
                      });


var dataset = ee.ImageCollection('FIRMS').filterDate(start_year, end_year);
var fires = dataset.select('T21');
var firesVis = {
  min: 325.0,
  max: 400.0,
  palette: ['red', 'orange', 'yellow'],
};
Map.addLayer(fires, firesVis, 'Fires');
var style_prot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': '94e1aa'}
Map.addLayer(ft_selected_prot.style(style_prot), {})
var style_unprot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': 'fcb100'}
Map.addLayer(ft_selected_unprot.style(style_unprot), {})
