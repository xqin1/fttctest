'use strict';
var fs = require('fs');
var endPointData1 = fs.readFileSync('./data/valid_end_points_raw.json', 'utf8');

var endPointData = JSON.parse(endPointData1);

endPointData.results.forEach(function(endPoint){
    //for impossible trip: http://nodejsapi-maryland.rhcloud.com/api/routing/route/startFacilityID/H/startExitNum/16/endFacilityID/M/endExitNum/240/axleCount/2
    if (endPoint.startFacilityID == 'H' && endPoint.startExitNumber == '16'){
        var h16StartEndExits = [];
        endPoint.endExits.forEach(function(endExit, endExitIndex){
            if (endExit.exitFacilityID == 'M' && endExit.exitNumber == '240') {
                endPoint.endExits.splice(endExitIndex, 1);
            }
            else if (endExit.exitFacilityID == 'M' && endExit.exitNumber == '244'){

            }
            else {
                h16StartEndExits.push(endPoint.endExits[endExitIndex]);
            }
        })
        endPoint.endExits = h16StartEndExits;
    }
    //for I-4 connector
    if (endPoint.startFacilityID == 'S') {
        console.log(endPoint.startExitNumber + " " + endPoint.startExitName)
        console.log(endPoint);
    }
})

//verify Facility H16, M240 and H16, M244 are gone
var exist = false;
endPointData.results.forEach(function(endPoint){
    //for impossible trip: http://nodejsapi-maryland.rhcloud.com/api/routing/route/startFacilityID/H/startExitNum/16/endFacilityID/M/endExitNum/240/axleCount/2
    if (endPoint.startFacilityID == 'H' && endPoint.startExitNumber == '16'){
        endPoint.endExits.forEach(function(endExit, endExitIndex){
            if (endExit.exitFacilityID == 'M' && endExit.exitNumber == '240') {
                exist = true;
            }
            else if (endExit.exitFacilityID == 'M' && endExit.exitNumber == '240') {
                exist = true;
            }
        })
    }
})
if (!exist){
    console.log('remove sucess');
}

//fs.writeFile(__dirname + '/../data/valid_end_points.json', JSON.stringify(endPointData), function (err, done) {
//    if (err) throw err;
//    console.log("end point data finished")
//})