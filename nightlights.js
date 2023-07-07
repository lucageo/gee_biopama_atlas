

var year = '2022'

var regions = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);

//// Load nightlights image collection
var collection = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG');

//// create list of years over which to iterate
var years = ee.List.sequence(2014, 2022);

//// Iterate through years and create a mean image per year
var images_by_year = years.map(function(year) {
    var filtered = collection.filter(ee.Filter.calendarRange(year, year, 'year'));
    return filtered.mean().set('year', year);
  });

//// Make the result an Image Collection
var mean_collection = ee.ImageCollection(images_by_year);

//// Calculate mean value per boundary per image in the mean image collection
var results = mean_collection.map(function(image) {
  return image.reduceRegions({
    collection: regions,
    reducer: ee.Reducer.mean(),
    scale: 500
  }).map(function(f) {
    // Add a year property to each output feature
    return f.set('year', image.get('year'));
  });
});


//// Flatten the results
var nl_viirs = ee.FeatureCollection(results).flatten();

////Export the output feature collection to Google Drive as a csv file
Export.table.toDrive({collection:nl_viirs, selectors:["protection","avg_rad","isoa3_id","year"]});


////Add the output feature collection to the map
Map.addLayer(nl_viirs);
