var display = true; 
var scale = 30;
var year = '2011'
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var ft_selected_prot = ft.filterMetadata('protection', 'equals', 'protected');
var ft_selected_unprot = ft.filterMetadata('protection', 'equals', 'unprotected' );


var dataset = ee.Image('UMD/hansen/global_forest_change_2021_v1_9').clip(ft);


//-----> APPLY YOUR FILTER HERE 1 = 2001 - 21 = 2021
var dataset_year = dataset.select(['lossyear']).gt(6).and(dataset.select(['lossyear']).lt(12)).selfMask();


var areaImage = dataset_year.multiply(ee.Image.pixelArea());
var stats_prot = areaImage.divide(1000000).reduceRegions({
  'collection': ft_selected_prot,
  'reducer': ee.Reducer.sum(),
  'scale': scale

});
var stats_unprot = areaImage.divide(1000000).reduceRegions({
  'collection': ft_selected_unprot,
  'reducer': ee.Reducer.sum(),
  'scale': scale

});



var treeLossVisParam = {palette: ['red']};
Map.addLayer(dataset_year, treeLossVisParam, 'tree loss year');


var taskParams = { 'folder' : 'forest', 'fileFormat' : 'CSV' };

Export.table(stats_prot, 'Forest_Loss_prot_'+year, taskParams);
Export.table(stats_unprot, 'Forest_Loss_unprot_'+year, taskParams);



var style_prot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': '94e1aa'}
Map.addLayer(ft_selected_prot.style(style_prot), {})
var style_unprot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': 'fcb100'}
Map.addLayer(ft_selected_unprot.style(style_unprot), {})
var treeLossVisParam = {palette: ['red']};

