module.exports.processSchemaData = function () {
    var DOMParser = require("xmldom").DOMParser,
        fs = require('fs'),
        csv = require('csv'),
        async = require("async");

    var xmlDoc = 'touchScreenTolls_2014',
        sections = 'TP_Sections_2014-V5_5',
        exitPoints = 'TurnpikeExits_2014-V5_5',
        TP_Sections = 'TP_Sections_2014-V5_5';

    //xml globals
    var xmlDoc;
    var facilityObject = new Array();
    var tollplazaObject = new Array();
    var exitsObject = new Array();
    var bridgeObject = new Array();  //Not currently used since Bridges was taken out of the latest XML doc
    var tsObject = new Array();

    var NB_ON_sunpass, NB_ON_cash,
        NB_OFF_sunpass, NB_OFF_cash,
        SB_ON_sunpass, SB_ON_cash,
        SB_OFF_sunpass, SB_OFF_cash,
        EB_ON_sunpass, EB_ON_cash,
        EB_OFF_sunpass, EB_OFF_cash,
        WB_ON_sunpass, WB_ON_cash,
        WB_OFF_sunpass, WB_OFF_cash;

    var RegionsBreakdowns = [
        {
            region: "Orlando Area",
            sections: [
                {
                    routeName: "Florida's Turnpike (SR 91)",
                    routeID: 'M',
                    description: "Florida's Turnpike, also designated as State Road 91, is a user-financed, limited-access toll road that runs 265 miles, through 11 counties, beginning near Miami in Miami-Dade County and terminating near Wildwood in Sumter County.",
                    lowExit: 240,
                    highExit: 309,
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Leesburg Toll Plaza',
                            csvName: 'Leesburg Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Beachline Expressway (SR 528)',
                    routeID: 'B',
                    description: "The Beachline Expressway is a 40-mile east-west tolled, limited-access transportation corridor serving Central Florida and the Space Coast.  The road is owned and operated by Florida’s Turnpike Enterprise, the Central Florida Expressway Authority (CFX), and the Florida Department of Transportation (FDOT).  Florida’s Turnpike Enterprise operates the western-most section from Interstate 4 (MP 0) to MP 8 as well as the eastern-most section from MP 31 to MP 40, while CFX operates the ‘in between’ section from MP 8 to milepost 31.",
                    descending: false,
                    tollPlazas: [
                        {
                            xmlName: 'Beachline West Toll Plaza',
                            csvName: 'Beachline West Toll Plaza'
                        },
                        {
                            xmlName: 'Airport Mainline Toll Plaza',
                            csvName: 'Airport Mainline Toll Plaza'
                        },
                        {
                            xmlName: 'Beachline Mainline Toll Plaza',
                            csvName: 'Beachline Mainline Toll Plaza'
                        },
                        {
                            xmlName: 'Dallas Mainline Toll Plaza',
                            csvName: 'Dallas Mainline Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Seminole Expressway (SR 417)',
                    routeID: 'SEM',
                    description: "State Road 417 is a 55-mile, tolled, limited-access transportation corridor serving Osceola, Orange and Seminole Counties, and is a joint project of the Central Florida Expressway Authority (CFX) and Florida’s Turnpike Enterprise.  Florida’s Turnpike operates the northern 17 miles of SR 417 as the Seminole Expressway, beginning at the Seminole County line and extending north to its terminus at Interstate 4 in Sanford.  The Turnpike also operates the southern end of SR 417, known as the Southern Connector, which spans from Milepost 1 at Interstate 4 to Milepost 6 in Orange County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Lake Jesup Toll Plaza',
                            csvName: 'Lake Jesup Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Western Beltway (SR 429)',
                    routeID: 'WB',
                    description: "The Western Beltway is a limited-access toll road providing an alternate north-south route between Florida’s Turnpike and Interstate 4.  Florida’s Turnpike operates the southern extents, spanning from Interstate 4 (MP 0) to Seidel Road (MP 11), while the remainder of SR 429 is maintained by the Central Florida Expressway Authority (CFX).",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'South Plaza',
                            csvName: 'Western Beltway Toll Plaza'
                        },
                        {
                            xmlName: 'Center Plaza',
                            csvName: null
                        },
                        {
                            xmlName: 'Forest Lake Main Plaza',
                            csvName: null
                        }
                    ]
                },
                {
                    routeName: 'Southern Connector (SR 417)',
                    routeID: 'SCONN',
                    description: "State Road 417 is a 55-mile, tolled, limited-access transportation corridor serving Osceola, Orange and Seminole Counties, and is a joint project of the Central Florida Expressway Authority (CFX) and Florida’s Turnpike Enterprise.  Florida’s Turnpike operates the northern 17 miles of SR 417 as the Seminole Expressway, beginning at the Seminole County line and extending north to its terminus at Interstate 4 in Sanford.  The Turnpike also operates the southern end of SR 417, known as the Southern Connector, which spans from Milepost 1 at Interstate 4 to Milepost 6 in Orange County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Celebration Toll Plaza',
                            csvName: 'Celebration Toll Plaza'
                        }
                    ]
                }
            ]
        },
        {
            region: "Central East Coast",
            sections: [
                {
                    routeName: "Florida's Turnpike (SR 91)",
                    routeID: 'M',
                    description: "Florida's Turnpike, also designated as State Road 91, is a user-financed, limited-access toll road that runs 265 miles, through 11 counties, beginning near Miami in Miami-Dade County and terminating near Wildwood in Sumter County.",
                    descending: true,
                    lowExit: 88,
                    highExit: 236,
                    tollPlazas: [
                        {
                            xmlName: "Three Lakes Toll Plaza",
                            csvName: "Three Lakes Toll Plaza"
                        },
                        {
                            xmlName: "Lantana Plaza",
                            csvName: "Lantana Toll Plaza"
                        }
                    ]
                }
            ]
        },
        {
            region: "South Florida",
            sections: [
                {
                    routeName: "Florida's Turnpike (SR 91)",
                    routeID: 'M',
                    description: "Florida's Turnpike, also designated as State Road 91, is a user-financed, limited-access toll road that runs 265 miles, through 11 counties, beginning near Miami in Miami-Dade County and terminating near Wildwood in Sumter County.",
                    descending: true,
                    lowExit: 47,
                    highExit: 86,
                    tollPlazas: [
                        {
                            xmlName: 'Cypress Creek Toll Plaza',
                            csvName: 'Cypress Creek Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: "Florida's Turnpike Spur",
                    routeID: 'MSPUR', //was M
                    description: "",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Golden Glades Toll Plaza',
                            csvName: 'Golden Glades Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Turnpike Extension (SR 821)',
                    routeID: 'H',
                    description: "The Extension of Florida’s Turnpike begins at the Miami-Dade/Broward County line (at milepost 47), travels west past Interstate 75 and continues south to the US 1 interchange (Exit 1) in Florida City, north of the Florida Keys.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Homestead Toll Plaza',
                            csvName: 'Homestead Toll Gantry'
                        },
                        {
                            xmlName: 'Bird Road North Toll Plaza', //what?
                            csvName: null
                        },
                        {
                            xmlName: 'Bird Road South Toll Plaza',
                            csvName: 'Bird Road Toll Gantry'
                        },
                        {
                            xmlName: 'Okeechobee Toll Plaza',
                            csvName: 'Okeechobee Toll Gantry'
                        },
                        {
                            xmlName: 'Homestead Extension (Miramar)',
                            csvName: 'Miramar Toll Gantry'
                        }
                    ] //when routeID was M and low/high exits designated, this did not work
                },
                {
                    routeName: 'Sawgrass Expressway (SR 869)',
                    routeID: 'SG',
                    description: "The Sawgrass Expressway is a 23-mile facility in Broward County, extending from its junction with Interstate 75 in Weston to its interchange with Florida's Turnpike and Southwest 10th Street in Deerfield Beach.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Sunrise Toll Plaza',
                            csvName: 'Sunrise Toll Plaza'
                        },
                        {
                            xmlName: 'Deerfield Toll Plaza',
                            csvName: 'Deerfield Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Alligator Alley (I-75)', //added by hogan, missing from map
                    routeID: 'ALLIGATOR',
                    description: "Alligator Alley is a controlled access, 78-mile toll facility connecting the southwestern coastal areas of Collier and Lee Counties (Naples and Fort Myers) to the southeastern coastal areas of Broward and Miami-Dade Counties (Fort Lauderdale and Miami).",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Alligator Alley West Plaza',
                            csvName: 'Alligator Alley West Plaza'
                        },
                        {
                            xmlName: 'Alligator Alley East Plaza',
                            csvName: 'Alligator Alley East Plaza'
                        }
                    ] //added by hogan, missing from map
                }
                // ,{
                //     routeName: 'The Missing Mainline!',  //hogan
                //     routeID: 'M', //BUG - put exits for missing mainline so it doesn't double count
                //     tollPlazas:[{
                //         xmlName: null,
                //         csvName: null
                //     },{
                //         xmlName: null,
                //         csvName: null
                //     }]
                // }
            ]
        },
        {
            region: "Tampa Bay",
            sections: [
                {
                    routeName: 'Veterans Expressway (SR 589)',
                    routeID: 'V',
                    description: "Veterans Expressway and Suncoast Parkway, both part of Florida’s Turnpike System, combine to form a 57-mile, tolled, limited-access transportation corridor serving West Central Florida, beginning near Tampa in Hillsborough County and ending near Brooksville in Hernando County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Sugarwood Toll Plaza',
                            csvName: 'Sugarwood Toll Plaza'
                        },
                        {
                            xmlName: 'Anderson Toll Plaza',
                            csvName: 'Anderson Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Suncoast Parkway (SR 589)',
                    routeID: 'SC',
                    description: "Veterans Expressway and Suncoast Parkway, both part of Florida’s Turnpike System, combine to form a 57-mile, tolled, limited-access transportation corridor serving West Central Florida, beginning near Tampa in Hillsborough County and ending near Brooksville in Hernando County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Anclote Toll Plaza',
                            csvName: 'Anclote Toll Plaza'
                        },
                        {
                            xmlName: 'Spring Hill Toll Plaza',
                            csvName: 'Spring Hill Toll Plaza'
                        },
                        {
                            xmlName: 'Oak Hammock Toll Plaza',
                            csvName: 'Oak Hammock Toll Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Sunshine Skyway Bridge (I-275)',
                    routeID: 'SKYWAY',
                    description: "The Sunshine Skyway Bridge is a 17.4-mile bridge crossing Tampa Bay from US 19 at Maximo Point in Pinellas County to US 41, north of Palmetto in Manatee County with one mainline toll plaza located at each end of the facility.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Sunshine Skyway South Plaza',
                            csvName: 'Sunshine Skyway South Plaza'
                        },
                        {
                            xmlName: 'Sunshine Skyway North Plaza',
                            csvName: 'Sunshine Skyway North Plaza'
                        }
                    ]
                },
                {
                    routeName: 'Pinellas Bay System (SR 682)',
                    routeID: 'BAYWAY',
                    description: "The Pinellas Bayway System consists of a series of causeways and bridges providing a connection between St. Petersburg Beach, Fort DeSoto Park and I-275. The system is approximately 15.2 miles in length and includes 1.3 miles of bridges.",
                    descending: false,
                    tollPlazas: [
                        {
                            xmlName: 'Pinellas Bayway West Plaza',
                            csvName: 'Pinellas Bayway West Plaza'
                        },
                        {
                            xmlName: 'Pinellas Bayway East Plaza',
                            csvName: 'Pinellas Bayway East Plaza'
                        },
                        {
                            xmlName: 'Pinellas Bayway South Plaza',
                            csvName: 'Pinellas Bayway South Plaza'
                        }
                    ]
                },
                {
                    routeName: 'I-4 Connector',  //added by hogan, missing from map
                    routeID: 'S',
                    description: "The I-4 Connector is a series of ramps that connect Interstate 4 with the Selmon Expressway west of 31st Street in Tampa.",
                    descending: false,
                    tollPlazas: [
                        {
                            xmlName: 'I-4 Connector Plaza',
                            csvName: 'I-4 Connector Toll Plaza'
                        }
                    ]
                }
            ]
        },
        {
            region: "Lakeland",
            sections: [
                {
                    routeName: 'Polk Parkway (SR 570)',
                    routeID: 'P',
                    description: "The Parkway is a 25-mile limited-access toll road connecting major Polk County cities to each other and to Interstate 4.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: 'Western Toll Plaza',
                            csvName: 'Western Toll Plaza'
                        },
                        {
                            xmlName: 'Central Toll Plaza',
                            csvName: 'Central Toll Plaza'
                        },
                        {
                            xmlName: 'Eastern Toll Plaza',
                            csvName: 'Eastern Toll Plaza'
                        }
                    ]
                }
            ]
            // },{
            //     region: "Jacksonville",
            //     sections: [
            //         {
            //             routeName: 'First Coast Expressway (SR 23)',
            //             routeID: '?',
            //             tollPlazas:[{
            //                 xmlName: null,
            //                 csvName: null
            //             },{
            //                 xmlName: null,
            //                 csvName: null
            //             }]
            //         }
            // ]
        },
        {
            region: "Florida Panhandle",
            sections: [
                {
                    routeName: 'Mid-Bay Connector (SR 293)',
                    routeID: 'MID_BAY',
                    description: "The Mid-Bay Bridge is a 3.6-mile toll bridge that extends over Choctawhatchee Bay from SR 20, east of Niceville, to US 98 near the coastal resort community of Destin in southeast Okaloosa County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: null,
                            csvName: 'Mid-Bay Bridge Connector'
                        }
                    ]
                },
                {
                    routeName: 'MidBay Bridge (SR 293)',
                    routeID: 'MID_BAY',
                    description: "The Mid-Bay Bridge is a 3.6-mile toll bridge that extends over Choctawhatchee Bay from SR 20, east of Niceville, to US 98 near the coastal resort community of Destin in southeast Okaloosa County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: null,
                            csvName: 'Mid-Bay Bridge'
                        }
                    ]
                },
                {
                    routeName: 'Garcon Point Bridge (SR 281)',
                    routeID: 'GARCON',
                    description: "The Garcon Point Bridge is a 3.5-mile bridge that spans Pensacola/East Bay between Garcon Point (south of Milton) and Redfish Point (between Gulf Breeze and Navarre) in southwest Santa Rosa County.",
                    descending: true,
                    tollPlazas: [
                        {
                            xmlName: null,
                            csvName: 'Garcon Point Bridge'
                        }
                    ]
                }
            ]
        }
    ];

    //This is the over-all format of the response.  'Master-Object' that we push values in to later
    var jsonBuilder = {
        schemaData: {
            regions: new Array(),
            routeSections: new Array(),
            metaData: {}
        }
    }

    var routeSection = new Array();
    var regions = new Array();


    //This generic getDate function is used to populate the metadata section
    function getDate() {
        var a = new Date();
        var myDate = String(a.getMonth() + 1) + '/' + String(a.getDate()) + '/' + String(a.getFullYear())
        return myDate;
    }

    function axleIncrease(facilityID, numberAxles, twoAxleVal) {
        if (twoAxleVal === '999' || twoAxleVal === '555') {
            return '999'
        }
        else {
            if ((facilityID == 'SG') || (facilityID == 'S') || (facilityID == 'GARCON') || (facilityID == 'MID_BAY')) {
                //These facilities have fixed rates
                //SG needs to be for exits NOT toll plazas
                // TYPE S AND exit
                return Number(twoAxleVal)
            }
            else {
                //This formula taken from Kevin B's email on 7/3/2014
                return Number((Number(twoAxleVal) * (Number(numberAxles) - 1)).toFixed(2))
            }
        }
    }

    /*
     ASYNC steps:
     1.  Crunch the entire XML document into sets of arrays that we can use in other parts of the ASYNC script.  Outputs include objects for:
     a.  facilityObject
     b.  tollplazaObject
     c.  exitsObject
     2.  Read the Turnpike Section CSV.  Loop through and add every route section and ID to the routeSection portion of Master-Object
     3.  Loop through the regions we were provided, and build the base part of regions in the Master-Object
     4.  Read the CSV file with the points.  From this we only really care about the HTML field (only place where toll-by-plate is designated, geography, and FacilityID/ExitNum & ExitNumber)  Arrays we end up creating include: routeSection
     Right now we are just building the exits portion of the regions section, but we are not doing the tollPlazas section
     5.  Last part hard codes the metaData and tollPlaza sections of the regions array in the Master-Object
     */


    async.series([
        function (callback) {
            fs.readFile(__dirname + "/../data/fromClient/" + xmlDoc + '.xml', 'utf8', function (err, data) {
                if (!err) {
                    var doc = new DOMParser().parseFromString(data, 'text/xml');
                    xmlDoc = doc.documentElement;

                    //FACILITY tag
                    for (i = 0; i < xmlDoc.getElementsByTagName("FACILITY").length; i++) {
                        facilityObject.push({
                            "facility": xmlDoc.getElementsByTagName("FACILITY")[i].childNodes[0].nodeValue,
                            "id": xmlDoc.getElementsByTagName("FACILITY")[i].getAttribute('ID')
                        });
                    }

                    //TOLLPLAZAS tag
                    for (i = 0; i < xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA").length; i++) {
                        tollplazaObject.push({
                            "display_name": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].childNodes[0].nodeValue,
                            "TP_NAME": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('TP_NAME'),
                            "FACID": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('FACID'),
                            "MILE_POINT": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('MILE_POINT'),
                            "TP_NAME": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('TP_NAME'),
                            "CASH_TOLL": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('CASH_TOLL'),
                            "SUNPASS_TOLL": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('SUNPASS_TOLL'),
                            "CASH_TOLL_RI": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('CASH_TOLL_RI'),
                            "SUNPASS_TOLL_RI": xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[i].getAttribute('SUNPASS_TOLL_RI')
                        });

                    }

                    //EXIT tag
                    for (i = 0; i < xmlDoc.getElementsByTagName("EXIT").length; i++) {
                        exitsObject.push({
                            "display_name": xmlDoc.getElementsByTagName("EXIT")[i].childNodes[0].nodeValue,
                            "ID": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('ID'),
                            "FACILITY_ID": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('FACILITY_ID'),
                            "MILE_POINT": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('MILE_POINT'),
                            "NB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('NB_ON'),
                            "NB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('NB_OFF'),
                            "SB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('SB_ON'),
                            "SB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('SB_OFF'),
                            "EB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('EB_ON'),
                            "EB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('EB_OFF'),
                            "WB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('WB_ON'),
                            "WB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('WB_OFF'),
                            "CASH_NB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_NB_ON'),
                            "CASH_NB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_NB_OFF'),
                            "CASH_SB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_SB_ON'),
                            "CASH_SB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_SB_OFF'),
                            "CASH_EB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_EB_ON'),
                            "CASH_EB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_EB_OFF'),
                            "CASH_WB_ON": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_WB_ON'),
                            "CASH_WB_OFF": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_WB_OFF'),
                            "NB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('NB_ON_RI'),
                            "NB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('NB_OFF_RI'),
                            "SB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('SB_ON_RI'),
                            "SB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('SB_OFF_RI'),
                            "EB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('EB_ON_RI'),
                            "EB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('EB_OFF_RI'),
                            "WB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('WB_ON_RI'),
                            "WB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('WB_OFF_RI'),
                            "CASH_NB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_NB_ON_RI'),
                            "CASH_NB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_NB_OFF_RI'),
                            "CASH_SB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_SB_ON_RI'),
                            "CASH_SB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_SB_OFF_RI'),
                            "CASH_EB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_EB_ON_RI'),
                            "CASH_EB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_EB_OFF_RI'),
                            "CASH_WB_ON_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_WB_ON_RI'),
                            "CASH_WB_OFF_RI": xmlDoc.getElementsByTagName("EXIT")[i].getAttribute('CASH_WB_OFF_RI')
                        });
                    }

                    //bridge tag
                    for (i = 0; i < xmlDoc.getElementsByTagName("BRIDGE").length; i++) {
                        bridgeObject.push({
                            "display_name": xmlDoc.getElementsByTagName("BRIDGE")[i].childNodes[0].nodeValue,
                            "FACILITY_ID": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('FACILITY_ID'),
                            "NB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('NB'),
                            "SB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('SB'),
                            "EB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('EB'),
                            "WB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('WB'),
                            "ADD_AXLE": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('ADD_AXLE'),
                            "CASH_NB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('CASH_NB'),
                            "CASH_SB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('CASH_SB'),
                            "CASH_EB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('CASH_EB'),
                            "CASH_WB": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('CASH_WB'),
                            "CASH_ADD_AXLE": xmlDoc.getElementsByTagName("BRIDGE")[i].getAttribute('CASH_ADD_AXLE')

                        });
                    }

                    //ticketsystem tag
                    for (i = 0; i < xmlDoc.getElementsByTagName("TS_EXIT").length; i++) {
                        tsObject.push({
                            "display_name": xmlDoc.getElementsByTagName("TS_EXIT")[i].childNodes[0].nodeValue,
                            "ID": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('ID'),
                            "CASH_E_88": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_88'),
                            "CASH_E_93": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_93'),
                            "CASH_E_97": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_97'),
                            "CASH_E_98": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_98'),
                            "CASH_E_99": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_99'),
                            "CASH_E_107": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_107'),
                            "CASH_E_109": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_109'),
                            "CASH_E_116": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_116'),
                            "CASH_E_133": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_133'),
                            "CASH_E_138": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_138'),
                            "CASH_E_142": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_142'),
                            "CASH_E_152": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_152'),
                            "CASH_E_193": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_193'),
                            "CASH_E_236": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_236'),
                            "E_88": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_88'),
                            "E_93": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_93'),
                            "E_97": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_97'),
                            "E_98": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_98'),
                            "E_99": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_99'),
                            "E_107": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_107'),
                            "E_109": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_109'),
                            "E_116": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_116'),
                            "E_133": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_133'),
                            "E_138": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_138'),
                            "E_142": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_142'),
                            "E_152": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_152'),
                            "E_193": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_193'),
                            "E_236": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_236'),
                            "CASH_E_88_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_88_RI'),
                            "CASH_E_93_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_93_RI'),
                            "CASH_E_97_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_97_RI'),
                            "CASH_E_98_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_98_RI'),
                            "CASH_E_99_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_99_RI'),
                            "CASH_E_107_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_107_RI'),
                            "CASH_E_109_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_109_RI'),
                            "CASH_E_116_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_116_RI'),
                            "CASH_E_133_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_133_RI'),
                            "CASH_E_138_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_138_RI'),
                            "CASH_E_142_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_142_RI'),
                            "CASH_E_152_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_152_RI'),
                            "CASH_E_193_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_193_RI'),
                            "CASH_E_236_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('CASH_E_236_RI'),
                            "E_88_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_88_RI'),
                            "E_93_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_93_RI'),
                            "E_97_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_97_RI'),
                            "E_98_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_98_RI'),
                            "E_99_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_99_RI'),
                            "E_107_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_107_RI'),
                            "E_109_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_109_RI'),
                            "E_116_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_116_RI'),
                            "E_133_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_133_RI'),
                            "E_138_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_138_RI'),
                            "E_142_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_142_RI'),
                            "E_152_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_152_RI'),
                            "E_193_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_193_RI'),
                            "E_236_RI": xmlDoc.getElementsByTagName("TS_EXIT")[i].getAttribute('E_236_RI')
                        });
                    }
                   // console.log(tsObject)
                }
            })
            callback()
        },
        function (callback) {

            //Build the Route Sections
            fs.readFile(__dirname + '/../data/fromClient/' + TP_Sections + '.csv', 'utf8', function (err, data) {
                if (err) throw err

                //routes section
                csv.parse(data, function (err, d) {
                    for (i = 0; i < d.length; i++) {
                        if (i > 0) {
//                            console.log('section id ' + d[i][0]);
//                            var coord = d[i][8]
//                                .replace(RegExp('<LineString><coordinates>', 'g'), '[[')
//                                .replace(RegExp('</coordinates></LineString>', 'g'), ']]')
//                                .replace(RegExp(' ', 'g'), '],[');
//                            console.log(coord);
                            routeSection.push({
                                "sectionID": d[i][0],
                                "name": d[i][2],
                                "facilityID": d[i][3],
                                "highNum": d[i][4],
                                "lowNum": d[i][5],
                                "coordinates": JSON.parse(d[i][8]
                                        .replace(RegExp('<LineString><coordinates>', 'g'), '[[')
                                        .replace(RegExp('</coordinates></LineString>', 'g'), ']]')
                                        .replace(RegExp(' ', 'g'), '],[')
                                )
                            })
                        }

                    }
                    jsonBuilder.schemaData.routeSections.push(routeSection);

                    callback()
                })

            })

        },
        function (callback) {
            //Build the Facilities/routeSectionID's
            var facilities = new Array();
            for (var i in RegionsBreakdowns) {

                var regionName = RegionsBreakdowns[i].region
                var facilities = new Array();

                for (c in RegionsBreakdowns[i].sections) {
                    var routeSections = new Array();
                    for (a in routeSection) {
                        if ((RegionsBreakdowns[i].sections[c].routeID == routeSection[a].facilityID) && (!RegionsBreakdowns[i].sections[c].lowExit) && (!RegionsBreakdowns[i].sections[c].highExit)) {
                            routeSections.push(Number(routeSection[a].sectionID))
                        }
                        if ((RegionsBreakdowns[i].sections[c].routeID == routeSection[a].facilityID) && (RegionsBreakdowns[i].sections[c].lowExit != null) && (RegionsBreakdowns[i].sections[c].highExit != null)) {
                            if ((routeSection[a].highNum <= RegionsBreakdowns[i].sections[c].highExit) && (routeSection[a].lowNum >= RegionsBreakdowns[i].sections[c].lowExit)) {
                                routeSections.push(Number(routeSection[a].sectionID))
                            }

                        }

                    }
                    facilities.push({
                        name: RegionsBreakdowns[i].sections[c].routeName,
                        facilityID: RegionsBreakdowns[i].sections[c].routeID,
                        description: RegionsBreakdowns[i].sections[c].description,
                        descending: RegionsBreakdowns[i].sections[c].descending,
                        lowExit: RegionsBreakdowns[i].sections[c].lowExit,
                        highExit: RegionsBreakdowns[i].sections[c].highExit,
                        Milepost: RegionsBreakdowns[i].sections[c].Milepost,
                        routeSectionIDs: routeSections,
                        tollPlazas: new Array(),
                        exits: new Array()
                    })
                }
                jsonBuilder.schemaData.regions.push({
                    name: regionName,
                    facilities: facilities
                })
            }
            callback()
        },
        function (callback) {

            //Build the Facilities/Exits's
            fs.readFile(__dirname + '/../data/fromClient/' + exitPoints + '.csv', 'utf8', function (err, data) {
                if (err) throw err

                //routes section
                csv.parse(data, function (err, d) {

                    //d[8] mile post,
                    for (x in d) {
                        if (d[x][2].indexOf('Three Lakes') != -1 || d[x][2].indexOf('Lantana Toll Plaza') != -1){
                            //console.log(d[x])
                           // console.log(d[x][2] + '|' + d[x][3] + '|' + d[x][4] + '|' + d[x][5]+ '|' + d[x][6]+ '|' + d[x][7] + '|' + d[x][8]+ '|' + d[x][5])
                        }
                        //console.log(d[l][2])
                    }
                    for (f in jsonBuilder.schemaData.regions) {
                        for (b in jsonBuilder.schemaData.regions[f].facilities) { // for each item in facilities
                            //headers: description,geometry,Name,FacilityName,FacilityID,FacilityType,Sunpass_Only,ExitNum,Milepost,ExitNumber,Comment,Marker,NB_ON,NB_OFF,SB_ON,SB_OFF
                            for (l in d) { //for each row (l) in CSV (d)

                                function tollByPlate() {
                                    if (String(d[l][0]).indexOf("TOLL-BY-PLATE") != "-1") {
                                        return true
                                    }
                                    else {
                                        return false
                                    }
                                }

                                function ticketSystem(inID) {
                                    var cat = false;
                                    for (var i = 0; i < tsObject.length; i++) {
                                        if (inID === tsObject[i].ID) {
                                            cat = true
                                        }
                                    }
                                    if (cat === true) {
                                        return true
                                    }
                                    else {
                                        return false
                                    }

                                }

                                function sunpassOnly(inVal) {
                                    if (inVal == 'Yes') {
                                        return true
                                    }
                                    else {
                                        return false
                                    }

                                }


                                function validStart() {
                                    if ((exitsObject[i].NB_ON != '999') || (exitsObject[i].SB_ON != '999') || (exitsObject[i].EB_ON != '999') || (exitsObject[i].WB_ON != '999')) {
                                        return true
                                    }
                                    else {
                                        return false
                                    }
                                }

                                //if there is an exit identified in the CSV
                                if (d[l][7]) { //if the facility id for the region we are currently on matches the facility id of the exit data AND exit low number AND high number are nulls AND facilityID != M (mainline)
                                    if ((jsonBuilder.schemaData.regions[f].facilities[b].facilityID == d[l][4]) && (jsonBuilder.schemaData.regions[f].facilities[b].lowExit == null) && (jsonBuilder.schemaData.regions[f].facilities[b].highExit == null) && (d[l][4] != 'M')) {
                                        //for each of the objects in the exits object (from the xml)


                                        for (var i in exitsObject) {


                                            if ((exitsObject[i].FACILITY_ID + exitsObject[i].ID) == (d[l][4] + d[l][7])) {
                                                jsonBuilder.schemaData.regions[f].facilities[b].exits.push({
                                                    name: d[l][2],
                                                    altName: exitsObject[i].display_name,
                                                    exitNum: d[l][7],
                                                    exitNumber: d[l][9],
                                                    milePost: Number(d[l][8]),
                                                    validStart: validStart(),
                                                    twoAxle: {
                                                        NB_ON: {     sunpass: Number(exitsObject[i].NB_ON_RI), cash: Number(exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: Number(exitsObject[i].NB_OFF_RI), cash: Number(exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: Number(exitsObject[i].SB_ON_RI), cash: Number(exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: Number(exitsObject[i].SB_OFF_RI), cash: Number(exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: Number(exitsObject[i].EB_ON_RI), cash: Number(exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: Number(exitsObject[i].EB_OFF_RI), cash: Number(exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: Number(exitsObject[i].WB_ON_RI), cash: Number(exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: Number(exitsObject[i].WB_OFF_RI), cash: Number(exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    threeAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    fourAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    fiveAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    sixAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    sevenAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    eightAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    // additionalAxle: {
                                                    //     NB_ON:{     sunpass: Number(exitsObject[i].NB_ON_RI), cash: Number(exitsObject[i].CmultipASH_NB_ON_RI)},
                                                    //     NB_OFF:{    sunpass: Number(exitsObject[i].NB_OFF_RI), cash: Number(exitsObject[i].CASH_NB_OFF_RI)},
                                                    //     SB_ON:{     sunpass: Number(exitsObject[i].SB_ON_RI), cash: Number(exitsObject[i].CASH_SB_ON_RI)},
                                                    //     SB_OFF:{    sunpass: Number(exitsObject[i].SB_OFF_RI), cash: Number(exitsObject[i].CASH_SB_OFF_RI)},
                                                    //     EB_ON:{     sunpass: Number(exitsObject[i].EB_ON_RI), cash: Number(exitsObject[i].CASH_EB_ON_RI)},
                                                    //     EB_OFF:{    sunpass: Number(exitsObject[i].EB_OFF_RI), cash: Number(exitsObject[i].CASH_EB_OFF_RI)},
                                                    //     WB_ON:{     sunpass: Number(exitsObject[i].WB_ON_RI), cash: Number(exitsObject[i].CASH_WB_ON_RI)},
                                                    //     WB_OFF:{    sunpass: Number(exitsObject[i].WB_OFF_RI), cash: Number(exitsObject[i].CASH_WB_OFF_RI)},
                                                    // },
                                                    coordinates: {
                                                        lat: Number(String(d[l][1])
                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                            .split(',')[1]),
                                                        lon: Number(String(d[l][1])
                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                            .split(',')[0])
                                                    },
                                                    sunpassOnly: sunpassOnly(d[l][6]),
                                                    ticketSystem: ticketSystem(exitsObject[i].ID),
                                                    tollByPlate: tollByPlate()
                                                })
                                            }
                                            else {
                                                //
                                            }

                                        }
                                    }

                                }

                                //if both the csv record and the facility we are currently looking at have matching ID's AND the facility ID is for Mainline
                                if ((jsonBuilder.schemaData.regions[f].facilities[b].facilityID == d[l][4]) && (d[l][4] == 'M')) {
                                    //handle mainline where json facility = csv facility
                                    var temp = d[l][7];
                                    if (d[l][7].indexOf('A') > 0) {
                                        temp = d[l][7].replace('A', '');
                                    }
                                    if (d[l][7].indexOf('B') > 0) {
                                        temp = d[l][7].replace('B', '');
                                    }
                                    if ((Number(temp) <= Number(jsonBuilder.schemaData.regions[f].facilities[b].highExit)) && (Number(temp) >= Number(jsonBuilder.schemaData.regions[f].facilities[b].lowExit))) {

                                        //set all of these variables in this exitsLookup function where we pass in the facilityID and the exitNum
                                        for (var i in exitsObject) {
                                            if ((exitsObject[i].FACILITY_ID + exitsObject[i].ID) == (d[l][4] + d[l][7])) {

                                                //var exits = new Array();
                                                jsonBuilder.schemaData.regions[f].facilities[b].exits.push({
                                                    name: d[l][2],
                                                    altName: exitsObject[i].display_name,
                                                    exitNum: d[l][7],
                                                    exitNumber: d[l][9],
                                                    milePost: Number(d[l][8]),
                                                    validStart: validStart(),
                                                    twoAxle: {
                                                        NB_ON: {     sunpass: Number(exitsObject[i].NB_ON_RI), cash: Number(exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: Number(exitsObject[i].NB_OFF_RI), cash: Number(exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: Number(exitsObject[i].SB_ON_RI), cash: Number(exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: Number(exitsObject[i].SB_OFF_RI), cash: Number(exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: Number(exitsObject[i].EB_ON_RI), cash: Number(exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: Number(exitsObject[i].EB_OFF_RI), cash: Number(exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: Number(exitsObject[i].WB_ON_RI), cash: Number(exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: Number(exitsObject[i].WB_OFF_RI), cash: Number(exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    threeAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 3, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    fourAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 4, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    fiveAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 5, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    sixAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 6, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    sevenAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 7, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    eightAxle: {
                                                        NB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].NB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_NB_ON_RI)},
                                                        NB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].NB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_NB_OFF_RI)},
                                                        SB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].SB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_SB_ON_RI)},
                                                        SB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].SB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_SB_OFF_RI)},
                                                        EB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].EB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_EB_ON_RI)},
                                                        EB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].EB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_EB_OFF_RI)},
                                                        WB_ON: {     sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].WB_ON_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_WB_ON_RI)},
                                                        WB_OFF: {    sunpass: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].WB_OFF_RI), cash: axleIncrease(exitsObject[i].FACILITY_ID, 8, exitsObject[i].CASH_WB_OFF_RI)},
                                                    },
                                                    // additionalAxle: {
                                                    //     NB_ON:{     sunpass: Number(exitsObject[i].NB_ON_RI), cash: Number(exitsObject[i].CmultipASH_NB_ON_RI)},
                                                    //     NB_OFF:{    sunpass: Number(exitsObject[i].NB_OFF_RI), cash: Number(exitsObject[i].CASH_NB_OFF_RI)},
                                                    //     SB_ON:{     sunpass: Number(exitsObject[i].SB_ON_RI), cash: Number(exitsObject[i].CASH_SB_ON_RI)},
                                                    //     SB_OFF:{    sunpass: Number(exitsObject[i].SB_OFF_RI), cash: Number(exitsObject[i].CASH_SB_OFF_RI)},
                                                    //     EB_ON:{     sunpass: Number(exitsObject[i].EB_ON_RI), cash: Number(exitsObject[i].CASH_EB_ON_RI)},
                                                    //     EB_OFF:{    sunpass: Number(exitsObject[i].EB_OFF_RI), cash: Number(exitsObject[i].CASH_EB_OFF_RI)},
                                                    //     WB_ON:{     sunpass: Number(exitsObject[i].WB_ON_RI), cash: Number(exitsObject[i].CASH_WB_ON_RI)},
                                                    //     WB_OFF:{    sunpass: Number(exitsObject[i].WB_OFF_RI), cash: Number(exitsObject[i].CASH_WB_OFF_RI)},
                                                    // },
                                                    coordinates: {
                                                        lat: Number(String(d[l][1])
                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                            .split(',')[1]),
                                                        lon: Number(String(d[l][1])
                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                            .split(',')[0])
                                                    },
                                                    sunpassOnly: sunpassOnly(d[l][6]),
                                                    ticketSystem: ticketSystem(exitsObject[i].ID),
                                                    tollByPlate: tollByPlate()
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    callback()
                })
            })

        },
        function (callback) {


            fs.readFile(__dirname + '/../data/fromClient/' + exitPoints + '.csv', 'utf8', function (err, data) {
                if (err) throw err
                //Parse the read CSV object, go line by line
                csv.parse(data, function (err, d) {
                    // for(m in d){
                    //     //console.log(d[m][6]);
                    // }
                    for (var l in d) {

                        //For each region in the JSON Builder object
                        for (var f in jsonBuilder.schemaData.regions) {

                            //For each region in our config object up above
                            for (var a in RegionsBreakdowns) {

                                ////IF the region name from the config object and the region name
                                //if(jsonBuilder.schemaData.regions[f].name ==
                                for (var j in RegionsBreakdowns[a].sections) {

                                    //For each facility in each region (eg only operate on facilities that we have in our )
                                    for (var q in jsonBuilder.schemaData.regions[f].facilities) {
                                        if (jsonBuilder.schemaData.regions[f].facilities[q].name == RegionsBreakdowns[a].sections[j].routeName) {

                                            if (RegionsBreakdowns[a].sections[j].tollPlazas) {
                                                var tollPlazas = new Array;
                                                for (k in RegionsBreakdowns[a].sections[j].tollPlazas) {

                                                    //Read in the CSV file
                                                    if (RegionsBreakdowns[a].sections[j].tollPlazas[k].csvName != null) {

                                                        if (RegionsBreakdowns[a].sections[j].tollPlazas[k].csvName == d[l][2]) {
                                                            //special bridge section
                                                            if ((d[l][2] == 'Garcon Point Bridge') || (d[l][2] == 'Mid-Bay Bridge') || (d[l][2] == 'Mid-Bay Bridge Connector')) {
                                                                //There is no bridge data in the XML document anymore, so the values are hard coded
                                                                if (d[l][2] == 'Garcon Point Bridge') {
                                                                    twoAxleCash = 3.75,
                                                                        twoAxleSP = 3.75,
                                                                        threeAxleCash = 3.75 * 2,
                                                                        threeAxleSP = 3.75 * 2,
                                                                        fourAxleCash = 3.75 * 3,
                                                                        fourAxleSP = 3.75 * 3,
                                                                        fiveAxleCash = 3.75 * 4,
                                                                        fiveAxleSP = 3.75 * 4,
                                                                        sixAxleCash = 3.75 * 5,
                                                                        sixAxleSP = 3.75 * 5,
                                                                        sevenAxleCash = 3.75 * 6,
                                                                        sevenAxleSP = 3.75 * 6,
                                                                        eightAxleCash = 3.75 * 7,
                                                                        eightAxleSP = 3.75 * 7
                                                                    // additionalAxleCash = 3.75,
                                                                    // additionalAxleSP = 3.75
                                                                }
                                                                if (d[l][2] == 'Mid-Bay Bridge') {
                                                                    twoAxleCash = 3,
                                                                        twoAxleSP = 2,
                                                                        threeAxleCash = 3 * 2,
                                                                        threeAxleSP = 3 * 2,
                                                                        fourAxleCash = 3 * 3,
                                                                        fourAxleSP = 3 * 3,
                                                                        fiveAxleCash = 3 * 4,
                                                                        fiveAxleSP = 3 * 4,
                                                                        sixAxleCash = 3 * 5,
                                                                        sixAxleSP = 3 * 5,
                                                                        sevenAxleCash = 3 * 6,
                                                                        sevenAxleSP = 3 * 6,
                                                                        eightAxleCash = 3 * 7,
                                                                        eightAxleSP = 3 * 7
                                                                    // additionalAxleCash = 3,
                                                                    // additionalAxleSP = 3
                                                                }
                                                                if (d[l][2] == 'Mid-Bay Bridge Connector') {
                                                                    twoAxleCash = 1.5,
                                                                        twoAxleSP = 1,
                                                                        threeAxleCash = 1.5 * 2,
                                                                        threeAxleSP = 1.5 * 2,
                                                                        fourAxleCash = 1.5 * 3,
                                                                        fourAxleSP = 1.5 * 3,
                                                                        fiveAxleCash = 1.5 * 4,
                                                                        fiveAxleSP = 1.5 * 4,
                                                                        sixAxleCash = 1.5 * 5,
                                                                        sixAxleSP = 1.5 * 5,
                                                                        sevenAxleCash = 1.5 * 6,
                                                                        sevenAxleSP = 1.5 * 6,
                                                                        eightAxleCash = 1.5 * 7,
                                                                        eightAxleSP = 1.5 * 7
                                                                    // additionalAxleCash = 1.5,
                                                                    // additionalAxleSP = 1.5
                                                                }
                                                                jsonBuilder.schemaData.regions[f].facilities[q].tollPlazas.push({
                                                                    name: d[l][2],
                                                                    isBridge: true,
                                                                    ticketSystem: false,
                                                                    description: "blah, blah",
                                                                    twoAxle: {
                                                                        sunPass: twoAxleSP,
                                                                        cash: twoAxleCash
                                                                    },
                                                                    threeAxle: {
                                                                        sunPass: threeAxleSP,
                                                                        cash: threeAxleCash
                                                                    },
                                                                    fourAxle: {
                                                                        sunPass: fourAxleSP,
                                                                        cash: fourAxleCash
                                                                    },
                                                                    fiveAxle: {
                                                                        sunPass: fiveAxleSP,
                                                                        cash: fiveAxleCash
                                                                    },
                                                                    sixAxle: {
                                                                        sunPass: sixAxleSP,
                                                                        cash: sixAxleCash
                                                                    },
                                                                    sevenAxle: {
                                                                        sunPass: sevenAxleSP,
                                                                        cash: sevenAxleCash
                                                                    },
                                                                    eightAxle: {
                                                                        sunPass: eightAxleSP,
                                                                        cash: eightAxleCash
                                                                    },
                                                                    // additionalAxle: {
                                                                    //     sunPass: additionalAxleSP,
                                                                    //     cash: additionalAxleCash
                                                                    // },
                                                                    coordinates: {
                                                                        lat: Number(String(d[l][1])
                                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                                            .split(',')[1]),
                                                                        lon: Number(String(d[l][1])
                                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                                            .split(',')[0])
                                                                    }

                                                                })
                                                            }
                                                            else {
                                                                var plazaCASH_TOLL,
                                                                    plazaSUNPASS_TOLL,
                                                                    plazaCASH_TOLL_RI,
                                                                    plazaSUNPASS_TOLL_RI,
                                                                    plazaMILE_POINT,
                                                                    display_name;

                                                                for (var y in tollplazaObject) {
                                                                    if (RegionsBreakdowns[a].sections[j].tollPlazas[k].xmlName == tollplazaObject[y].TP_NAME) {
                                                                        plazaCASH_TOLL = Number(tollplazaObject[y].CASH_TOLL),
                                                                            plazaSUNPASS_TOLL = Number(tollplazaObject[y].SUNPASS_TOLL),
                                                                            plazaCASH_TOLL_RI = Number(tollplazaObject[y].CASH_TOLL_RI),
                                                                            plazaSUNPASS_TOLL_RI = Number(tollplazaObject[y].SUNPASS_TOLL_RI),
                                                                            plazaMILE_POINT = Number(tollplazaObject[y].MILE_POINT),
                                                                            display_name = tollplazaObject[y].display_name

                                                                    }
                                                                }

                                                                jsonBuilder.schemaData.regions[f].facilities[q].tollPlazas.push({
                                                                    name: d[l][2],
                                                                    altName: display_name,
                                                                    isBridge: false,
                                                                    ticketSystem: false,
                                                                    description: "blah, blah",
                                                                    twoAxle: {
                                                                        sunPass: plazaSUNPASS_TOLL_RI,
                                                                        cash: plazaCASH_TOLL_RI
                                                                    },
                                                                    threeAxle: {
                                                                        sunPass: axleIncrease('#', 3, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 3, plazaCASH_TOLL_RI)
                                                                    },
                                                                    fourAxle: {
                                                                        sunPass: axleIncrease('#', 4, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 4, plazaCASH_TOLL_RI)
                                                                    },
                                                                    fiveAxle: {
                                                                        sunPass: axleIncrease('#', 5, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 5, plazaCASH_TOLL_RI)
                                                                    },
                                                                    sixAxle: {
                                                                        sunPass: axleIncrease('#', 6, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 6, plazaCASH_TOLL_RI)
                                                                    },
                                                                    sevenAxle: {
                                                                        sunPass: axleIncrease('#', 7, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 7, plazaCASH_TOLL_RI)
                                                                    },
                                                                    eightAxle: {
                                                                        sunPass: axleIncrease('#', 8, plazaSUNPASS_TOLL_RI),
                                                                        cash: axleIncrease('#', 8, plazaCASH_TOLL_RI)
                                                                    },
                                                                    // additionalAxle: {
                                                                    //     sunPass: plazaSUNPASS_TOLL_RI,
                                                                    //     cash: plazaCASH_TOLL_RI
                                                                    // },
                                                                    coordinates: {
                                                                        lat: Number(String(d[l][1])
                                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                                            .split(',')[1]),
                                                                        lon: Number(String(d[l][1])
                                                                            .replace(RegExp('<Point><coordinates>', 'g'), '')
                                                                            .replace(RegExp('</coordinates></Point>', 'g'), '')
                                                                            .split(',')[0])
                                                                    },
                                                                    milePost: plazaMILE_POINT

                                                                })
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    callback()
                })
            })
        },
        function (callback) {
            jsonBuilder.schemaData.metaData = {
                "lastUpdate": getDate(),
                "paymentOptions": [
                    {"name": "SunPass", "description": "bla,bla"},
                    {"name": "Cash/Toll-By-Plate", "description": "bla,bla"}
                ],
                "carType": [
                    {"axleNum": 2, "description": "bla,bla,bla"},
                    {"axleNum": 3, "description": "bla,bla,bla"},
                    {"axleNum": 4, "description": "bla,bla,bla"},
                    {"axleNum": 5, "description": "bla,bla,bla"},
                    {"axleNum": 6, "description": "bla,bla,bla"},
                    {"axleNum": 7, "description": "bla,bla,bla"},
                    {"axleNum": 8, "description": "bla,bla,bla"}
                ],
                "floridaTurnpikeHistory": "An innovative experiment combining the best of both the government and business worlds, Florida's Turnpike Enterprise utilizes the best practices of the private sector while operating in the public interest. Operating as a separate business unit of the Florida Department of Transportation (FDOT), Florida's Turnpike has expanded and increased revenue, while continuing to protect bondholders and improve customer service across the board. The results have been improved efficiency, cost-effectiveness and timely project delivery." +
                    "Florida's Turnpike is now responsible for all operations on every FDOT-owned and operated toll road and bridge.  Florida's Turnpike strives to ensure every customer who travels these toll roads and bridges receives first class service on every trip.",
                "link": [
                    {"name": "Florida’s Turnpike Enterprise", "url": "http://www.floridasturnpike.com/"},
                    {"name": "Florida Department of Transportation", "url": "Florida Department of Transportation"},
                    {"name": "SunPass", "url": "http://www.sunpass.com"},
                    {"name": "Florida 511 Traffic Info", "url": "http://fl511.com/"},
                    {"name": "Florida Highway Patrol", "url": "http://www.flhsmv.gov/"}
                ]
            }


            //hardcoded to handle MSPUR section, where startPoint is 0X, endPoint is 2X
            jsonBuilder.schemaData.regions.forEach(function (r) {
                if (r.name == 'South Florida') {
                    r.facilities.forEach(function (f) {
                        if (f.name == "Florida's Turnpike Spur") {
                            f.lowExit = '0X';
                            f.highExit = '2X';
                            f.routeSectionIDs.push(36)
                            f.routeSectionIDs.push(37)
                            //console.log(f)
                        }
                    })
                }
            })

            //hard code to manipulate data, SUCK
            /**************************************
            //for Central East Coast, Florida Turnpike, ticket system TollPlazas calculation wrong
            //hardcoded here
             **************************************/
            var rIndex, fIndex;
            var myArray = [];
            jsonBuilder.schemaData.regions.forEach(function(region, regionIndex){
                //console.log(region.name)
                if (region.name == 'Central East Coast') {
                    rIndex = regionIndex;
                    region.facilities.forEach(function(facility, facilityIndex){
                    //console.log(facility.name)
                        if (facility.name == "Florida's Turnpike (SR 91)"){
                            fIndex = facilityIndex;
                            facility.tollPlazas.forEach(function(tollPlaza, tollIndex){
                                if (tollPlaza.name.indexOf('Three Lakes')>-1) {
                                    tollPlaza.milePost = 193;
                                    tollPlaza.altName = tollPlaza.name;
                                    tollPlaza.ticketSystem = true;
                                    myArray.push(tollPlaza);
                                }
                                if (tollPlaza.name.indexOf('Lantana')>-1) {
                                    tollPlaza.milePost = 45;
                                    tollPlaza.altName = tollPlaza.name;
                                    tollPlaza.ticketSystem = true;
                                    myArray.push(tollPlaza);
                                }
                            })
                            //setting sunPass and cash to 999 for plazas in ticket system
                            myArray.forEach(function(plaza){
                                for (key in plaza) {
                                    if (key.indexOf('Axle')>-1){
                                            plaza[key].sunPass = 999;
                                            plaza[key].cash = 999;

                                    }
                                }
                                //console.log(plaza)
                            })
                            facility.tollPlazas = myArray;
                            //console.log(facility.tollPlazas);
                        }
                    })
                }
            })

            jsonBuilder.schemaData.regions.forEach(function(region){
                //console.log(region.name)
                if (region.name == 'Central East Coast') {
                    region.facilities.forEach(function(facility){
                        //console.log(facility.name)
                        if (facility.name == "Florida's Turnpike (SR 91)"){
                           // console.log(facility.tollPlazas.length)
                            facility.tollPlazas.forEach(function(tollPlaza){
                               // console.log(tollPlaza)
                               // console.log(tollPlaza.name + ' ' + tollPlaza.milePost + ' ' + tollPlaza.altName)
                                //console.log(tollPlaza)
                            })
                            //console.log()
                        }
                    })
                }
            })
   /*****************************************************
   //for routeSections, beachline has duplicate id 151, delete the first one
   *******************************************************/
            var extra151index;
            var count = 0;
            jsonBuilder.schemaData.routeSections.forEach(function(routeSection){
                routeSection.forEach(function(r, index){
                    if (r.sectionID == '151') {
                        if (count == 0){
                            extra151index = index;
                        }

                        count ++;

                    }
                })
            })

            //delete the first 151
            if (count == 2) {
                //console.log(extra151index)
                jsonBuilder.schemaData.routeSections[0].splice(extra151index, 1);
            }
//            jsonBuilder.schemaData.routeSections.forEach(function(routeSection){
//                routeSection.forEach(function(r, index){
//                    if (r.sectionID == '151') {
//                        console.log(r)
//                    }
//                })
//            })

            /************************************************************
             * add 'calculable' flag to facilities, these facilities should have avalue 'false'
             * Pinellas Bay System in Tempa Bay
             * Facilities and Bridges in Florida Pnhandle
             * I-4 Connector
             */
            var targetFacilityName = ['Pinellas Bay System (SR 682)'];
            jsonBuilder.schemaData.regions.forEach(function(region){
                    region.facilities.forEach(function(facility){
                        if (targetFacilityName.indexOf(facility.name) > -1 ){
                            //console.log(facility.name)
                            facility.calculable = false;
                        } else {
                            facility.calculable = true;
                        }
                    })
            });
            //verify
            jsonBuilder.schemaData.regions.forEach(function(region) {
                region.facilities.forEach(function (facility) {
                    if (!facility.calculable) {
                        //console.log(facility.name);
                    }
                })
            })

            /****************************************************
             * modify bridges in Florida Panhandle. make them all as plazas under facility 'Facilities and Bridges'
             */
            var tollPlazas = [];
            var facilityDescription = '';
            var facility = {};
            jsonBuilder.schemaData.regions.forEach(function(region) {
              if (region.name == 'Florida Panhandle') {
                  region.facilities.forEach(function(facility, i) {
                      if (i != 1) {
                          facilityDescription += facility.description;
                          facilityDescription += '\n';
                      }
                      facility.tollPlazas.forEach(function(tollPlaza) {
                          tollPlazas.push(tollPlaza);
                      })
                  })
                  facility.name = "Facility and Bridge";
                  facility.facilityID = "bridge";
                  facility.decending = true;
                  facility.description = facilityDescription;
                  facility.routeSectionIDs = [];
                  facility.exits = [];
                  facility.calculable = false;
                  facility.tollPlazas = tollPlazas;
                  region.facilities = [];
                  region.facilities.push(facility);
                  //console.log(region);
              }
            })
            //console.log(tollPlazas);
            //console.log(facilityDescription);

            /****************************************************
             * add region name to Florida's Turnpike(SR 91)
             */
            jsonBuilder.schemaData.regions.forEach(function(region) {
                region.facilities.forEach(function (facility, i) {
                    if (facility.name.indexOf("Florida's Turnpike (SR 91)")> -1){
                        var newName = facility.name.replace('(SR 91)', '').trim() + " - " + region.name;
                        facility.name = newName;
                        //console.log(facility.name)
                    }
                })
            })


            /***********************************************************
             * now start to make sure every facility has the right exits and toll plazas
             */

            //orlando area
            //Florida's trunpike tollplazas
            jsonBuilder.schemaData.regions.forEach(function(region, regionIndex) {
                if (region.name == 'Orlando Area') {
                    region.facilities.forEach(function(facility,facilityIndex){
                            if (facility.name.indexOf("Florida's Turnpike") > -1){
                                var myTollPlaza1 = [];
                                facility.tollPlazas.forEach(function(tollPlaza, tollPlazaIndex){
                                    if (tollPlaza.name.indexOf('Leesburg')>-1){
                                       myTollPlaza1.push(tollPlaza);
                                    }
                                })
                                facility.tollPlazas = myTollPlaza1;
                            }
                    })
                }
                if (region.name == 'South Florida'){
                    region.facilities.forEach(function(facility,facilityIndex){
                        if (facility.name.indexOf("Florida's Turnpike") > -1){
                            var myTollPlaza2 = [];
                            facility.tollPlazas.forEach(function(tollPlaza, tollPlazaIndex){
                                if (tollPlaza.name.indexOf('Cypress')>-1){
                                    myTollPlaza2.push(tollPlaza);
                                }
                            })
                            facility.tollPlazas = myTollPlaza2;
                        }
                    })
                }
            })


            //I-4 connector
            jsonBuilder.schemaData.regions.forEach(function(region, regionIndex) {
                if (region.name == 'Tampa Bay') {
                    region.facilities.forEach(function (facility, facilityIndex) {
                        if (facility.name.indexOf("I-4") > -1) {
                            facility.exits.forEach(function(exit) {
                                console.log(exit.name)
                            })
                        }
                    })
                }
            })



            fs.writeFile(__dirname + '/../data/schema_data.json', JSON.stringify(jsonBuilder), function (err, done) {
                if (err) throw err;
                console.log("schema data finished")
            });
            callback()
        }
    ]);
}