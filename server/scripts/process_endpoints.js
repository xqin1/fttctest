//https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20*%20from%201XIhyopjBlApVgVaWEuzb0H8U3ok01VB5J4-OIY5i&key=AIzaSyBUcrnc-5Y3rVaWKJlx0EadasWDxoRy__4
var table = "1XIhyopjBlApVgVaWEuzb0H8U3ok01VB5J4-OIY5i";
var apiKey = "AIzaSyB5oIPDQ1kareIwmSU6yj6OA_E3d2Hqq2w";

var myFacType,lat,lon;
var validEndExits = {"results":[]};
var exitCount=0;
var processCount = 0;

function getAllExits() {
    var qGetAllExits = "select Name,FacilityType,FacilityName,FacilityID,ExitNum,ExitNumber, Milepost,geometry,Sunpass_Only ";
    var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetAllExits + "from " + table + "&key=" + apiKey;

    jQuery.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: processAllExits,
        error: getError
    });
};

function processAllExits(data,status,jqXHR){
    exitCount = data.rows.length;

    data.rows.forEach(function(d, i){
        //assing variables, which are defined as global in TP_Map.html
        myExitName = d[0];
        myExitName = myExitName.replace("'","\\'")
        myFacType = d[1];
        myFacility = d[2];
        myFacilityID = d[3];
        myExitNum = d[4];
        myExitNumber = d[5];
        myExitMilepost = d[6];
        lat = d[7].geometry.coordinates[1];
        lon = d[7].geometry.coordinates[0];

        myWhere = '';

        //for Sunpass payment, this basically set NO filter for sunpassOnly exit and we'll assign the attribute to resulting exits
        if (myFacType === 'Exit') {
            setStartPoint(myExitName, lat, lon);

            //for some exits (e.g 255), they can not be as start point
            if (myWhere != '') {
                var qGetValidExits = "select Name,FacilityType,FacilityName,FacilityID,ExitNum,ExitNumber, " +
                    "Milepost,geometry,Sunpass_Only ";
                var whereClause = " where " + myWhere;
                var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetValidExits + "from " + table + whereClause + "&key=" + apiKey;
                requestValidExits(myExitName, myFacilityID, myExitNum, myExitNumber,url);
            }
            else{
                processCount++;
            }
        }
        else{
            processCount++;
        }

    })

}

function requestValidExits(myExitName, myFacilityID, myExitNum,myExitNumber,url){
    var validEndExit = {};
    validEndExit.startExitName = myExitName;
    validEndExit.startFacType = myFacType;
    validEndExit.startFacility = myFacility;
    validEndExit.startFacilityID = myFacilityID;
    validEndExit.startExitNum = myExitNum;
    validEndExit.startExitNumber = myExitNumber;
    validEndExit.startExitMilepost = parseFloat(myExitMilepost);
    validEndExit.coordinates = {};
    validEndExit.coordinates.lat = lat;
    validEndExit.coordinates.lon = lon;

    jQuery.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            processValidExits(data,validEndExit);
        },
        error: getError
    });
}

function processValidExits(data,validEndExit){
    validEndExit.endExits=[];
    //console.log(data.rows.length);
    data.rows.forEach(function(d){
        var exitObj = {};
        if (validEndExit.startExitName == d[0] && validEndExit.startExitNum == d[4]) {
            //same as start facility, do nothing
        }
        else {
            exitObj.exitName = d[0];
            exitObj.exitFacilityType = d[1];
            exitObj.exitFacility = d[2];
            exitObj.exitFacilityID = d[3];
            exitObj.exitNum = d[4];
            exitObj.exitNumber = d[5];
            exitObj.exitMilepost = parseFloat(d[6]);
            exitObj.sunPassOnly = d[8]=="Yes" ? true: false;
            exitObj.coordinates = {};
            exitObj.coordinates.lat = d[7].geometry.coordinates[1];
            exitObj.coordinates.lon = d[7].geometry.coordinates[0];
            validEndExit.endExits.push(exitObj);
        }
        else{
            console.log(d[0])
        }
    });
    validEndExits.results.push(validEndExit);

    processCount++;
    //console.log(processCount);

    if (processCount == exitCount){
        console.log("count " + exitCount);
        console.log(JSON.stringify((validEndExits)));
    }
}

function getError(jqXHR, status){
    console.log(status);
}
