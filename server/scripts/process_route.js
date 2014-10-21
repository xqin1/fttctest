var table1 = "1DZJNITp9hTDEL88kKqVz1Iukfp5OENKEvMH-Sjcp";
var apiKey = "AIzaSyBUcrnc-5Y3rVaWKJlx0EadasWDxoRy__4";

var axles = [2,3,4,5,6,7,8];
var routes = {"routes": []};
var count=0;
var routeCount=0;

function getAllRoutes(){
    $.getJSON('valid_end_points.json')
        .done(function(data){
            data.results.forEach(function(d){
                startExitName = myExitName = startPoint = d.startExitName;
                startFacilityID = myFacilityID = d.startFacilityID;
                startMilePost =  myExitMilepost = d.startExitMilepost;
                startExitNumber = myExitNum = d.startExitNum;
                routeStartNumber = myExitNumber = d.startExitNumber;

                //the if statement is for test purpose, use an invalid value to get entire json
                //if (myExitName !== 'Harden Blvd.!'){
                  if (myFacilityID !== 'MM'){
                    var route = {};
                    route.startPoint = {};
                    route.startPoint.facilityID = startFacilityID;
                    route.startPoint.exitName = startExitName;
                    route.startPoint.exitNum = startExitNumber;
                    route.endPoints = [];
                    getStartingExitData(myExitName,myExitMilepost,myFacilityID);
                    d.endExits.forEach(function(e){
                        if (e.exitFacilityType == 'Exit' && e.exitNum !== '21A/B' && startExitNumber != '21A/B'){ //for SG line, no code handle 21A/B
                            routeCount++;
                            var endPoint = {};
                            endMilePost = myExitMilepost = e.exitMilepost;
                            endExitNumber = myExitNum = e.exitNum;
                            routeEndNumber = myExitNumber = e.exitNumber;
                            endFacilityID = myFacilityID = e.exitFacilityID;
                            endExitName = myExitName = e.exitName.replace("'","\\'");
                            getEndingExitData(myExitName,myExitMilepost,myFacilityID);
                            //console.log("end " + myExitName);

                            endPoint.facilityID = endFacilityID;
                            endPoint.exitName = endExitName;
                            endPoint.exitNum = endExitNumber;

                            myNewWhere = '';
                           // var whereCon = filterMyRoute();
                            //console.log('start ' + startFacilityID + 'end ' + endFacilityID)
                            endPoint.whereSectionIDs = filterMyRoute();
                           // console.log("whereCon " + JSON.stringify(endPoint.whereSectionIDs));

                           // console.log(startExitNumber + " " + startFacilityID + " " + endExitNumber + " " + endFacilityID);


                            endPoint.tollAmounts = [];

                            axles.forEach(function(a){
                                var tollAmount = {};
                                tollAmount.routeAmount = {};
                                tollAmount.axle = a;

                                updateAxleData(a);
                                calculateToll();
                                //process toll amount
                                if (myTollAmounts[0].hasOwnProperty('getOriginal')){
                                    tollAmount.sp = parseFloat(myTollAmounts[0].getOriginal().toFixed(2));
                                    tollAmount.cash = parseFloat(myTollAmounts[1].getOriginal().toFixed(2));
                                    tollAmount.miles = parseFloat(myTollAmounts[2].getOriginal().toFixed(2));
                                }
                                else{
                                    tollAmount.sp = parseFloat(myTollAmounts[0]);
                                    tollAmount.cash = parseFloat(myTollAmounts[1]);
                                    tollAmount.miles = parseFloat(myTollAmounts[2]);
                                }

                                //process route amount
                                tollAmount.routeAmount.start={};
                                tollAmount.routeAmount.end={};
                                //if there're toll plazas in-between
                                if (myInlineTollPlazas.length > 2){
                                    tollAmount.routeAmount.tollPlazas = [];
                                }
                                for (var i =0; i < myInlineTollPlazas.length; i++){
                                    //for start point
                                    if(i==0){

                                        tollAmount.routeAmount.start.sp = parseFloat(myInlineTollPlazas[i][0].split('$')[1]);
                                        tollAmount.routeAmount.start.cash = parseFloat(myInlineTollPlazasCASH[i][0].split('$')[1]);
                                    }
                                    //for end point
                                    else if (i == myInlineTollPlazas.length-1){
                                        tollAmount.routeAmount.end.sp = parseFloat(myInlineTollPlazas[i][0].split('$')[1]);
                                        tollAmount.routeAmount.end.cash = parseFloat(myInlineTollPlazasCASH[i][0].split('$')[1]);
                                    }
                                    //for inline plaza
                                    else{
                                        var tollPlaza = {};
                                        tollPlaza.name = myInlineTollPlazas[i][0].split('-')[0].trim();
                                        tollPlaza.sp = parseFloat(myInlineTollPlazas[i][0].split('$')[1]);
                                        tollPlaza.cash = parseFloat(myInlineTollPlazasCASH[i][0].split('$')[1]);
                                        tollAmount.routeAmount.tollPlazas.push(tollPlaza);
                                    }

                                }
                                endPoint.tollAmounts.push(tollAmount);

                            })
                            route.endPoints.push(endPoint);
                        }
                    })

                    routes.routes.push(route);
                }
            });

            //now get the section IDs for each route
            routes.routes.forEach(function(route,routesIdx){
                getSectionID(route,routesIdx)
            })

            console.log('routeCount ' + routeCount);
        })

    function getSectionID(route,routesIdx){
        route.endPoints.forEach(function(endPoint,endPointIdx){
            var qGetSectionID = "select TP_Section_ID ";
            var whereClause;


            if (endPoint.whereSectionIDs.firstWhere=='N/A') {
                endPoint.whereSectionIDs.firstWhere = "name = ''";
            }
            if (endPoint.whereSectionIDs.secondWhere=='N/A') {
                endPoint.whereSectionIDs.secondWhere = "name =''";
            }
            var whereClause = " where " + endPoint.whereSectionIDs.firstWhere.replace('A/B',''); //replace for B line 3A/B exit
            var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table1 + whereClause + "&key=" + apiKey;

            jQuery.ajax({
                type: "GET",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){
                    processFirstSectionIDs(data,routesIdx, endPointIdx,endPoint,qGetSectionID);
                },
                error: getError
            });
        })
    }

    function processFirstSectionIDs(data,routesIdx,endPointIdx, endPoint,qGetSectionID){
        var sectionIDs = [];
        if (typeof data.rows !== 'undefined'){
           // console.log(routes.routes[routesIdx].startPoint.facilityID + " " +  routes.routes[routesIdx].startPoint.exitNum + " " + endPoint.facilityID + " " + endPoint.exitNum + " " + JSON.stringify(endPoint.whereSectionIDs));
            data.rows.forEach(function(r){
                sectionIDs.push(r[0]);
            })
        }

        var whereClause = " where " + endPoint.whereSectionIDs.secondWhere;
        var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table1 + whereClause + "&key=" + apiKey;
        jQuery.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                processSecondSectionIDs(data,routesIdx, endPointIdx,sectionIDs);
            },
            error: getError
        });

    }

    function processSecondSectionIDs(data,routesIdx,endPointIdx,sectionIDs){
//        console.log(data);
//        console.log(routesIdx + " " + endPointIdx);
       // console.log('1 ' + sectionIDs);
        count++;

        if (typeof data.rows !== "undefined"){
            data.rows.forEach(function(r){
                sectionIDs.push(r[0]);
            })
        }

       // console.log('2 ' + sectionIDs)
        routes.routes[routesIdx].endPoints[endPointIdx].sectionIDs = sectionIDs;
        delete routes.routes[routesIdx].endPoints[endPointIdx].whereSectionIDs;

        if (count == routeCount){
            //console.log(count);
            console.log(JSON.stringify((routes)));
        }
    }


    function getError(jqXHR, status){
        console.log(status);
    }
}


