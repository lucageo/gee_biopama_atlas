var display = true; 
var scale = 30; 
var year = '2006'
var ft = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);
var ft_selected_prot = ft.filterMetadata('protection', 'equals', 'protected');
var ft_selected_unprot = ft.filterMetadata('protection', 'equals', 'unprotected' );

var burnedArea = ee.ImageCollection('ESA/CCI/FireCCI/5_1').filterDate('2006-01-01', '2006-12-31').select('BurnDate');
var burnedarea_sum = ee.Image(burnedArea.reduce(ee.Reducer.sum()).clip(ft));
var area = ee.Image.pixelArea();
var burntArea = burnedarea_sum.multiply(area).rename('burntArea');
burnedarea_sum = burnedarea_sum.addBands(burntArea);


var stats_prot = burntArea.divide(1000000).reduceRegions({
  'collection': ft_selected_prot,
  'reducer': ee.Reducer.sum(),
  'scale': scale

});
var stats_unprot = burntArea.divide(1000000).reduceRegions({
  'collection': ft_selected_unprot,
  'reducer': ee.Reducer.sum(),
  'scale': scale

});


var taskParams = { 'folder' : 'burned', 'fileFormat' : 'CSV' };

Export.table(stats_prot, 'burned_prot_'+year, taskParams);
Export.table(stats_unprot, 'burned_unprot_'+year, taskParams);



var style_prot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': '94e1aa'}
Map.addLayer(ft_selected_prot.style(style_prot), {})
var style_unprot = {'color': 'ffffff', 'width': 1, 'lineType': 'solid', 'fillColor': 'fcb100'}
Map.addLayer(ft_selected_unprot.style(style_unprot), {})
var baVis = {min: 1, max: 454798734, palette: ['ff0000']};
Map.addLayer(burnedarea_sum.select('burntArea'), baVis, 'Burned Area');
