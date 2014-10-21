var fs = require('fs');

var schemaData = JSON.parse(fs.readFileSync(__dirname + '/../data/schema_data.json'));
var valid_end_points = JSON.parse(fs.readFileSync(__dirname + '/../data/valid_end_points.json'));

valid_end_points.results.forEach(function(v){
    var findMatch = false;
    schemaData.schemaData.regions.forEach(function(r){
        r.facilities.forEach(function(f){
            f.exits.forEach(function(e){
                if (v.startExitName == e.name){
                    findMatch = true;
                }
            })
        })
    })
    if (findMatch){

    }else{
        console.log(v.startExitName + ' ' + v.startFacility + ' ' + v.startExitNum + ' ' + v.startExitMilepost);
    }
})

