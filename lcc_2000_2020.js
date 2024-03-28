
var landmask = ee.Image("projects/glad/OceanMask").lte(1)
var tmf_t =ee.Image('projects/glad/GLCLU2020/v2/LCLUC').updateMask(landmask);

var year = '2022'
var dataset = ee.FeatureCollection('projects/ee-biopama/assets/pas_'+year);

Map.addLayer(dataset);
 
var out = tmf_t.reduceRegions({
  'collection': dataset,
  'reducer': ee.Reducer.frequencyHistogram(),
  'scale':30
}).map(function(f) {
  var hist = f.get("histogram")
  var features = ee.Dictionary(hist).map(function(key, value) {
    return ee.Feature(null).set({
      "class": key, 
      "area_sqkm":((ee.Number(value).round()).multiply(900)).divide(1000000),
      "isoa3_id": f.get("isoa3_id"),
      "protection": f.get("protection"),

    })
  }).values()
  return ee.FeatureCollection(ee.List(features))
}).flatten();

print (out)
Export.table.toDrive({
  collection: out,
  description: 'lcc_2000_2020',
  fileFormat: 'CSV'
});


  
var visParamMap = {"min":0,"max":255,"palette":["FEFECC","FAFAC3","F7F7BB","F4F4B3","F1F1AB","EDEDA2","EAEA9A","E7E792","E4E48A",
"E0E081","DDDD79","DADA71","D7D769","D3D360","D0D058","CDCD50","CACA48","C6C63F","C3C337","C0C02F","BDBD27","B9B91E","B6B616",
"B3B30E","B0B006","609C60","5C985C","589558","549254","508E50","4C8B4C","488848","448544","408140","3C7E3C","387B38","347834",
"317431","2D712D","296E29","256B25","216721","1D641D","196119","155E15","115A11","0D570D","095409","065106","643700","643a00",
"643d00","644000","644300","644600","644900","654c00","654f00","655200","655500","655800","655a00","655d00","656000","656300",
"666600","666900","666c00","666f00","667200","667500","667800","667b00","ff99ff","FC92FC","F98BF9","F685F6","F37EF3","F077F0",
"ED71ED","EA6AEA","E763E7","E45DE4","E156E1","DE4FDE","DB49DB","D842D8","D53BD5","D235D2","CF2ECF","CC27CC","C921C9","C61AC6",
"C313C3","C00DC0","BD06BD","bb00bb","000003","000004","000005","BFC0C0","B7BDC2","AFBBC4","A8B8C6","A0B6C9","99B3CB","91B1CD",
"89AFD0","82ACD2","7AAAD4","73A7D6","6BA5D9","64A3DB","5CA0DD","549EE0","4D9BE2","4599E4","3E96E6","3694E9","2E92EB","278FED",
"1F8DF0","188AF2","1088F4","0986F7","55A5A5","53A1A2","519E9F","4F9B9C","4D989A","4B9597","499294","478F91","458B8F","43888C",
"418589","3F8286","3D7F84","3B7C81","39797E","37767B","357279","336F76","316C73","2F6970","2D666E","2B636B","296068","285D66",
"bb93b0","B78FAC","B48CA9","B189A6","AE85A2","AA829F","A77F9C","A47B99","A17895","9E7592","9A718F","976E8C","946B88","916885",
"8D6482","8A617F","875E7B","845A78","815775","7D5472","7A506E","774D6B","744A68","714765","de7cbb","DA77B7","D772B3","D46EAF",
"D169AB","CE64A8","CB60A4","C85BA0","C4579C","C15298","BE4D95","BB4991","B8448D","B54089","B23B86","AF3682","AB327E","A82D7A",
"A52976","A22473","9F1F6F","9C1B6B","991667","961264","000000","000000","000000",
"1964EB","1555E4","1147DD","0E39D6","0A2ACF","071CC8","030EC1","0000BA",
"0000BA","040464","0000FF","3051cf","000000","000000","000000","000000",
"000000","000000","000000","000000","000000","000000","000000","000000",
"000000","000000","000000","000000","000000","000000","000000","000000",
"547FC4","4D77BA","466FB1","4067A7","395F9E","335895","335896","335897","ff2828","ffffff","d0ffff","ffe0d0","ff7d00","fac800","c86400",
"fff000","afcd96","afcd96","64dcdc","00ffff","00ffff","00ffff","111133","000000"]};
  


Map.addLayer(tmf_t,visParamMap,'2000-2020 land cover and land use change')
