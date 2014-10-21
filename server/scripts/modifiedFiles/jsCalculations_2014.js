// Variables to calculate toll
var totalToll = 0;
var totalToll_RI = 0;
var tempToll = 0;
var CASH_tempToll = 0;
var CASH_tempToll_RI = 0;
var tempMile = 0;
var tempFacID = "";
var tempPlazaName = "";

var startingFacilityName="";
var endingFacilityName="";

var theStartingFacility;

var indexArray = new Array();
var namesArray = new Array();
var idArray = new Array();
var sortedIDs = new Array();
var MPArray = new Array();
var exitIdArray = new Array();
var NB_OFF_Array = new Array();
var SB_OFF_Array = new Array();
var EB_OFF_Array = new Array();
var WB_OFF_Array = new Array();
var myTollAmounts = new Array();
var myInlineTollPlazas = new Array();
var myInlineTollPlazasCASH = new Array();
var z //somthing 

var sortCombosFlag=0;
var xmlDoc
var numFacilities
var numTollPlazas
var numExits
var numBridges
var exitFrom = "NOVALUE"
var exitTo = "NOVALUE"

var axleFactor=1;
var axleFactorTicket=2;
var mileage=0;

// Toll variables
var isTransponder=false;	// Define type of toll payment, when true means sunpass and when false means cash
var startToll = 0;
var startToll_RI = 0;
var endToll = 0;
var endToll_RI = 0;
var ticketToll = 0;         // ticket system toll with transponder
var ticketToll_RI = 0;
var inlineToll = 0;
var inlineToll_RI = 0;
var transToll = 0;			// transition toll paid when getting off of Bee line and getting on Mainline of viceversa
var transToll_RI = 0;
var CASH_transToll = 0;		// transition toll paid when getting off of Bee line and getting on Mainline of viceversa paid cash
var CASH_transToll_RI = 0;
var CASH_totalToll = 0;		// total toll paid cash
var CASH_totalToll_RI = 0;
var CASH_startToll = 0;		// toll paid cash at starting exit
var CASH_startToll_RI = 0;
var CASH_endToll = 0;			// toll paid cash at ending exit
var CASH_endToll_RI = 0;
var CASH_ticketToll = 0;      // ticket system toll paid cash
var CASH_ticketToll_RI = 0;
var CASH_inlineToll = 0;		// toll paid cash at in line toll plazas
var CASH_inlineToll_RI = 0;
var TEMP_CASH_ticketToll = 0;
var TEMP_CASH_ticketToll_RI = 0;



// Variables to hold attributes of starting exit
var startExitName;
var startExitMile;
var startExitFacilityId;
var startExitNorthOn;
var startExitNorthOff;
var startExitSouthOn;
var startExitSouthOff;
var startExitEastOn;
var startExitEastOff;
var startExitWestOn;
var startExitWestOff;
var CASH_startExitNorthOn;
var CASH_startExitNorthOff;
var CASH_startExitSouthOn;
var CASH_startExitSouthOff;
var CASH_startExitEastOn;
var CASH_startExitEastOff;
var CASH_startExitWestOn;
var CASH_startExitWestOff;

//Variables to hold attributes of ending exit
var endExitName;
var endExitMile;
var endExitFacilityId;
var endExitNorthOn;
var endExitNorthOff;
var endExitSouthOn;
var endExitSouthOff;
var endExitEastOn;
var endExitEastOff;
var endExitWestOn;
var endExitWestOff;
var CASH_endExitNorthOn;
var CASH_endExitNorthOff;
var CASH_endExitSouthOn;
var CASH_endExitSouthOff;
var CASH_endExitEastOn;
var CASH_endExitEastOff;
var CASH_endExitWestOn;
var CASH_endExitWestOff;

// Load xml document
var browser=navigator.appName;
var ua = navigator.userAgent.toLowerCase();
//var xmlFile = 'js/touchScreentolls.xml'
var xmlFile = 'js/touchScreentolls_2014.xml'
if (ua.indexOf('safari/') != -1) {
    try{
    XmlHTTP = new XMLHttpRequest();
    XmlHTTP.open('get', xmlFile, false);
    XmlHTTP.send('');
    xmlDoc = XmlHTTP.responseXML;
    }
    catch(e){
        //alert(e);
    }
}
else if (window.ActiveXObject) { // code for IE
    try{
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.load(xmlFile);
    }
    catch(e){
        //alert(e);
    }
}

else if(document.implementation && document.implementation.createDocument) {// code for FireFox
    try{
    xmlDoc = document.implementation.createDocument("","",null);
    xmlDoc.async=false;
    xmlDoc.load(xmlFile);
    }
    catch(e){
        //alert(e);
    }
//xmlDoc.onreadystatechange=verify;
}
else{
    //alert('Your browser is not compatible with this page, some functions may not display properly.');
}

//xmlObj=xmlDoc.documentElement
numFacilities = xmlDoc.getElementsByTagName("FACILITY")
numTollPlazas = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")
numExits = xmlDoc.getElementsByTagName("EXIT")
numBridges  = xmlDoc.getElementsByTagName("BRIDGE")
////alert("jsCalculations_2014.js Line #161 - # of Exits");

// Loads XML data into arrays
for (var i=0;i<numExits.length;i++) {
	theFacIDonList = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("FACILITY_ID");
	theExitIDonList = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("ID")
	indexArray[i] = theFacIDonList + theExitIDonList + ' - ' + xmlDoc.getElementsByTagName("EXIT")[i].childNodes[0].nodeValue;
	MPArray[i] = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("MILE_POINT")

	idArray[i] = theFacIDonList;
	sortedIDs[i] = theFacIDonList;
	exitIdArray[i] = theExitIDonList;

	NB_OFF_Array[i] = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("NB_OFF")
	SB_OFF_Array[i] = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("SB_OFF")
	EB_OFF_Array[i] = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("EB_OFF")
	WB_OFF_Array[i] = xmlDoc.getElementsByTagName("EXIT")[i].getAttribute("WB_OFF")

	if ((MPArray[i]=="208.302" )&&(theFacIDonList=="M")){
		BeeLineMainlineExit = i
	}
}

function resetTollCalculator() {
	isTransponder=false;
	totalToll=0;
	startToll=0;
	endToll=0;
	ticketToll = 0;
	inlineToll=0;
	transToll=0;
	CASH_transToll=0;
	CASH_totalToll=0;
	CASH_startToll=0;
	CASH_endToll=0;
	CASH_ticketToll = 0;
	CASH_inlineToll=0;	
	outputText = "";
	outputText2 = "";
	tempToll = 0;
	CASH_tempToll = 0;
	tempMile = 0;
	tempFacID = "";
	tempPlazaName = "";
	inlineToll=0;
	activeArea="";
	clickCounter=0;
	firstClickAt="";
	firstSelection="";
	secondSelection="";
}

function getStartingExitData(startName,startMile,startFacility) {	
	firstSelection =  myFacilityID	 + 	myExitNum + " - " +	myExitName 
	var startExitName_XML = '';
	// Reads the element in the collection corresponding to the
	// position of the pointer set by the value of the selected item in the combo box
	exitFrom = "NOVALUE";
	for (var i=0;i<numExits.length;i++) {
		startExitName_XML = indexArray[i]
		startExitName_XML = startExitName_XML.replace("'","\\'")
		if (firstSelection.toUpperCase() == startExitName_XML.toUpperCase()) {
	    	exitFrom = i;
			////alert("jsCalculations_2014.js Line #224 - Start Exit Found. index is" + indexArray[i]);
	    	}
	}
	if (exitFrom=="NOVALUE"){
		//alert("START Exit Names Do Not Match.  Compare Fusion Table to XML file");
		return false;
	}
	
	//startExitName=xmlObj.childNodes(0).childNodes(2).childNodes(exitFrom).text
	//startExitName=xmlDoc.getElementsByTagName("EXIT")[exitFrom].childNodes[0].nodeValue;
	//startExitMile=xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("MILE_POINT");
    //startExitFacilityId=xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("FACILITY_ID");
	//startExitName=startName;
	startExitName=startName.replace(/\\'/g,"'");
	startExitMile=startMile;
    startExitFacilityId=startFacility;
	
	//startExitMile=parseFloat(xmlObj.childNodes(0).childNodes(2).childNodes(exitFrom).getAttribute("MILE_POINT"))
	//startExitFacilityId=xmlObj.childNodes(0).childNodes(2).childNodes(exitFrom).getAttribute("FACILITY_ID")

	// Reads SunPass toll rates
	startExitNorthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("NB_ON"))
	startExitNorthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("NB_OFF"))
	startExitSouthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("SB_ON"))
	startExitSouthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("SB_OFF"))
	startExitEastOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("EB_ON"))
	startExitEastOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("EB_OFF"))
	startExitWestOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("WB_ON"))
	startExitWestOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("WB_OFF"))

	// Reads cash toll rates
	CASH_startExitNorthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_NB_ON"))
	CASH_startExitNorthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_NB_OFF"))
	CASH_startExitSouthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_SB_ON"))
	CASH_startExitSouthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_SB_OFF"))
	CASH_startExitEastOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_EB_ON"))
	CASH_startExitEastOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_EB_OFF"))
	CASH_startExitWestOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_WB_ON"))
	CASH_startExitWestOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_WB_OFF"))

	// Reads RATE INDEXED SunPass toll rates
	startExitNorthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("NB_ON_RI"))
	startExitNorthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("NB_OFF_RI"))
	startExitSouthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("SB_ON_RI"))
	startExitSouthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("SB_OFF_RI"))
	startExitEastOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("EB_ON_RI"))
	startExitEastOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("EB_OFF_RI"))
	startExitWestOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("WB_ON_RI"))
	startExitWestOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("WB_OFF_RI"))

	// Reads RATE INDEXED cash toll rates
	CASH_startExitNorthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_NB_ON_RI"))
	CASH_startExitNorthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_NB_OFF_RI"))
	CASH_startExitSouthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_SB_ON_RI"))
	CASH_startExitSouthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_SB_OFF_RI"))
	CASH_startExitEastOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_EB_ON_RI"))
	CASH_startExitEastOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_EB_OFF_RI"))
	CASH_startExitWestOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_WB_ON_RI"))
	CASH_startExitWestOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitFrom].getAttribute("CASH_WB_OFF_RI"))
	
	isReset1=false;
}
		
function getEndingExitData(endName,endMile,endFacility) { // same as getStartging ExitData
	secondSelection =  myFacilityID	 +	myExitNum + " - " +	myExitName 
	var endExitName_XML = '';
	exitTo = "NOVALUE";

	for (var k=0;k<numExits.length;k++) {
		endExitName_XML = indexArray[k]
		endExitName_XML = endExitName_XML.replace("'","\\'")
		if (secondSelection.toUpperCase() == endExitName_XML.toUpperCase()) {
		exitTo = k;
		////alert("jsCalculations_2014.js Line #297 - End Exit Found. index is" + indexArray[k]);
	    }
	}
	if (exitTo=="NOVALUE"){
		//alert("END Exit Names Do Not Match.  Compare Fusion Table to XML file.");
		return false;
	}

	//endExitName=xmlDoc.getElementsByTagName("EXIT")[exitTo].childNodes[0].nodeValue
	//endExitMile=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("MILE_POINT"))
	//endExitFacilityId=xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("FACILITY_ID")
	//endExitName=endName;
	endExitName=endName.replace(/\\'/g,"'");
	endExitMile=endMile;
    endExitFacilityId=endFacility;
	
	// Reads SunPass tolls
	endExitNorthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("NB_ON"))
	endExitNorthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("NB_OFF"))
	endExitSouthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("SB_ON"))
	endExitSouthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("SB_OFF"))
	endExitEastOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("EB_ON"))
	endExitEastOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("EB_OFF"))
	endExitWestOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("WB_ON"))
	endExitWestOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("WB_OFF"))

	// Reads cash tolls
	CASH_endExitNorthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_NB_ON"))
	CASH_endExitNorthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_NB_OFF"))
	CASH_endExitSouthOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_SB_ON"))
	CASH_endExitSouthOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_SB_OFF"))
	CASH_endExitEastOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_EB_ON"))
	CASH_endExitEastOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_EB_OFF"))
	CASH_endExitWestOn=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_WB_ON"))
	CASH_endExitWestOff=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_WB_OFF"))
	
	// Reads RATE INDEXED SunPass tolls
	endExitNorthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("NB_ON_RI"))
	endExitNorthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("NB_OFF_RI"))
	endExitSouthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("SB_ON_RI"))
	endExitSouthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("SB_OFF_RI"))
	endExitEastOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("EB_ON_RI"))
	endExitEastOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("EB_OFF_RI"))
	endExitWestOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("WB_ON_RI"))
	endExitWestOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("WB_OFF_RI"))
	
	// Reads RATE INDEXED Cash tolls
	CASH_endExitNorthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_NB_ON_RI"))
	CASH_endExitNorthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_NB_OFF_RI"))
	CASH_endExitSouthOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_SB_ON_RI"))
	CASH_endExitSouthOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_SB_OFF_RI"))
	CASH_endExitEastOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_EB_ON_RI"))
	CASH_endExitEastOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_EB_OFF_RI"))
	CASH_endExitWestOn_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_WB_ON_RI"))
	CASH_endExitWestOff_RI=parseFloat(xmlDoc.getElementsByTagName("EXIT")[exitTo].getAttribute("CASH_WB_OFF_RI"))
	
	isReset2=false;
}


function calculateToll() {
	//document.getElementById("messageDIV").style.visibility = "visible";
	//document.getElementById("subMsgDIV").style.visibility = "visible";
	var formatMile = new NumberFormat();
	var formatTotalToll = new NumberFormat();
	var formatCASHTotalToll = new NumberFormat();
	var formatTotalToll_RI = new NumberFormat();
	var formatCASHTotalToll_RI = new NumberFormat();

	outputText = "";
	outputText2 = "";
	tempToll = 0;
	CASH_tempToll = 0;
	tempMile = 0;
	tempFacID = "";
	tempPlazaName = "";
	inlineToll=0;
	CASH_inlineToll=0;
	//Added for Rate Indexing May 2012 M.Esser
	tempToll_RI = 0;
	CASH_tempToll_RI = 0;
	startToll_RI = 0;
	endToll_RI = 0;
	CASH_startToll_RI = 0;
	CASH_endToll_RI = 0;
	inlineToll_RI=0;
	CASH_inlineToll_RI=0;
	inlineToll_RI_WB=0;
	CASH_inlineToll_RI_WB=0;
	totalToll_RI=0;
	CASH_totalToll_RI=0;
	
	// Verify that starting exit and ending exit are not the same
	if ((startExitFacilityId + startExitName + startExitMile)==(endExitFacilityId + endExitName + endExitMile)) {
	    //alert("Starting exit and ending exit must be different.  Please try again.");
	} else {  // Calculate toll
	    mileage = startExitMile - endExitMile;
	    // Determine direction of travel
	    if (startExitFacilityId==endExitFacilityId) { // If both exits are in the same facility
			////alert("jsCalculations_2014.js Line #396 - startExitFacilityId = " + startExitFacilityId + " and endExitFacilityId = " + endExitFacilityId);
				if ((startExitFacilityId!="M")&&(endExitFacilityId!="M")) { // Both exits are not along the mainline
					//Get Facility name
					var facilityName="";
					for (var c=0; c<numFacilities.length;c++) {
						if (xmlDoc.getElementsByTagName("EXIT")[c].getAttribute("ID")==endExitFacilityId) {
							facilityName = xmlDoc.getElementsByTagName("EXIT")[c].childNodes(0).nodeValue;
						}
				    }
		
					var theDirection = "";
		
					if ((startExitFacilityId=="P")||(startExitFacilityId=="B")||(startExitFacilityId=="ALLIGATOR")||(startExitFacilityId=="CROSSTOWN")||(startExitFacilityId=="EW")) {
						theDirection="EastWest" 
					} else {
					    theDirection="NorthSouth"
					}
					
					switch (theDirection) {
						case "EastWest":
							// for Polk Parkway, Bee Line, and Alligator Alley
							if (startExitFacilityId=="ALLIGATOR") {  // Exception for Alligator Alley
								// Mile posts increases from east to west
								mileage = mileage * (-1)
							}
							if (mileage > 0) { // direction is west to east
								startToll= startExitWestOn;
								endToll= endExitWestOff;
								CASH_startToll = CASH_startExitWestOn;
								CASH_endToll = CASH_endExitWestOff;
								// Find In-line-Toll-Plazas
								inlineToll = getInlineToll_SunPass_West();
								CASH_inlineToll = getInlineToll_Cash_West();
								
								//RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								endToll_RI = endExitWestOff_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								// Find In-line-Toll-Plazas
								inlineToll_RI = getInlineToll_SunPass_West_RI();
								CASH_inlineToll_RI = getInlineToll_Cash_West_RI();
								// Find In-line-Toll-Plazas WesternBeltway
								inlineToll_RI_WB = getInlineToll_SunPass_West_RI_WB();
								CASH_inlineToll_RI_WB = getInlineToll_Cash_West_RI_WB();
								myInlineTollPlazas.sort(sortSouthBound);
								myInlineTollPlazasCASH.sort(sortSouthBound);
								
							} else { // direction is east
								startToll= startExitEastOn;
								endToll = endExitEastOff;
								CASH_startToll= CASH_startExitEastOn;
								CASH_endToll = CASH_endExitEastOff;
								// Find In-line-Toll-Plazas
								inlineToll = getInlineToll_SunPass_East();
								CASH_inlineToll=getInlineToll_Cash_East();
								
								//RATE INDEXING
								startToll_RI= startExitEastOn_RI;
								endToll_RI = endExitEastOff_RI;
								CASH_startToll_RI= CASH_startExitEastOn_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								// Find In-line-Toll-Plazas
								inlineToll_RI = getInlineToll_SunPass_East_RI();
								CASH_inlineToll_RI = getInlineToll_Cash_East_RI();
								// Find In-line-Toll-Plazas WesternBeltway
								inlineToll_RI_WB = getInlineToll_SunPass_East_RI_WB();
								CASH_inlineToll_RI_WB = getInlineToll_Cash_East_RI_WB();
								myInlineTollPlazas.sort(sortNorthBound);
								myInlineTollPlazasCASH.sort(sortNorthBound);
							}
							break;
						
						case "NorthSouth":
							// for Veterans Expressway, Suncoast Parkway, Mainline, Souther Connector, Greeneway, Seminole Expressway, Western Beltway
							if (mileage > 0) { // direction is South
								startToll= startExitSouthOn;
								endToll= endExitSouthOff;
								CASH_startToll= CASH_startExitSouthOn;
								CASH_endToll = CASH_endExitSouthOff;
								inlineToll = getInlineToll_SunPass_South();
								CASH_inlineToll = getInlineToll_Cash_South();
								
								//Rate Indexing
								startToll_RI = startExitSouthOn_RI;
								endToll_RI = endExitSouthOff_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
								inlineToll_RI = getInlineToll_SunPass_South_RI();
								CASH_inlineToll_RI = getInlineToll_Cash_South_RI();
								// Find In-line-Toll-Plazas WesternBeltway
								inlineToll_RI_WB = getInlineToll_SunPass_South_RI_WB();
								CASH_inlineToll_RI_WB = getInlineToll_Cash_South_RI_WB();
								myInlineTollPlazas.sort(sortSouthBound);
								myInlineTollPlazasCASH.sort(sortSouthBound);
								
							} else { // direction is North
								startToll= startExitNorthOn;
								endToll = endExitNorthOff;
								CASH_startToll= CASH_startExitNorthOn;
								CASH_endToll = CASH_endExitNorthOff;
								inlineToll = getInlineToll_SunPass_North();
								CASH_inlineToll = getInlineToll_Cash_North();
								
								//Rate Indexing
								startToll_RI = startExitNorthOn_RI;
								endToll_RI = endExitNorthOff_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								inlineToll_RI = getInlineToll_SunPass_North_RI();
								CASH_inlineToll_RI = getInlineToll_Cash_North_RI();
								// Find In-line-Toll-Plazas WesternBeltway
								inlineToll_RI_WB = getInlineToll_SunPass_North_RI_WB();
								CASH_inlineToll_RI_WB = getInlineToll_Cash_North_RI_WB();
								myInlineTollPlazas.sort(sortNorthBound);
								myInlineTollPlazasCASH.sort(sortNorthBound);
							} 
							break;
					}
					
					//Ignore EVERYTHING about calculating tools for Selmon Connector
					//Only toll point is the TOLL PLAZA in the center of it.  ALL Ramps are $0.00 Toll
					//SunPass and Toll-By-Plate ONLY
					if (startExitFacilityId == "S" && endExitFacilityId == "S") {
						totalToll = 0;
						totalToll_RI = 0;
						startToll = 0;
						startToll_RI = 0;
						endToll = 0;
						endToll_RI = 0;
						CASH_startToll = 0;
						CASH_startToll_RI = 0;
						CASH_endToll = 0;
						CASH_endToll_RI = 0;
						inlineToll_RI = getInlineToll_Selmon();
						CASH_inlineToll_RI = getInlineTollCASH_Selmon();
					}

					//Calculate Toll - ORIGINAL
					//totalToll= axleFactor * (startToll + endToll + inlineToll)
					//CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)

					//Rate Indexed Toll Amounts
					// Western Beltway tolls do NOT multiply by # of axles
					// As of 1/17/2014 - They do multiple by axle count (Per Daniel confirmed by Binod)
					if (startExitFacilityId == "WB" && endExitFacilityId == "WB") {
						totalToll_RI= (startToll_RI + endToll_RI + inlineToll_RI_WB) * axleFactor
						CASH_totalToll_RI= (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI_WB) * axleFactor
					} else if (startExitFacilityId == "S" && endExitFacilityId == "S") {
						if ((startExitName=="Port to I-4 EB or WB (Trucks Only)")||(endExitName=="Port to I-4 EB or WB (Trucks Only)")) {
							totalToll_RI=  (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI= (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							mileage = 1.7;
						} else {
							totalToll_RI= axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI= axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							mileage = 1;
						}

					} else {
						//Sawgrass exits DO NOT charge per axles
						if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
							totalToll_RI = axleFactor * inlineToll_RI + (startToll_RI + endToll_RI)
							CASH_totalToll_RI = axleFactor * CASH_inlineToll_RI + (CASH_startToll_RI + CASH_endToll_RI)
						} else {
							totalToll_RI= axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI= axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)						
						}
					}

					formatMile.setNumber(Math.abs(mileage));
					formatMile.setCurrency(false);
					formatTotalToll.setNumber(totalToll);
					formatCASHTotalToll.setNumber(CASH_totalToll);

					//Added for Rate Indexing
					formatTotalToll_RI.setNumber(totalToll_RI);
					formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

					var spOnly;
					spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK
										
					if (totalToll_RI > 900) {
						//alert("Invalid movement. Please Try Again");
						clearRouteArrays();
						myTollAmounts[0]=0;
						myTollAmounts[1]=0;
						myTollAmounts[2]=0;
						return (myTollAmounts);
					} else {
						myTollAmounts[0]=formatTotalToll_RI;
						myTollAmounts[1]=formatCASHTotalToll_RI;
						// Include milage in arry to send back to map page
						myTollAmounts[2]=formatMile;
						return (myTollAmounts);
					}
					//document.getElementById("messageDIV").innerHTML=outputText
				} else { // starting exit and exit ending, both are along the mainline
						var exitsLoc = ""
						var sExitLoc = ""
						var eExitLoc = ""
						// Starting exit data
						if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
							sExitLoc = "TS"
						} else { 
							if (startExitMile > 189.218) {  // Starting Exit is in North Coin System
								sExitLoc = "NC"
							}
							if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
								sExitLoc = "SC"								
							}
						}
						// Ending exit data
						if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Starting exit is in ticket system
							eExitLoc = "TS"		
						} else { 
							if (endExitMile > 189.218) {  // Ending Exit is in North Coin System
								eExitLoc = "NC"
							}
							if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
								eExitLoc = "SC"	
							}
						}
						exitsLoc = sExitLoc + eExitLoc
						
						var i = 0;
						var endExitSet = false;
						myInlineTollPlazas = [];
						myInlineTollPlazasCASH = [];
						ticketToll_RI = 0;
						CASH_ticketToll_RI = 0;
						
						switch (exitsLoc) {
							case "TSTS":	// Starts at ticket system ends at ticket system
									ticketToll = calculateTicketToll(startExitName, endExitName);
									CASH_ticketToll = calculateTicketToll_CASH(startExitName, endExitName);
									//For RATE INDEXING
									ticketToll_RI = calculateTicketToll_RI(startExitName, endExitName);
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, endExitName);
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + ticketToll_RI, endExitMile];
									//myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(ticketToll).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), endExitMile];
									i = i + 1;
									endExitSet = true;
									break;
							
							case "TSNC":	// Starts at ticket system ends at north coin system
									ticketToll = calculateTicketToll(startExitName, "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Three Lakes Plaza");
									endToll= endExitNorthOff;
									CASH_endToll = CASH_endExitNorthOff;
									
									ticketToll_RI = calculateTicketToll_RI(startExitName, "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Three Lakes Plaza");
									endToll_RI = endExitNorthOff_RI;
									CASH_endToll_RI = CASH_endExitNorthOff_RI;
									
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
									i = i + 1;
									
									break;

							case "TSSC":	// Starts at ticket system ends at south coin system
									ticketToll = calculateTicketToll(startExitName, "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Lantana Plaza");
									endToll= endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;
									
									ticketToll_RI = calculateTicketToll_RI(startExitName, "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Lantana Plaza");
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;
									
									myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
									myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
									i = i + 1;
									
									break;
							
							case "NCNC":	// Starts at north coin system ends at north coin system
									if ((startExitMile-endExitMile)<0){ // going north
										startToll= startExitNorthOn;
										endToll= endExitNorthOff;
										CASH_startToll= CASH_startExitNorthOn;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										startToll_RI = startExitNorthOn_RI;
										endToll_RI = endExitNorthOff_RI;
										CASH_startToll_RI = CASH_startExitNorthOn_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
									} else {  // going south
										startToll= startExitSouthOn;
										endToll= endExitSouthOff;
										CASH_startToll= CASH_startExitSouthOn;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										startToll_RI = startExitSouthOn_RI;
										endToll_RI = endExitSouthOff_RI;
										CASH_startToll_RI = CASH_startExitSouthOn_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
									}
									break;
							
							case "NCTS":	// Starts at north coin system ends at ticket system
									startToll= startExitSouthOn;
									CASH_startToll= CASH_startExitSouthOn;
									ticketToll = calculateTicketToll("Three Lakes Plaza", endExitName);
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", endExitName);

									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", endExitName);
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", endExitName);
									
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
									i = i + 1;
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(ticketToll_RI).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), endExitMile];
									i = i + 1;
									endExitSet = true;
									
									break;
							
							case "NCSC":	// Starts at north coin system ends at south coin system
									startToll= startExitSouthOn;
									CASH_startToll= CASH_startExitSouthOn;
									ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
									endToll= endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;

									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;

									myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00" , 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00" , 236];
									i = i + 1;
									//myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI* axleFactorTicket).toFixed(2) , 45];
									myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2) , 88];
									myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
									i = i + 1;
									
									break;
							
							case "SCSC":	// Starts at south coin system ends at south coin system
									if ((startExitMile-endExitMile)<0){ // going north
										startToll= startExitNorthOn;
										endToll= endExitNorthOff;
										CASH_startToll= CASH_startExitNorthOn;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										startToll_RI = startExitNorthOn_RI;
										endToll_RI = endExitNorthOff_RI;
										CASH_startToll_RI = CASH_startExitNorthOn_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
										
									} else {  // going south
										startToll= startExitSouthOn;
										endToll= endExitSouthOff;
										CASH_startToll= CASH_startExitSouthOn;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										startToll_RI = startExitSouthOn_RI;
										endToll_RI = endExitSouthOff_RI;
										CASH_startToll_RI = CASH_startExitSouthOn_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
									}
									break;
							
							case "SCTS":	// Starts at south coin system ends at ticket system
									startToll= startExitNorthOn;
									CASH_startToll= CASH_startExitNorthOn;
									ticketToll = calculateTicketToll("Lantana Plaza", endExitName);
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", endExitName);

									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", endExitName);
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", endExitName);
									
									myInlineTollPlazas[i] = ["Lantana Plaza - $0.00" , 88];
									myInlineTollPlazasCASH[i] = ["Lantana Plaza - $0.00", 88];
									i = i + 1;
									
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(ticketToll_RI).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), endExitMile];
									i = i + 1;
									endExitSet = true;
									break;
							
							case "SCNC":	// Starts at south coin system ends at north coin system
									startToll= startExitNorthOn;
									CASH_startToll= CASH_startExitNorthOn;
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
									endToll= endExitNorthOff;
									CASH_endToll = CASH_endExitNorthOff;
									
									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
									endToll_RI = endExitNorthOff_RI;
									CASH_endToll_RI = CASH_endExitNorthOff_RI;
									
									myInlineTollPlazas[i] = ["Lantana Plaza - $0.00", 88];
									myInlineTollPlazasCASH[i] = ["Lantana Plaza - $0.00", 88];
									i = i + 1;
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2) , 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2) , 236];
									i = i + 1;
									break;
						}

						myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
						myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
						i = i + 1;

						// In-line toll plazas
						for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
							tempMile = inLineMilePT(w);
							tempToll = inLineTempToll(w); // Transponder payments
							CASH_tempToll = inLineTempCashToll(w);// Cash payments
							tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
							CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
							tempFacID = inLineTempID(w);
							tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
							if (((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID))||((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID))) {
								inlineToll = inlineToll + tempToll	
								CASH_inlineToll = CASH_inlineToll + CASH_tempToll
								//For RATE INDEXING
								inlineToll_RI = inlineToll_RI + tempToll_RI	
								CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI

								myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
								myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
								i = i + 1;
							}
						}
												

						if (startExitMile-endExitMile>0) {
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
						} else {
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
						}


						if (!endExitSet) {
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor ).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor ).toFixed(2), endExitMile];						
						}
/*
						if (startExitMile-endExitMile>0) {
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
						} else {
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
						}
*/
						mileage = Math.abs(startExitMile-endExitMile);
						
						// Calculate Toll
						totalToll = (axleFactor * (startToll + endToll + inlineToll)) + (ticketToll * axleFactorTicket)
						CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)

						// Calculate RATE INDEXED Toll
						totalToll_RI = (axleFactor * (startToll_RI + endToll_RI + inlineToll_RI))  + + ticketToll_RI
						CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
						
						if (CASH_startToll<999) {
						  TEMP_CASH_ticketToll = TEMP_CASH_ticketToll + CASH_startToll;
						}
						if (CASH_endToll<999) {
						  TEMP_CASH_ticketToll = TEMP_CASH_ticketToll + CASH_endToll
						}
						if (CASH_inlineToll<999) {
						  TEMP_CASH_ticketToll = TEMP_CASH_ticketToll + CASH_inlineToll
						}

						// Display results when both exit belong to same facility
						formatMile.setNumber(Math.abs(mileage));
						//formatMile.setCurrency(false);
						formatTotalToll.setNumber(totalToll);
						formatCASHTotalToll.setNumber(CASH_totalToll);

						//Added for Rate Indexing
						formatTotalToll_RI.setNumber(totalToll_RI);
						formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

						var spOnly;
						spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK
						
						if (totalToll_RI > 900) {
							//alert("Invalid movement. Please Try Again");
							clearRouteArrays();
							myTollAmounts[0]=0;
							myTollAmounts[1]=0;
							myTollAmounts[2]=0;
							return (myTollAmounts);
						} else {
							myTollAmounts[0]=formatTotalToll_RI;
							myTollAmounts[1]=formatCASHTotalToll_RI;
							// Include milage in arry to send back to map page
							myTollAmounts[2]=formatMile;
							return (myTollAmounts);
						}

						//document.getElementById("messageDIV").innerHTML=outputText
					}
						
// EXITS NOT SAME FACILITY						
						
	} else { // When exits are not in the same facility
			////alert("jsCalculations_2014.js Line #895 - Exits are in Different Facilities");
						var i = 0;
						myInlineTollPlazas = [];
						myInlineTollPlazasCASH = [];
						ticketToll_RI = 0;
						CASH_ticketToll_RI = 0;
						
						// User selects exits on Polk Parkway and Veterans Expressway
						startingFacilityName="";
						endingFacilityName="";
						for (var c=0; c<numFacilities.length;c++) {
							if (xmlDoc.getElementsByTagName("FACILITY")[c].getAttribute("ID")==startExitFacilityId) {
								startingFacilityName = xmlDoc.getElementsByTagName("FACILITY")[c].nodeValue
							}
						}
						for (var c=0; c<numFacilities.length;c++) {
							if (xmlDoc.getElementsByTagName("FACILITY")[c].getAttribute("ID")==endExitFacilityId) {
								endingFacilityName = xmlDoc.getElementsByTagName("FACILITY")[c].nodeValue
							}
						}
						
						if ((startExitFacilityId == "P" && endExitFacilityId == "V")||(startExitFacilityId == "V" && endExitFacilityId == "P")) {
							//alert("The exits you selected are not interconnected facilities (Polk Parkway and Veterans Expressway are not interconnected.  Please, try again with a different selection.")
						}
// ******************************************************************************************************************************************************************************************************************************
// Mainline and HEFT
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline and Heft
						if (startExitFacilityId == "M" && endExitFacilityId == "H") { // From Mainline to Heft
							// Toll along mainline
							if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
								startToll=0;
								CASH_startToll= 0;
								// Calculate Ticket toll
								ticketToll = calculateTicketToll(startExitName ,"Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Lantana Plaza");

								//For RATE INDEXING
								startToll_RI = 0;
								CASH_startToll_RI = 0;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
								ticketToll_RI = calculateTicketToll_RI(startExitName ,"Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Lantana Plaza");
								myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
								i = i + 1;
								// In-line toll plazas along mainline southern coin system south of the intersection with Sawgrass Expressway
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									if ((42.188>tempMile)&&(tempMile>0)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For RATE INDEXING
										inlineToll_RI = inlineToll_RI + tempToll_RI	
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
										if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							} else { 
								if (startExitMile > 189.218) {  // Starting Exit is in North Coin System
									startToll= startExitSouthOn;
									CASH_startToll= CASH_startExitSouthOn;
									// Calculate Ticket toll
									ticketToll = calculateTicketToll("Three Lakes Plaza","Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza","Lantana Plaza");

									//For RATE INDEXING
									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza","Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza","Lantana Plaza");
									myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
									myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
									i = i + 1;
									// In line toll north coin system
									for (var w=0;w<numTollPlazas.length;w++) { 
									    tempMile = inLineMilePT(w);
									    tempToll = inLineTempToll(w); // Transponder payments
									    CASH_tempToll = inLineTempCashToll(w);// Cash payments
									    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									    tempFacID = inLineTempID(w);
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
										if ((startExitMile>tempMile)&&(tempMile>189.218)&&(startExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For RATE INDEXING
											inlineToll_RI = inlineToll_RI + tempToll_RI	
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}
									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
									i = i + 1;
									myInlineTollPlazas[i] = ["Lantana Toll Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
									myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
									i = i + 1;
									
								}
								if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
									startToll= startExitSouthOn;
									CASH_startToll= CASH_startExitSouthOn;
									//For RATE INDEXING
									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
									myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), parseFloat(100-startExitMile)];
									myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , parseFloat(100-startExitMile)];
									i = i + 1;
								}
								// In-line toll plazas along mainline southern coin system south of the intersection with Sawgrass Expressway
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									if ((42.188>tempMile)&&(tempMile>0)&&(tempMile<startExitMile)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll	
										//For RATE INDEXING
										inlineToll_RI = inlineToll_RI + tempToll_RI	
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
										if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							// Toll along HEFT
								if (startExitName=="County Line Rd.") { // Exception for County Line Rd
									endToll = 999;
									CASH_endToll = 999;
									endToll_RI = 999;
									CASH_endToll_RI = 999;
								} else {
									endToll= endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;
								}
								// In-line toll plazas along HEFT going south
								////alert("jsCalculations_2014.js Line #1068 - Mainline Toll = " = inlinetoll);
								var inlineHeft = 0;
								var inlineHeft_RI = 0;
								var CASH_inlineHeft_RI = 0;
								for (var w=0;w<numTollPlazas.length;w++) {
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w); // Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									if ((endExitMile<tempMile)&&(tempMile<47.586)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										inlineHeft = inlineHeft + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For RATE INDEXING
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										if(tempPlazaName != "Bird Road North Toll Plaza"){
											if (endExitName == "NW 27th Ave. (University Dr.)") {
												tempToll_RI = tempToll_RI + endToll_RI;
												CASH_tempToll_RI = CASH_tempToll_RI + CASH_endToll_RI;
											} else {
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										}
									}
								}
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);

							// Mileage both facilities 
							// equation: mainline=0/HEFT=47.856
							mileage = parseFloat(startExitMile) + Math.abs(47.856 - endExitMile)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)

							//Calculate RATE INDEXED Amounts
							totalToll_RI = (axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)) + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							//Added June 2014 to address the negative Toll Amount displayed at Exit 47 M.Esser
							if (endExitName == "NW 27th Ave. (University Dr.)") {
								endToll_RI = 0.78;
								CASH_endToll_RI = 1.04;
							}
							
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for RATE INDEXING
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
						}
						
// ******************************************************************************************************************************************************************************************************************************
//  HEFT and Mainline
// ******************************************************************************************************************************************************************************************************************************
						// From Heft to Mainline
						if (startExitFacilityId == "H" && endExitFacilityId == "M") { 
							// Toll along HEFT
							i = 0;
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;
							
							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								if ((startExitMile<tempMile)&&(tempMile<47.856)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For RATE INDEXING
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									if(tempPlazaName != "Bird Road South Toll Plaza"){
										if(tempPlazaName == "Bird Road North Toll Plaza"){tempToll_RI=1.04; CASH_tempToll_RI=1.30;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
									
								}
							}

							// Ending exit data
							// Ending exit is in ticket system
							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { 
								endToll= 0;
								CASH_endToll = 0;
								ticketToll = calculateTicketToll("Lantana Plaza", endExitName);
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", endExitName);
								
								//For RATE INDEXING
								endToll_RI = 0;
								CASH_endToll_RI = 0;
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", endExitName);
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", endExitName);

								// In-line toll plazas along mainline southern coin system
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									if ((endExitMile>tempMile)&&(tempMile<42.188)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For RATE INDEXING
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
										if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
								// In line toll Plazas Ticket System
								myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
								myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
								i = i + 1;
								myInlineTollPlazas.sort(sortNorthBound);
								myInlineTollPlazasCASH.sort(sortNorthBound);							
								myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((endToll_RI * axleFactor)+(ticketToll_RI)).toFixed(2), endExitMile];
								myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_endToll_RI * axleFactor)+(CASH_ticketToll_RI * axleFactorTicket)).toFixed(2), endExitMile];
								
							} else { 
								if (endExitMile > 189.218) {  // Ending Exit is in North Coin System
									endToll= endExitNorthOff;
									CASH_endToll = CASH_endExitNorthOff;
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
								
									//For RATE INDEXING
									endToll_RI = endExitNorthOff_RI;
									CASH_endToll_RI = CASH_endExitNorthOff_RI;
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");

									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
									myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
									i = i + 1;
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
									i = i + 1;
									
									// In-line toll plazas along mainline southern coin system
									var thisMainlineToll = 0;
									var thisMainlineToll_RI = 0;
									for (var w=0;w<numTollPlazas.length;w++) { 
									    tempMile = inLineMilePT(w);
									    tempToll = inLineTempToll(w); // Transponder payments
									    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								        tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								        CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									    tempFacID = inLineTempID(w);
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
										if ((endExitMile>tempMile)&&(tempMile>0)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll
											thisMainlineToll=thisMainlineToll + tempToll
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
											//For RATE INDEXING
											inlineToll_RI = inlineToll_RI + tempToll_RI
											thisMainlineToll_RI = thisMainlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
											if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}
									myInlineTollPlazas.sort(sortNorthBound);
									myInlineTollPlazasCASH.sort(sortNorthBound);
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];

								}
								if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
									endToll = endExitNorthOff;
									CASH_endToll = CASH_endExitNorthOff;
									//For RATE INDEXING
									endToll_RI = endExitNorthOff_RI;
									CASH_endToll_RI = CASH_endExitNorthOff_RI;

									// In-line toll plazas along mainline southern coin system
									for (var w=0;w<numTollPlazas.length;w++) { 
									    tempMile = inLineMilePT(w);
									    tempToll = inLineTempToll(w); // Transponder payments
									    CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									    tempFacID = inLineTempID(w);
										if ((endExitMile>tempMile)&&(tempMile<69)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
											//For RATE INDEXING
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
											if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}

									myInlineTollPlazas.sort(sortNorthBound);
									myInlineTollPlazasCASH.sort(sortNorthBound);
									
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
								}
				
							}
							// Mileage both facilities 
							// equation: mainline=0/HEFT=47.856
							// mileage = parseFloat(startExitMile) + Math.abs(47.856 - endExitMile)
							mileage = Math.abs(47.856 - startExitMile) + parseFloat(endExitMile);

							//Added this May 2010 to account for logic in electronicOnly function to determine Northbound or Southbound (M.Esser)
							mileage = mileage * -1
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}

						}
// ******************************************************************************************************************************************************************************************************************************
// Mainline and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline and Sawgrass
						if (startExitFacilityId == "SG" && endExitFacilityId == "M") {  // From Sawgrass to Mainline
							// Toll along Sawgrass
							i = 0;
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * 1).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * 1).toFixed(2) , startExitMile];
							i = i + 1;

							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								
								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll		
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI		
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							// Ending exit data
							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Ending exit is in ticket system
								endToll = 0;
								CASH_endToll = 0;
								ticketToll = calculateTicketToll("Lantana Plaza", endExitName); 
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", endExitName);
								//For RATE INDEXING
								endToll_RI = 0;
								CASH_endToll_RI = 0;
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", endExitName); 
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", endExitName);
								
								// In line toll Plazas Ticket System
								myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
								myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
								i = i + 1;
								myInlineTollPlazas.sort(sortNorthBound);
								myInlineTollPlazasCASH.sort(sortNorthBound);							
								myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((endToll_RI * axleFactor)+(ticketToll_RI)).toFixed(2), endExitMile];
								myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_endToll_RI * axleFactor)+(CASH_ticketToll_RI * axleFactorTicket)).toFixed(2), endExitMile];
								
							} else { 
								if (endExitMile > 189.218) {  // Ending Exit is in North Coin System
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
									endToll= endExitNorthOff;
									CASH_endToll = CASH_endExitNorthOff;
									//For RATE INDEXING
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
									endToll_RI = endExitNorthOff_RI;
									CASH_endToll_RI = CASH_endExitNorthOff_RI;
									
									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
									myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
									i = i + 1;
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
									i = i + 1;
									
									// In-line toll plazas along mainline northern coin system 
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
										tempFacID = inLineTempID(w);
										if ((endExitMile>tempMile)&&(tempMile>189.218)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;											
										}
									}

									myInlineTollPlazas.sort(sortNorthBound);
									myInlineTollPlazasCASH.sort(sortNorthBound);							
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
								}
								if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
									if (endExitMile > 24.401) {  // North of the intersection with Sawgrass Expressway
										endToll= endExitNorthOff;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										endToll_RI = endExitNorthOff_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
										
										// In-line toll plazas along mainline southern coin system north of the intersection with Sawgrass Expressway
										// There should NOT be any at this time but leaving the logic here for the future 11/12 M.Esser
										for (var w=0;w<numTollPlazas.length;w++) { 
									        tempMile = inLineMilePT(w);
									        tempToll = inLineTempToll(w); // Transponder payments
									        CASH_tempToll = inLineTempCashToll(w);// Cash payments
								        	tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								        	CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									        tempFacID = inLineTempID(w);
											if ((endExitMile>tempMile)&&(tempMile>24.401)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;	
											}
										}
										myInlineTollPlazas.sort(sortNorthBound);
										myInlineTollPlazasCASH.sort(sortNorthBound);							
										myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
										myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
										
									} else {			// South of the intersection with Sawgrass Expressway
										endToll = endExitSouthOff;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										endToll_RI = endExitSouthOff_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
										
										// In-line toll plazas along mainline southern coin system south of the intersection with Sawgrass Expressway
										for (var w=0;w<numTollPlazas.length;w++) { 
											tempMile = inLineMilePT(w);
											tempToll = inLineTempToll(w); // Transponder payments
											CASH_tempToll = inLineTempCashToll(w);// Cash payments
											tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
											CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
											tempFacID = inLineTempID(w);
											if ((endExitMile<tempMile)&&(tempMile<24.401)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										}
										
										myInlineTollPlazas.sort(sortNorthBound);
										myInlineTollPlazasCASH.sort(sortNorthBound);
										myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
										myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
										
									}			
								}
							}
							// Mileage both facilities 
							// equation: mainline=24.401/sawgrass=20.76
								mileage = Math.abs(20.76 - startExitMile) + Math.abs(endExitMile - 24.401)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)

							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI) + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (endToll_RI + inlineToll_RI) + (startToll_RI + + ticketToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_startToll_RI 

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						// From Mainline to Sawgrass
						if (startExitFacilityId == "M" && endExitFacilityId == "SG") { // From Mainline to Sawgrass
							// Toll along mainline
							i = 0;
							if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
								startToll = 0;
								CASH_startToll = 0;
								// Calculate Ticket toll
								ticketToll = calculateTicketToll(startExitName, "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Lantana Plaza");
								
								//For RATE INDEXING
								startToll_RI = 0;
								CASH_startToll_RI = 0;
								ticketToll_RI = calculateTicketToll_RI(startExitName, "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Lantana Plaza");
									
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
								
								// In line toll Plazas Ticket System
								myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
								i = i + 1;

								myInlineTollPlazas.sort(sortSouthBound);
								myInlineTollPlazasCASH.sort(sortSouthBound);	

							} else { 
								if (startExitMile > 189.218) {  // Starting Exit is in North Coin System
									startToll = startExitSouthOn;
									CASH_startToll = CASH_startExitSouthOn;
									// Calculate ticket toll
									ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
									
									//For RATE INDEXING
									startToll_RI = startExitSouthOn;
									CASH_startToll_RI = CASH_startExitSouthOn;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
									
									myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
									myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
									i = i + 1;
									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Three Lakes Toll Plaza - $0.00", 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Toll Plaza - $0.00", 236];
									i = i + 1;
									myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
									myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
									i = i + 1;
									
									// In-line toll plazas along mainline northern coin system 
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
										tempFacID = inLineTempID(w);
										if ((startExitMile>tempMile)&&(tempMile>189.218)&&(startExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
											if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
										// Moved this here March 2014 for proper route display Southbound
										if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}
									
									myInlineTollPlazas.sort(sortSouthBound);
									myInlineTollPlazasCASH.sort(sortSouthBound);
								}
								if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
									if (startExitMile > 24.401) {  // North of the intersection with Sawgrass Expressway
										startToll = startExitSouthOn;
										CASH_startToll = CASH_startExitSouthOn;
										//For RATE INDEXING
										startToll_RI = startExitSouthOn_RI;
										CASH_startToll_RI = CASH_startExitSouthOn_RI;
										
										myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
										myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
										i = i + 1;
										
										// In-line toll plazas along mainline southern coin system north of the intersection with Sawgrass Expressway
										for (var w=0;w<numTollPlazas.length;w++) { 
											tempMile = inLineMilePT(w);
											tempToll = inLineTempToll(w); // Transponder payments
											CASH_tempToll = inLineTempCashToll(w);// Cash payments
											tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
											CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
											tempFacID = inLineTempID(w);
											if ((startExitMile>tempMile)&&(tempMile>24.401)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
											// Moved this here March 2014 for proper route display Southbound
											if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}

										}
										myInlineTollPlazas.sort(sortSouthBound);
										myInlineTollPlazasCASH.sort(sortSouthBound);
									} else {			// South of the intersection with Sawgrass Expressway
										startToll= startExitNorthOn;
										CASH_startToll= CASH_startExitNorthOn;
										//For RATE INDEXING
										startToll_RI = startExitNorthOn_RI;
										CASH_startToll_RI = CASH_startExitNorthOn_RI;

										myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
										myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
										i = i + 1;
										
										// In-line toll plazas along mainline southern coin system south of the intersection with Sawgrass Expressway
										for (var w=0;w<numTollPlazas.length;w++) { 
											tempMile = inLineMilePT(w);
											tempToll = inLineTempToll(w); // Transponder payments
											CASH_tempToll = inLineTempCashToll(w);// Cash payments
											tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
											CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
											tempFacID = inLineTempID(w);
											if ((startExitMile<tempMile)&&(tempMile<24.401)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
											// Moved this here March 2014 for proper route display Southbound
											if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek, Deerfield and Sunrise Toll plaza,  so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												if (tempPlazaName=="Deerfield Toll Plaza") {tempMile=48;}
												if (tempPlazaName=="Sunrise Toll Plaza") {tempMile=49;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}

										}
										myInlineTollPlazas.sort(sortNorthBound);
										myInlineTollPlazasCASH.sort(sortNorthBound);
									}					
								}
							}
							// Toll along Sawgrass
							endToll= endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
/*
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with milepost for Cypress Creek, Deerfield and Sunrise Toll plaza,  so it shows up in correct order on the route
									if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
									if (tempPlazaName=="Deerfield Toll Plaza") {tempMile=48;}
									if (tempPlazaName=="Sunrise Toll Plaza") {tempMile=49;}
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
*/
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * 1).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * 1).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: mainline=24.401/sawgrass=20.76
							mileage = Math.abs(startExitMile - 24.401) + Math.abs(20.76 - endExitMile)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts SAWGRASS DOES NOT CHARGE PER AXLE at the Exits ONLY at the Toll Plazas
							totalToll_RI = axleFactor * (startToll_RI + inlineToll_RI)  + endToll_RI + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_endToll_RI

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Mainline and Bee Line
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline and Bee Line
						if (startExitFacilityId == "M" && endExitFacilityId == "B") {  // From Mainline to Bee Line
							i = 0;
							// Starting exit data
							if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
								ticketToll = calculateTicketToll(startExitName, "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Three Lakes Plaza");
							
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI(startExitName, "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Three Lakes Plaza");
								
								startToll_RI = 0;
								CASH_startToll_RI = 0;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
								
								myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
								myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
								i = i + 1;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((189.218<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For route detail
										//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
										//if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							} else { 
								if (startExitMile > 189.218) {  // Starting Exit is in North Coin System
									if (startExitMile>208.302) { // North of Intersection with Bee Line
										startToll = startExitSouthOn;
										CASH_startToll = CASH_startExitSouthOn;
										startToll_RI = startExitSouthOn_RI;
										CASH_startToll_RI = CASH_startExitSouthOn_RI;
									} else {		// South of Intersection with Bee Line
										startToll = startExitNorthOn;
										CASH_startToll = CASH_startExitNorthOn;
										startToll_RI = startExitNorthOn_RI;
										CASH_startToll_RI = CASH_startExitNorthOn_RI;
									}
									
									myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
									myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
									i = i + 1;
									
									for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
									    tempMile = inLineMilePT(w);
									    tempToll = inLineTempToll(w); // Transponder payments
									    CASH_tempToll = inLineTempCashToll(w);// Cash payments
									    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									    tempFacID = inLineTempID(w);
										if (startExitMile>208.302) {
											if ((startExitMile>tempMile)&&(tempMile>208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												//if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										} else {
											if ((startExitMile<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										}
									}
								}
								if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
									startToll = startExitNorthOn;
									CASH_startToll = CASH_startExitNorthOn;
									//For RATE INDEXING
									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;

									myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
									myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
									i = i + 1;
									
									for (var w=0;w<numTollPlazas.length;w++) { 
									    tempMile = inLineMilePT(w);
									    tempToll = inLineTempToll(w); // Transponder payments
									    CASH_tempToll = inLineTempCashToll(w);// Cash payments
									    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									    tempFacID = inLineTempID(w);
										if ((startExitMile<tempMile)&&(tempMile<42.188)&&(startExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
											if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
									//For RATE INDEXING
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
									
									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
									myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
									i = i + 1;
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
									i = i + 1;
								}
							}
							// Ending exit data
							if (endExitMile<4.45) { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
							} else { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile>4.45)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll		
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For route detail
										//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
										if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
													
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							mileage = Math.abs(208.302 - startExitMile) + Math.abs(4.45 - endExitMile)
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
/*							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_OFF_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_OFF_RI"))
							}
*/							
							if (startExitMile > 208.302) { // start exit is North of intersection with Bee Line, thus direction is south
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_OFF_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_OFF_RI"))
								if (window.parent.document.getElementById("optPmtTypeSP").checked) {
									if (endExitMile<4.45) {//Westbound will take Consulate
										//SunPass option is checked so show Consulate Dr as the exit
										myInlineTollPlazas[i] = ["Consulate Dr. - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.402];
										myInlineTollPlazasCASH[i] = ["Consulate Dr. - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.402];
									} else {
										//Eastbound will take Orlando S Exit
										myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
										myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
									}
								} else {
									myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
									myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
								}
								i = i + 1;
								myInlineTollPlazas.sort(sortSouthBound);
								myInlineTollPlazasCASH.sort(sortSouthBound);
							} else { // Start exit is south of Bee Line thus direction is north
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_OFF_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_OFF_RI"))
								myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
								myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
								i = i + 1;
								myInlineTollPlazas.sort(sortNorthBound);
								myInlineTollPlazasCASH.sort(sortNorthBound);
							}

							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];							
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll + transToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll + CASH_transToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "B" && endExitFacilityId == "M") {  // From Bee Line to Mainline
							i = 0;
							// Starting exit data
							if (startExitMile<4.45) { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
							} else { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((startExitMile>tempMile)&&(tempMile>4.45)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For route detail
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
							
							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_ON_RI"))
							}
							
							myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
							myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
							i = i + 1;

							// Ending exit data
							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Ending exit is in ticket system
								ticketToll = calculateTicketToll("Three Lakes Plaza", endExitName);
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", endExitName);
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", endExitName);
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", endExitName);
								// In line toll Plazas Ticket System
								myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
								myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
								i = i + 1;
								myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((endToll_RI * axleFactor)+(ticketToll_RI)).toFixed(2), endExitMile];
								myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_endToll_RI * axleFactor)+(CASH_ticketToll_RI * axleFactorTicket)).toFixed(2), endExitMile];								
							} else { 
								if (endExitMile > 189.218) {  // Ending Exit is in North Coin System
									if (endExitMile > 208.302) { // North of intersection with Bee Line
										endToll = endExitNorthOff;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										endToll_RI = endExitNorthOff_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
										for (var w=0;w<numTollPlazas.length;w++) { 
											tempMile = inLineMilePT(w);
											tempToll = inLineTempToll(w); // Transponder payments
											CASH_tempToll = inLineTempCashToll(w);// Cash payments
											tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
											CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
											tempFacID = inLineTempID(w);
											if ((endExitMile>tempMile)&&(tempMile>208.302)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
										myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
										}
									} else { // South of intersection with Bee Line
										endToll = endExitSouthOff;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										endToll_RI = endExitSouthOff_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
										for (var w=0;w<numTollPlazas.length;w++) { 
											tempMile = inLineMilePT(w);
											tempToll = inLineTempToll(w); // Transponder payments
											CASH_tempToll = inLineTempCashToll(w);// Cash payments
											tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
											CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
											tempFacID = inLineTempID(w);
											if ((endExitMile<tempMile)&&(tempMile<208.302)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For route detail
												//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
												if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
												myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
												myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
												i = i + 1;
											}
										}
										myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
										myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
									}
								
								}
								if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
									endToll = endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;
									ticketToll = calculateTicketToll("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza" , "Lantana Plaza");
									
									//For RATE INDEXING
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza" , "Lantana Plaza");

									// In line toll Plazas Ticket System
									myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
									myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
									i = i + 1;
									myInlineTollPlazas[i] = ["Lantana Toll Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
									myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
									i = i + 1;

									for (var w=0;w<numTollPlazas.length;w++) { 
								        tempMile = inLineMilePT(w);
								        tempToll = inLineTempToll(w); // Transponder payments
								        CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								        tempFacID = inLineTempID(w);
										if ((endExitMile<tempMile)&&(tempMile<42.188)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For route detail
											//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
											if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
											myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
											myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
											i = i + 1;
										}
									}
									myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
									myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							mileage = Math.abs(208.302 - endExitMile) + Math.abs(4.45 - startExitMile)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll + transToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll + CASH_transToll) + (CASH_ticketToll * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Bee Line and HEFT
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Bee Line and Heft
						if (startExitFacilityId == "B" && endExitFacilityId == "H") { // From Bee Line to Heft
							i = 0;
							// Toll on Bee line
							if (startExitMile<4.45) { // going east
								startToll= startExitEastOn;
								CASH_startToll= CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
							} else { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;

								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile>4.45)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For route detail
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_ON_RI"))
							}
							myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
							myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
							i = i + 1;
							
							// Toll along mainline
							ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
							// In line toll Plazas Ticket System
							myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
							myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
							i = i + 1;
							myInlineTollPlazas[i] = ["Lantana Toll Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
							myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
							i = i + 1;

							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile<208.302)&&(tempMile>0)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
									if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=47;}
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
						
							// Toll on Heft, direction South
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							// In-line toll plazas along HEFT going south
							for (var w=0;w<numTollPlazas.length;w++) { 
						        tempMile = inLineMilePT(w);
						        tempToll = inLineTempToll(w); // Transponder payments
						        CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
						        tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<47.586)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Route Detail
									//To deal with milepost for Bird Rd Toll plazas so it shows up in correct order on the route
									if (tempPlazaName!="Bird Road North Toll Plaza") {
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
									
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           HEFT = 47.856/mainline = 0
							//           Bee Line = 4.45/Mainline = 208.302 
							mileage = Math.abs(47.856 - endExitMile) + Math.abs(4.45 - startExitMile) + (208.302)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
						}
						if (startExitFacilityId == "H" && endExitFacilityId == "B") { // From Heft to Bee Line
							i = 0;
							// Toll on Heft, direction North
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;
							
							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<47.856)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Route Detail
									//To deal with milepost for Bird Rd Toll plazas so it shows up in correct order on the route
									if (tempPlazaName!="Bird Road South Toll Plaza") {
										if(tempPlazaName == "Bird Road North Toll Plaza"){tempToll_RI=1.04; CASH_tempToll_RI=1.30;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							// Mile and toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							// In line toll Plazas Ticket System
							myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
							myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
							i = i + 1;
							myInlineTollPlazas[i] = ["Lantana Toll Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
							myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
							i = i + 1;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile<208.302)&&(tempMile>0)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI	
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_ON_RI"))
							}
							myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
							myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
							i = i + 1;
							
							// Toll on Bee line
							// Ending exit data
							if (endExitMile<4.45) { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
							} else { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile>4.45)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];

							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           HEFT = 47.856/mainline = 0
							//           Bee Line = 4.45/Mainline = 208.302 
							mileage = Math.abs(47.856 - startExitMile) + Math.abs(4.45 - endExitMile) + (208.302)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							//document.getElementById("subMsgDIV").style.visibility = "visible";
						}
// ******************************************************************************************************************************************************************************************************************************
// Bee Line and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Bee Line and Sawgrass
						if (startExitFacilityId == "SG" && endExitFacilityId == "B") { // From Sawgrass to Bee Line
							i = 0;
							// Toll on Sawgrass, direction North
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							//Per Daniel July 2013 - Sawgrass does NOT charge per axle
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * 1).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * 1).toFixed(2) , startExitMile];
							i = i + 1;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
								
							// In line toll Plazas Ticket System
							myInlineTollPlazas[i] = ["Lantana Toll Plaza - $0.00", 88];
							myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $0.00", 88];
							i = i + 1;
							myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 236];
							myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
							i = i + 1;
								
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>24.401)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI	
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}

							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_ON_RI"))
							}
							myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
							myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
							i = i + 1;
							
							// Toll on Bee line
							// Ending exit data
							if (endExitMile<4.45) { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
							} else { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile>4.45)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           Sawgrass = 20.76/mainline = 24.401
							//           Bee Line = 4.45/Mainline = 208.302 
							mileage = Math.abs(24.401 - startExitMile) + Math.abs(4.45 - endExitMile) + (208.302-24.401)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (endToll_RI + inlineToll_RI + transToll_RI) + (startToll_RI + + ticketToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_startToll_RI 
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "B" && endExitFacilityId == "SG") { // From Bee Line to Sawgrass
							i = 0;
							// Toll on Bee line
							if (startExitMile<4.45) { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
							} else { // going east
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile>4.45)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							// Toll paid when getting off of mainline and getting on Bee Line
							transToll = beeLineTrans_SP(BeeLineMainlineExit);
							CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
							//transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
							//CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
							if (endExitMile > 208.302) { // North of intersection with Bee Line
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("NB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_NB_ON_RI"))
							} else {
								transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_ON_RI"))
								CASH_transToll_RI =  parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_ON_RI"))
							}
							myInlineTollPlazas[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(transToll_RI * axleFactor).toFixed(2), 208.302];
							myInlineTollPlazasCASH[i] = ["Orlando South (U.S. 17/92/441) - $" + parseFloat(CASH_transToll_RI * axleFactor).toFixed(2), 208.302];
							i = i + 1;
							
							// Toll along mainline
							ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
							
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
							
							// In line toll Plazas Ticket System
							myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00", 236];
							myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00", 236];
							i = i + 1;
							myInlineTollPlazas[i] = ["Lantana Toll Plaza - $" + parseFloat(ticketToll_RI).toFixed(2), 88];
							myInlineTollPlazasCASH[i] = ["Lantana Toll Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
							i = i + 1;
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>24.401)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI	
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							// Toll on Sawgrass, direction South
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * 1).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * 1).toFixed(2), endExitMile];

							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           Sawgrass = 20.76/mainline = 24.401
							//           Bee Line = 4.45/Mainline = 208.302 
							mileage = Math.abs(24.401 - endExitMile) + Math.abs(4.45 - startExitMile) + (208.302-24.401)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts - Sawgrass End Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (startToll_RI + inlineToll_RI + transToll_RI) + (endToll_RI + + ticketToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_endToll_RI

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Sawgrass and HEFT
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Sawgrass and Heft
						if (startExitFacilityId == "SG" && endExitFacilityId == "H") { // From Sawgrass To Heft 
							
							i = 0;
							// Toll on Sawgrass, direction north
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							// NOTE ABOUT THE CALCULATEED START and tempMile
							// So that the sorting will work properly, I am manipulating the milepost stored in the arry.  
							// This # IS ONLY used to set the order for the route display
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * 1).toFixed(2), parseFloat(100 - startExitMile)];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * 1).toFixed(2) , parseFloat(100 - startExitMile)];
							i = i + 1;
							
							// Toll Plazas along mainline (Should only be Cypress at this time
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile<47.586)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with milepost for Cypress Creek Toll plaza so it shows up in correct order on the route
									if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=60;}
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}

							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with mileposts so that they display in the correct order on the route detail.
									//if (tempPlazaName=="Sunrise Toll Plaza") {tempMile=42;}
									//if (tempPlazaName=="Deerfield Toll Plaza") {tempMile=41;}
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2),  parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}
							// Toll on Heft, direction south
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along HEFT going south
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<47.586)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll			
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with milepost for Bird Rd Toll plazas so it shows up in correct order on the route
									if (tempPlazaName!="Bird Road North Toll Plaza") {
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
									}
								}
							}
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];

							// Mileage all facilities 
								mileage = Math.abs(20.76 - startExitMile) + Math.abs(47.856 - endExitMile) + 24.401
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)

							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (endToll_RI + inlineToll_RI) + startToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI) + CASH_startToll_RI
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							//document.getElementById("subMsgDIV").style.visibility = "visible";
						}
// ******************************************************************************************************************************************************************************************************************************
// HEFT and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
							if (startExitFacilityId == "H" && endExitFacilityId == "SG") { // From Heft to Sawgrass
							i = 0;
							// Toll on Heft, direction north
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							// NOTE ABOUT THE CALCULATEED START and tempMile
							// So that the sorting will work properly, I am manipulating the milepost stored in the arry.  
							// This # IS ONLY used to set the order for the route display
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;
							
							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<47.856)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with milepost for Bird Rd Toll plazas so it shows up in correct order on the route
									if (tempPlazaName!="Bird Road South Toll Plaza") {
										if(tempPlazaName == "Bird Road North Toll Plaza"){tempToll_RI=1.04; CASH_tempToll_RI=1.30;}
										//Override the actual mile post for Route sorting purposes
										if(tempPlazaName == "Homestead Extension (Miramar)"){tempMile=38;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							// Toll along mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile<47.586)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									//To deal with mileposts so that they display in the correct order on the route detail.
									if (tempPlazaName=="Cypress Creek Toll Plaza") {tempMile=60;}
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2),  parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}
							
							
							// Toll on Sawgrass, direction south
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}

							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * 1).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * 1).toFixed(2), endExitMile];
							// Mileage all facilities 
								mileage = Math.abs(20.76 - endExitMile) + Math.abs(47.856 - startExitMile) + 24.401
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							//totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							//CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (startToll_RI + inlineToll_RI) + endToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI) + CASH_endToll_RI

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							//document.getElementById("subMsgDIV").style.visibility = "visible";
						}
// ******************************************************************************************************************************************************************************************************************************
// MSPUR and HEFT
// ******************************************************************************************************************************************************************************************************************************
						// From Spur to HEFT
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "H") {
							i = 0;
							// Start at SPUR
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), parseFloat(100 - startExitMile)];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , parseFloat(100 - startExitMile)];
							i = i + 1;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}

							// Ending at Heft (Toll along HEFT)
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;

							// In-line toll plazas along HEFT going south
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<46.931)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									if (tempPlazaName != "Bird Road North Toll Plaza"){
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: HEFT=47.856/MSPUR = 3.342
								mileage = Math.abs(3.342 - startExitMile) + Math.abs(47.856 - endExitMile)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							//document.getElementById("subMsgDIV").style.visibility = "visible";
						}
						// From HEFT to Spur
						if (startExitFacilityId == "H" && endExitFacilityId == "MSPUR") {
							i = 0;
							// Start at HEFT (Toll along HEFT)
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;
							
							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<46.931)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For route detail
									if (tempPlazaName != "Bird Road South Toll Plaza"){
										if(tempPlazaName == "Bird Road North Toll Plaza"){tempToll_RI=1.04; CASH_tempToll_RI=1.30;}
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: HEFT=47.856/MSPUR = 3.342
							mileage = Math.abs(47.856 - startExitMile) + Math.abs(3.342 - endExitMile)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// MSPUR and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline Spur and Sawgrass Expressway
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "SG") {
							i = 0;
							// Start at SPUR
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
						
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;
						
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							// Toll along mainline
							// In-line toll plazas along mainline south of the intersection with Sawgrass Expressway 
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<24.401)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							// Toll on Sawgrass, direction south
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}

							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * 1).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * 1).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							//			 Mainline = 24.49 / Sawgrass = 20.76
							mileage = Math.abs(3.342 - startExitMile) + Math.abs(20.76 - endExitMile) + 24.49
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (startToll_RI + inlineToll_RI) + (endToll_RI + + ticketToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_endToll_RI

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "SG" && endExitFacilityId == "MSPUR") {
							i = 0;
							// Start at Sawgrass
							// Toll on Sawgrass, direction North
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							//July 2013 - Per Daniel Sawgrass exits charge a flat rate toll NOT PER AXLE
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * 1).toFixed(2), parseFloat(100 - startExitMile)];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * 1).toFixed(2) , parseFloat(100 - startExitMile)];
							i = i + 1;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), parseFloat(100 - tempMile)];
									i = i + 1;
								}
							}
							// Toll along mainline
							// In-line toll plazas along mainline south of the intersection with Sawgrass Expressway 
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<24.401)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];
							
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							//			 Mainline = 24.401 / Sawgrass = 20.76
							mileage = Math.abs(3.342 - endExitMile) + Math.abs(20.76 - startExitMile) + 24.401
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts - Sawgrass Start Exit does NOT get charged per axle
							totalToll_RI = axleFactor * (endToll_RI + inlineToll_RI) + (startToll_RI + + ticketToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket) + CASH_startToll_RI
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// MSPUR and Bee Line
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline Spur and Bee Line Expressway
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "B") {
							// Start at SPUR
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI

								}
							}
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI

								}
							}
							// Toll on Bee line
							// Ending exit data
							if (endExitMile<4.45) { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
							} else { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile>4.45)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI

									}
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							//			 Mainline = 208.302 / Bee Line = 4.445
							mileage = Math.abs(3.342 - startExitMile) + Math.abs(4.45 - endExitMile) + 208.302
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "B" && endExitFacilityId == "MSPUR") {
							// Toll on Bee line
							if (startExitMile<4.45) { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
							} else { // going east
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile>4.45)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							mileage = Math.abs(3.342 - endExitMile) + Math.abs(4.45 - startExitMile) + 208.302
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// MSPUR and Mainline
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline Spur and  Mainline
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "M") {
							i = 0;
							// Start at SPUR
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i = i + 1;

							// In-line toll plazas along MSPUR
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}

							// Ending at Mainline
							if (endExitMile < 42.188) { // Ends in South Coin System
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								//For RATE INDEXING
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								
								// In-line toll plazas along mainline south coin system
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile>0)&&(tempMile<endExitMile)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
							}
							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Ends in Ticket System
								// In-line toll plazas along mainline south coin system
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile>0)&&(tempMile<48.188)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
								ticketToll = calculateTicketToll("Lantana Plaza", endExitName);
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", endExitName);
								
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", endExitName);
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", endExitName);
								
								myInlineTollPlazas[i] = ["Lantana Plaza - $0.00" , 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $0.00" , 88];
								i = i + 1;

								myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((endToll_RI * axleFactor)+(ticketToll_RI)).toFixed(2), endExitMile];
								myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_endToll_RI * axleFactor)+(CASH_ticketToll_RI * axleFactorTicket)).toFixed(2), endExitMile];
									
							}
							if (endExitMile > 189.218) { // Ends in North Coin System
								ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
								
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");

								myInlineTollPlazas[i] = ["Lantana Plaza - $0.00" , 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $0.00" , 88];
								i = i + 1;
								//myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI* axleFactorTicket).toFixed(2) , 236];
								myInlineTollPlazas[i] = ["Three Lakes Plaza - $" + parseFloat(ticketToll_RI).toFixed(2) , 236];
								myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 236];
								i = i + 1;

								// Toll plazas along mainline south ticket system
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile>0)&&(tempMile<48.188)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
								// Toll plazas along mainline north ticket system
								for (var w=0;w<numTollPlazas.length;w++) {
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
									tempFacID = inLineTempID(w);
									if ((tempMile<endExitMile)&&(tempMile>189.218)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
										myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
										i = i + 1;
									}
								}
								endToll= endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								//For RATE INDEXING
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
							}

							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];

							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);

							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							//mileage = endExitMile + Math.abs(3.342 - startExitMile)
							mileage = Math.abs(endExitMile) + Math.abs(3.342 - startExitMile)
							//mileage = Math.abs(startExitMile) + Math.abs(3.342 - endExitMile)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Mainline and MSPUR
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline and Mainline Spur
						if (startExitFacilityId == "M" && endExitFacilityId == "MSPUR") {
							i = 0;
							startToll_RI = 0;
							CASH_startToll_RI = 0;
							ticketToll_RI = 0;
							CASH_ticketToll_RI = 0;
							endToll_RI = 0;
							CASH_endToll_RI = 0;
							ticketToll_RI = 0;
							CASH_ticketToll_RI = 0;
							// Start at Mainline
							if (startExitMile < 42.188) { // Starts at South Coin System
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								//For RATE INDEXING
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
							}
							if ((startExitMile > 42.188)&&(startExitMile < 189.218)) { // Starts at Ticket System
								ticketToll = calculateTicketToll(startExitName, "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Lantana Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI(startExitName, "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Lantana Plaza");
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $0.00", startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $0.00", startExitMile];
								i = i + 1;
								//myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI* axleFactorTicket).toFixed(2) , 88];
								myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2) , 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
								i = i + 1;
							}
							if (startExitMile > 189.218) { // Starts at North Coin System
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								//For RATE INDEXING
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								
								ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
								
								myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
								myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
								i = i + 1;
								myInlineTollPlazas[i] = ["Three Lakes Plaza - $0.00" , 236];
								myInlineTollPlazasCASH[i] = ["Three Lakes Plaza - $0.00" , 236];
								i = i + 1;
								//myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI* axleFactorTicket).toFixed(2) , 88];
								myInlineTollPlazas[i] = ["Lantana Plaza - $" + parseFloat(ticketToll_RI).toFixed(2) , 88];
								myInlineTollPlazasCASH[i] = ["Lantana Plaza - $" + parseFloat(CASH_ticketToll_RI * axleFactorTicket).toFixed(2), 88];
								i = i + 1;
							}
							// Toll plazas along mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((tempMile<startExitMile)&&(tempMile>0)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2), endExitMile];

							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							mileage = Math.abs(startExitMile) + Math.abs(3.342 - endExitMile)
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Suncoast and Veterans
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Suncoast and Veterans
						if (startExitFacilityId == "SC" && endExitFacilityId == "V") {
							// Mile and toll on Veterans, direction south
							startToll = startExitSouthOn;
							CASH_startToll = CASH_startExitSouthOn;
							//For RATE INDEXING
							startToll_RI = startExitSouthOn_RI;
							CASH_startToll_RI = CASH_startExitSouthOn_RI;
							var i = 0;
							myInlineTollPlazas = [];
							myInlineTollPlazasCASH = [];
							ticketToll_RI = 0;
							CASH_ticketToll_RI = 0;
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i=i+1;
							//clearRouteArrays();
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								tempPlazaName = inLineTempPlaza(w);
								if ((startExitMile>tempMile)&&(tempMile>12.268)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}

							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							
							// Mile and toll on Suncoast, Direction south
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
						        tempMile = inLineMilePT(w);
						        tempToll = inLineTempToll(w); // Transponder payments
						        CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
						        tempFacID = inLineTempID(w);
								tempPlazaName = inLineTempPlaza(w);
								if ((endExitMile<tempMile)&&(tempMile<12.268)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor ).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor ).toFixed(2), endExitMile];
							
							myInlineTollPlazas.sort(sortSouthBound);
							myInlineTollPlazasCASH.sort(sortSouthBound);
							
							// Mileage all facilities 
							mileage = Math.abs(12.268 - endExitMile) + Math.abs(12.268 - startExitMile)
							
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								//myInlineTollPlazas.length = 0;
								//myInlineTollPlazasCASH.length = 0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "V" && endExitFacilityId == "SC") {
							// Mile and toll on Suncoast, direction north
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							var i = 0;
							myInlineTollPlazas = [];
							myInlineTollPlazasCASH = [];
							ticketToll_RI = 0;
							CASH_ticketToll_RI = 0;
							myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2), startExitMile];
							myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
							i=i+1;
							//Clear Out Arrays???
							//clearRouteArrays();
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								tempPlazaName = inLineTempPlaza(w);
								if ((startExitMile<tempMile)&&(tempMile<12.268)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							
							// Mile and toll on Veterans, Direction north
							endToll = endExitNorthOff;
							CASH_endToll = CASH_endExitNorthOff;
							//For RATE INDEXING
							endToll_RI = endExitNorthOff_RI;
							CASH_endToll_RI = CASH_endExitNorthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
						        tempMile = inLineMilePT(w);
						        tempToll = inLineTempToll(w); // Transponder payments
						        CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
						        tempFacID = inLineTempID(w);
								tempPlazaName = inLineTempPlaza(w);
								if ((endExitMile>tempMile)&&(tempMile>12.268)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll_RI * axleFactor).toFixed(2), tempMile];
									myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll_RI * axleFactor).toFixed(2), tempMile];
									i = i + 1;
								}
							}
							
							myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor ).toFixed(2), endExitMile];
							myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor ).toFixed(2), endExitMile];
							
							myInlineTollPlazas.sort(sortNorthBound);
							myInlineTollPlazasCASH.sort(sortNorthBound);
							
							// Mileage all facilities 
							mileage = Math.abs(12.268 - endExitMile) + Math.abs(12.268 - startExitMile)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							
							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
					}
				}

// ******************************************************************************************************************************************************************************************************************************
// Bee Line To/From Western Beltway
// ******************************************************************************************************************************************************************************************************************************
						//************************* From Bee Line to Western Beltway
						if (startExitFacilityId == "B" && endExitFacilityId == "WB") { 
							// Toll along mainline
						    for (var w=0;w<numTollPlazas.length;w++) { 
							    tempMile = inLineMilePT(w);
							    tempToll = inLineTempToll(w); // Transponder payments
							    CASH_tempToll = inLineTempCashToll(w);// Cash payments
							    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
							    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
							    tempFacID = inLineTempID(w);
							}
						
							// Toll on Bee line
							if (startExitMile<4.45) { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
							} else { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;

								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								    tempFacID = inLineTempID(w);
									
									if ((tempMile<startExitMile)&&(tempMile>4.45)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							
							// add toll rate for the interchange on the Bee Line going North on the Mainline
							inlineToll = inlineToll + parseFloat(.50) //SunPass rate
							CASH_inlineToll = CASH_inlineToll + parseFloat(.75) //Cash rate
							//For Inline Toll RATE INDEXED
							inlineToll_RI = inlineToll_RI + parseFloat(.50) //SunPass rate
							CASH_inlineToll_RI = CASH_inlineToll_RI + parseFloat(.75) //Cash rate
										
						var wbDir;
						// Toll on Western Beltway, direction South
							if(endExitMile > 19.440){
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								wbDir = "North";
							}
							else{
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
								wbDir = "South";
							}

							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if(wbDir=='South'){
									// In-line toll plazas along Western Beltway going south
									if ((endExitMile<tempMile)&&(tempMile!='27')&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempTol;
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB= inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB	
									}
								}
								else if(wbDir=='North'){
									if ((endExitMile>tempMile)&&(tempMile=='27')&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll	
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB= inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB	
									}

								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302;Bee Line=4.45; Western Beltway=22.4
							// Miles from Western Beltway interchange to Bee Line interchange = 12.38

								mileage = Math.abs(22.4 - endExitMile) + Math.abs(4.45 - startExitMile) + (12.38)
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI);
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI);
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = (axleFactor * (startToll_RI + inlineToll_RI)) + (endToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = (axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						
						var fnd;
						var s_direction;
						fnd = false;
							if (startExitFacilityId == "WB" && startExitMile <= 19.440) { //start traveling north on Western Beltway (429)
								s_direction = "NORT";
								startToll = startExitNorthOn;
								CASH_startToll = CASH_startExitNorthOn;
								//For RATE INDEXING
								startToll_RI = startExitNorthOn_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;
								fnd = true;
							} else if (startExitFacilityId == "WB" && startExitMile > 19.440) { //start traveling south on Western Beltway (429)
								s_direction = "SOUT";						
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								//For RATE INDEXING
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								fnd = true;
							}
						if (fnd){
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								//get the mainline toll for the Western Beltway
								if ((s_direction == "NORT")&&(startExitFacilityId==tempFacID)){
									 //going to Bee Line from the Western Beltway Northbound
									 if ((startExitMile<=tempMile) && (tempMile!='27')){
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
								
								// ******************************************************************************************
								// As of 6.20.2006 the calculator does not calculate traffic from the Western Beltway southbound
								// south of the Turnpike to other facilities because non-toll facilities are not used in the calculation of miles.
								// The only way this program is used is assuming the traveler is on toll roads only.
								// L Barber 6.20.2006
								// *******************************************************************************************
								else if ((s_direction == "SOUT")&&(startExitFacilityId==tempFacID)){
									if((startExitMile>tempMile) && (tempMile=='27')){
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							
							var newToll_SP = beeLine(startExitFacilityId,inlineToll,CASH_inlineToll,'0');
							var newToll_CA = beeLine(startExitFacilityId,inlineToll,CASH_inlineToll,'1');
							inlineToll = newToll_SP;
							CASH_inlineToll = newToll_CA;
							//For Inline Toll RATE INDEXED
							var newToll_SP_RI = beeLine_RI(startExitFacilityId,inlineToll,CASH_inlineToll,'0');
							var newToll_CA_RI = beeLine_RI(startExitFacilityId,inlineToll,CASH_inlineToll,'1');
							inlineToll_RI = newToll_SP_RI;
							CASH_inlineToll_RI = newToll_CA_RI;

							if(fnd && endExitFacilityId == "B"){
								// Mileage all facilities 
								mileage = Math.abs(4.45 - endExitMile) + Math.abs(22.4 - startExitMile) + (12.38)
								
								// Calculate Toll
								totalToll = axleFactor * (startToll + endToll + inlineToll)
								CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
								//Calculate New RATE INDEXED Amounts
								totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
								CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)

								formatMile.setNumber(Math.abs(mileage));
								formatMile.setCurrency(false);
								formatTotalToll.setNumber(totalToll);
								formatCASHTotalToll.setNumber(CASH_totalToll);
								
								//Added for Rate Indexing
								formatTotalToll_RI.setNumber(totalToll_RI);
								formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

								if (totalToll_RI > 900) {
									//alert("Invalid movement. Please Try Again");
									clearRouteArrays();
									myTollAmounts[0]=0;
									myTollAmounts[1]=0;
									myTollAmounts[2]=0;
									return (myTollAmounts);
									//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
								} else {
									myTollAmounts[0]=formatTotalToll_RI;
									myTollAmounts[1]=formatCASHTotalToll_RI;
									// Include milage in arry to send back to map page
									myTollAmounts[2]=formatMile;
									return (myTollAmounts);
								}
								//document.getElementById("messageDIV").innerHTML=outputText
							}//end start and end facility check
						}
// ******************************************************************************************************************************************************************************************************************************
// Mainline and Western Beltway
// ******************************************************************************************************************************************************************************************************************************
						//************************ From Mainline to Western Beltway *********************************************************
						if (startExitFacilityId == "M" && endExitFacilityId == "WB") {
							// Starting exit data
							if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
								ticketToll = calculateTicketToll(startExitName, "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Three Lakes Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI(startExitName, "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Three Lakes Plaza");
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
								    if ((189.218<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								    }
								}
							} else { 
								if (startExitMile > 189.218) {  // Starting Exit is in North Coin System

									if (startExitMile>221.108) { // North of Intersection with Western Beltway
										startToll = startExitSouthOn;
										CASH_startToll = CASH_startExitSouthOn;
										startToll_RI = startExitSouthOn_RI;
										CASH_startToll_RI = CASH_startExitSouthOn_RI;
									} else {		// South of Intersection with Bee Line
										startToll = startExitNorthOn;
										CASH_startToll = CASH_startExitNorthOn;
										startToll_RI = startExitNorthOn_RI;
										CASH_startToll_RI = CASH_startExitNorthOn_RI;
									}
									
									for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										tempFacID = inLineTempID(w);
									
										if (startExitMile>208.302) {
											if ((startExitMile>tempMile)&&(tempMile>208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
												CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
											}
										} else {
											if ((startExitMile<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll				
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For Inline Toll RATE INDEXED Western Beltway
												inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
												CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
											}
										}
									}
								}
								if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
									startToll = startExitNorthOn;
									CASH_startToll = CASH_startExitNorthOn;
									//For RATE INDEXING
									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;

									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										tempFacID = inLineTempID(w);
										
										if ((startExitMile<tempMile)&&(tempMile<42.188)&&(startExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For Inline Toll RATE INDEXED Western Beltway
											inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
											CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
										}
									}
									
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
									//For RATE INDEXING
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
								}
							}
							// Ending exit data
							if (endExitMile<=19.440) { // going south
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
								e_direction = "South";

							} else { // going north
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								e_direction = "North";
							}
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((e_direction=="South") && (endExitMile<tempMile)&&(tempMile!='27')&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll		
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
								else if ((e_direction=="North") && (endExitMile>tempMile)&&(tempMile=='27')&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll		
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll			
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
								
							}
							
							// Mileage both facilities 
							// equation: mainline=261.701;Western Beltway=22.4
							// Miles from Western Beltway interchange to beginning of mainline = 221.108
							mileage = Math.abs(221.108 - startExitMile) + Math.abs(22.4 - endExitMile)						
								
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll + transToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll + CASH_transToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (startToll_RI + inlineToll_RI) + transToll_RI) + (ticketToll_RI)) + (endToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI) + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						//***************** From Western Beltway to Mainline ******************************************
  						if (startExitFacilityId == "WB" && endExitFacilityId == "M") {
							
							//reset inline toll rates to zero
							inlineToll = 0;
							CASH_inlineToll = 0;
						
							//For Inline Toll RATE INDEXED
							inlineToll_RI = 0;
							CASH_inlineToll_RI = 0;
							
							//For Inline Toll RATE INDEXED Western Beltway
							inlineToll_RI_WB = 0;
							CASH_inlineToll_RI_WB = 0;
							
							// Starting exit data
							if (startExitMile<= 19.440) { // going north
								startToll = startExitNorthOn;
								CASH_startToll= CASH_startExitNorthOn;
								startToll_RI = startExitNorthOn_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;
								s_direction="North";
							} else { // going south
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								s_direction="South";
							}
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
									if ((s_direction=="South") && (tempMile=='27') && (startExitMile>=27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
									else if ((s_direction=="North") && (startExitMile<tempMile)&& (tempMile!=27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}

							// Ending exit data
							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Ending exit is in ticket system
								ticketToll = calculateTicketToll("Three Lakes Plaza", endExitName);
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", endExitName);
								
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", endExitName);
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", endExitName);
								
								endToll = 0;
								CASH_endToll = 0;
								//For RATE INDEXING
								endToll_RI = 0;
								CASH_endToll_RI = 0;
							} else { 
								if (endExitMile > 189.218) {  // Ending Exit is in North Coin System
									if (endExitMile > 221.108) { // North of intersection with Western Beltway
										endToll = endExitNorthOff;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										endToll_RI = endExitNorthOff_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
										
										for (var w=0;w<numTollPlazas.length;w++) { 
										    tempMile = inLineMilePT(w);
										    tempToll = inLineTempToll(w); // Transponder payments
										    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								        	tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								        	CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
											CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										    tempFacID = inLineTempID(w);
											
										    if ((endExitMile>tempMile)&&(tempMile>221.108)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For Inline Toll RATE INDEXED Western Beltway
											inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
											CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
										    }
										}
									} else { // South of intersection with Western Beltway
										endToll = endExitSouthOff;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										endToll_RI = endExitSouthOff_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
										
										for (var w=0;w<numTollPlazas.length;w++) { 
										    tempMile = inLineMilePT(w);
										    tempToll = inLineTempToll(w); // Transponder payments
										    CASH_tempToll = inLineTempCashToll(w);// Cash payments
										    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
											tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
											CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										    tempFacID = inLineTempID(w);
											
											if ((endExitMile<tempMile)&&(tempMile<221.108)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
												//For Inline Toll RATE INDEXED Western Beltway
												inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
												CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
											}
										}
									}
								
								}
								if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
									endToll = endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;
									ticketToll = calculateTicketToll("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza" , "Lantana Plaza");
									
									//For RATE INDEXING
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza" , "Lantana Plaza");
									
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										tempFacID = inLineTempID(w);
										
										if ((endExitMile<tempMile)&&(tempMile<42.188)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											//For Inline Toll RATE INDEXED Western Beltway
											inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
											CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
										}
									}
								}
							}
							// Mileage both facilities 
							// equation: mainline=261.701;Western Beltway=22.4
							// Miles from Western Beltway interchange to beginning of mainline = 221.108
							mileage = Math.abs(221.108 - endExitMile) + Math.abs(22.4 - startExitMile)
							
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (endToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (StartToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_startToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);

							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
// ******************************************************************************************************************************************************************************************************************************
// Western Beltway and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
						//************ From Western Beltway to Sawgrass *************************************************************
						if (startExitFacilityId == "WB" && endExitFacilityId == "SG") { 
							
							inlineToll = 0;
							CASH_inlineToll = 0;
							// get the toll for traveling through the Ticket System's mainline plaza's
							ticketToll = calculateTicketToll("Three Lakes Plaza" , "Lantana Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza" , "Lantana Plaza");
							// Toll on Sawgrass, direction north
							endToll= endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							
							//For Inline Toll RATE INDEXED
							inlineToll_RI = 0;
							CASH_inlineToll_RI = 0;
							//For Inline Toll RATE INDEXED Western Beltway rules
							inlineToll_RI_WB = 0;
							CASH_inlineToll_RI_WB = 0;
							
							ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza" , "Lantana Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza" , "Lantana Plaza");
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);

								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway Rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}

							// Toll on Western Beltway
							if(startExitMile <= 19.440){
								s_direction = "North";
								startToll = startExitNorthOn;
								CASH_startToll = CASH_startExitNorthOn;
								startToll_RI = startExitNorthOn_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;
							} else {
								s_direction = "South";
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
							}
								
							// In-line toll plazas along Western Beltway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((s_direction=="North" )&&(startExitMile<tempMile)&&(tempMile!='27')&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway Rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
								else if ((s_direction=="South" )&&(startExitMile>tempMile)&&(tempMile=='27')&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway Rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}

							// Mileage all facilities 
							mileage = Math.abs(20.760 - endExitMile) + Math.abs(22.4 - startExitMile) + 200.348 //mainline miles
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (endToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (startToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_startToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						// ************* From Sawgrass to Western Beltway *******************************************************************
							if (startExitFacilityId == "SG" && endExitFacilityId == "WB") {
							
							inlineToll = 0;
							CASH_inlineToll = 0;
							// get the toll for traveling through the Ticket System's mainline plaza's
							ticketToll = calculateTicketToll("Three Lakes Plaza" , "Lantana Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza" , "Lantana Plaza");
							// Toll on Sawgrass, direction south
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;

							//For RATE INDEXING
							inlineToll_RI = 0;
							CASH_inlineToll_RI = 0;
							//For RATE INDEXING Western Beltway rules
							inlineToll_RI_WB = 0;
							CASH_inlineToll_RI_WB = 0;
							// get the toll for traveling through the Ticket System's mainline plaza's
							ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza" , "Lantana Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza" , "Lantana Plaza");
							// Toll on Sawgrass, direction south
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}

							// Toll on Western Beltway
							if(endExitMile <= 19.440){
								e_direction = "South";
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
							} else {
								e_direction = "North";
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
							}

							// In-line toll plazas along Western Beltway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((e_direction=="North" )&&(endExitMile>tempMile)&&(tempMile=='27')&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
								else if ((e_direction=="South" )&&(endExitMile<tempMile)&&(tempMile!='27')&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
								
							}
							// Mileage all facilities 
							mileage = Math.abs(20.760 - startExitMile) + Math.abs(22.4 - endExitMile) + 200.348 //mainline miles
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (startToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (endToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						// ********* end Sawgrass/Western Beltway ********************************************************************************************************
// ******************************************************************************************************************************************************************************************************************************
// MSPUR and Western Beltway
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline Spur and Bee Line Expressway
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "WB") {
							// Start at SPUR
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;

							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
									
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((tempMile>0)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							
							// Toll on Western Beltway
							// Ending exit data
							if (endExitMile<=19.440) { // going south
								e_direction = "South";
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								//For RATE INDEXING
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
							} else { // going east
								e_direction= "North";
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								//For RATE INDEXING
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
									if ((e_direction=="North") && (endExitMile>tempMile)&&(tempMile==27)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
									else if ((e_direction=="South") && (endExitMile<tempMile)&&(tempMile!=27)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342
							//			 Mainline = 261.701
							//			 Western Beltway = 22.4
							//			 Miles from Western Beltway interchange to end of SPUR = 217.766
							
							mileage = Math.abs(3.342 - startExitMile) + Math.abs(22.4 - endExitMile) + 217.766
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (startToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (endToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "WB" && endExitFacilityId == "MSPUR") {
							// reset inline tolls	
							inlineToll = 0;
							CASH_inlineToll = 0;
							//For Inline Toll RATE INDEXED
							inlineToll_RI = 0;
							CASH_inlineToll_RI = 0;
							//For Inline Toll RATE INDEXED Western Beltway rules
							inlineToll_RI_WB = 0;
							CASH_inlineToll_RI_WB = 0;
							
							// Toll on Western Beltway
							if (startExitMile<=19.440) { // going north
								s_direction = "North";
								startToll = startExitNorthOn;
								CASH_startToll = CASH_startExitNorthOn;
								//For RATE INDEXING
								startToll_RI = startExitNorthOn_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;
							} else { // going south
								s_direction = "South";
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								//For RATE INDEXING
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
									if ((s_direction=="North") && (tempMile<startExitMile)&&(tempMile!=27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB

									}
									else if ((s_direction=="South") && (tempMile<startExitMile)&&(tempMile==27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((tempMile>0)&&(tempMile<208.302)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);

								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342; mainline miles from Western Beltway to SPUR = 217.766; Western Beltway = 22.4
							
							mileage = Math.abs(3.342 - endExitMile) + Math.abs(22.4 - startExitMile) + 217.766
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (endToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (startToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_startToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}

// ******************************************************************************************************************************************************************************************************************************
// Western Beltway and HEFT
// ******************************************************************************************************************************************************************************************************************************
						 
						 //******************** From Western Beltway to Heft *****************************************************************
						 if (startExitFacilityId == "WB" && endExitFacilityId == "H") {
								// reset inline toll rates
								inlineToll = 0;	
								CASH_inlineToll = 0;
								// Toll along mainline
								ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
								
								//For RATE INDEXING
								inlineToll_RI = 0;
								CASH_inlineToll_RI = 0;
								//For RATE INDEXING Western Beltway rules
								inlineToll_RI_WB = 0;
								CASH_inlineToll_RI_WB = 0;
								
								// Toll along mainline
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
									if ((tempMile<220.821)&&(tempMile>0)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
								
								// Toll on Western Beltway
								if (startExitMile<=19.440) { // going north
									s_direction = "North";
									startToll = startExitNorthOn;
									CASH_startToll = CASH_startExitNorthOn;
									//For RATE INDEXING
									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;
								} else { // going south
									s_direction = "South";
									startToll = startExitSouthOn;
									CASH_startToll = CASH_startExitSouthOn;
									//For RATE INDEXING
									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
										tempFacID = inLineTempID(w);
									
									if ((s_direction=="South") && (tempMile<startExitMile)&&(tempMile==27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
									else if ((s_direction=="North") && (tempMile<startExitMile)&&(tempMile!=27)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							
							// Toll on Heft, direction South
							endToll= endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along HEFT going south
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);

								if ((endExitMile<tempMile)&&(tempMile<47.586)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}

							// Mileage	 equation: mainline=261.701
							//           HEFT = 47.493
							//           Western Beltway = 22.4
							//			 From mainline (I-75) to Western Beltway interchange = 261.701 - 221.108 = 40.593
							//			 Mainline miles from Western Beltway to HEFT/Turnpike interchange = 221.108
							
							mileage = Math.abs(47.493 - endExitMile) + Math.abs(22.4 - startExitMile) + (221.108)
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (endToll_RI + inlineToll_RI)) + (ticketToll_RI)) + (startToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_startToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);
							
							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							//document.getElementById("subMsgDIV").style.visibility = "visible";
						}
						//************************** From Heft to Western Beltway ******************************************************
						if (startExitFacilityId == "H" && endExitFacilityId == "WB") { 
							// Mile and toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((tempMile<220.821)&&(tempMile>0)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							//Ending exit Toll on Western Beltway
							if (endExitMile<=19.440) { // going south
								e_direction = "South";
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								//For RATE INDEXING
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
							} else { // going north
								e_direction = "North";
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								//For RATE INDEXING
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								    tempFacID = inLineTempID(w);
									
									if ((e_direction=="South")&&(endExitMile<tempMile)&&(tempMile!=27)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
									else if ((e_direction=="North")&&(endExitMile>tempMile)&&(tempMile==27)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway rules
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							
							// Toll on Heft, direction North
							startToll= startExitNorthOn;
							CASH_startToll= CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;

							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments Westernbeltway
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments Westernbeltway
								tempFacID = inLineTempID(w);
								
								if ((startExitMile<tempMile)&&(tempMile<47.856)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									//For Inline Toll RATE INDEXED Western Beltway rules
									inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
									CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
								}
							}
							// Mileage both facilities 
							// equation: mainline=261.701
							//           HEFT = 47.493
							//           Western Beltway = 22.4 
							//			 From mainline (I-75) to Western Beltway interchange = 261.701 - 221.108 = 40.593
							//			 Mainline miles from Western Beltway to HEFT/Turnpike interchange = 221.108
							mileage = Math.abs(47.493 - startExitMile) + Math.abs(22.4 - endExitMile) + (221.108)
							// Calculate Toll
							//totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							//CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							//totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI) + (ticketToll)
							//CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts Including the WesternBeltway rules
							totalToll_RI = ((axleFactor * (startToll_RI + inlineToll_RI))  + + ticketToll_RI) + (endToll_RI + inlineToll_RI_WB);
							CASH_totalToll_RI = ((axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI)) + (CASH_ticketToll_RI * axleFactorTicket)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB);
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}

	//document.getElementById("printButton").style.visibility = "visible";

// ******************************************************************************************************************************************************************************************************************************
// Mainline and 408
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline and East West
						if (startExitFacilityId == "M" && endExitFacilityId == "EW") {  // From Mainline to 408
							// Starting exit data
							if ((startExitMile > 42.188)&&(startExitMile <189.218)) { // Starting exit is in ticket system
								ticketToll = calculateTicketToll(startExitName, "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH(startExitName, "Three Lakes Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI(startExitName, "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI(startExitName, "Three Lakes Plaza");
									
								for (var w=0;w<numTollPlazas.length;w++) { 
								    tempMile = inLineMilePT(w);
								    tempToll = inLineTempToll(w); // Transponder payments
								    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								    tempFacID = inLineTempID(w);
									if ((189.218<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { 
								if (startExitMile > 189.218) {  // Starting Exit is in North Coin System
									
									startToll = startExitSouthOn;
									CASH_startToll = CASH_startExitSouthOn;
									//For RATE INDEXING
									startToll_RI = startExitSouthOn_RI;
									CASH_startToll_RI = CASH_startExitSouthOn_RI;
								
									for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempFacID = inLineTempID(w);
										if (startExitMile>208.302) {
											if ((startExitMile>tempMile)&&(tempMile>208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											}
										} else {
											if ((startExitMile<tempMile)&&(tempMile<208.302)&&(startExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											}
										}
									}
								}
								if (startExitMile < 42.188) {  // Starting Exit is in South Coin System
									startToll = startExitNorthOn;
									CASH_startToll = CASH_startExitNorthOn;
									//For RATE INDEXING
									startToll_RI = startExitNorthOn_RI;
									CASH_startToll_RI = CASH_startExitNorthOn_RI;
									
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempFacID = inLineTempID(w);
										if ((startExitMile<tempMile)&&(tempMile<42.188)&&(startExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										}
									}
									ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
									//For RATE INDEXING
									ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
								}
							}
							// Ending exit data
							if (endExitMile<=9.68) { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll		
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile>=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll		
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
								mileage = Math.abs(startExitMile - 218.92) + Math.abs(endExitMile)
																			
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll + transToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll + CASH_transToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "EW" && endExitFacilityId == "M") {  // From East West to Mainline
							// Starting exit data
							if (startExitMile<=9.68) { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((startExitMile>tempMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((startExitMile>tempMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Ending exit data

							if ((endExitMile > 42.188)&&(endExitMile < 189.218)) { // Ending exit is in ticket system

								ticketToll = calculateTicketToll("Three Lakes Plaza", endExitName);
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", endExitName);
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", endExitName);
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", endExitName);
								
							} else { 

								if (endExitMile > 189.218) {  // Ending Exit is in North Coin System

									if (endExitMile > 218.92) { // North of intersection with East West Expressway
										endToll = endExitNorthOff;
										CASH_endToll = CASH_endExitNorthOff;
										//For RATE INDEXING
										endToll_RI = endExitNorthOff_RI;
										CASH_endToll_RI = CASH_endExitNorthOff_RI;
										
										for (var w=0;w<numTollPlazas.length;w++) { 
										    tempMile = inLineMilePT(w);
										    tempToll = inLineTempToll(w); // Transponder payments
										    CASH_tempToll = inLineTempCashToll(w);// Cash payments
										    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										    tempFacID = inLineTempID(w);
											
											if ((endExitMile>tempMile)&&(tempMile>218.92)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											}
										}
									} else { // South of intersection with East West Expressway
										endToll = endExitSouthOff;
										CASH_endToll = CASH_endExitSouthOff;
										//For RATE INDEXING
										endToll_RI = endExitSouthOff_RI;
										CASH_endToll_RI = CASH_endExitSouthOff_RI;
								
										for (var w=0;w<numTollPlazas.length;w++) { 
										    tempMile = inLineMilePT(w);
										    tempToll = inLineTempToll(w); // Transponder payments
										    CASH_tempToll = inLineTempCashToll(w);// Cash payments
								        	    tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								        	    CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										    tempFacID = inLineTempID(w);
											
											if ((endExitMile<tempMile)&&(tempMile<218.92)&&(endExitFacilityId==tempFacID)) {
												inlineToll = inlineToll + tempToll	
												CASH_inlineToll = CASH_inlineToll + CASH_tempToll
												//For Inline Toll RATE INDEXED
												inlineToll_RI = inlineToll_RI + tempToll_RI
												CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
											}
										}
									}
							}

								if (endExitMile < 42.188) {  // Ending Exit is in South Coin System
									endToll = endExitSouthOff;
									CASH_endToll = CASH_endExitSouthOff;
									ticketToll = calculateTicketToll("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza" , "Lantana Plaza");
									
									//For RATE INDEXING
									endToll_RI = endExitSouthOff_RI;
									CASH_endToll_RI = CASH_endExitSouthOff_RI;
									ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza" , "Lantana Plaza");
									CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza" , "Lantana Plaza");
									
									for (var w=0;w<numTollPlazas.length;w++) { 
										tempMile = inLineMilePT(w);
										tempToll = inLineTempToll(w); // Transponder payments
										CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempFacID = inLineTempID(w);
										if ((endExitMile<tempMile)&&(tempMile<42.188)&&(endExitFacilityId==tempFacID)) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										}
									}
								}
							
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
								mileage = Math.abs(218.92 - endExitMile) + Math.abs(startExitMile)

							// Toll paid when getting off of East West Expwy and onto mainline
								if (startExitMile > 218.92) { // start exit is North of intersection with East West Expwy, thus direction is south
									transToll = beeLineTrans_SP(BeeLineMainlineExit);
									CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
									transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
									CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
									//Route Detail Info
								} else { // Start exit is south of East West Expwy thus direction is north
									transToll = beeLineTrans_SP(BeeLineMainlineExit);
									CASH_transToll = beeLineTrans_CA(BeeLineMainlineExit);
									transToll_RI = beeLineTrans_SP_RI(BeeLineMainlineExit);
									CASH_transToll_RI = beeLineTrans_CA_RI(BeeLineMainlineExit);
									//Route Detail Info
								}
							}

							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll + transToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll + CASH_transToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI + transToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI + CASH_transToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}

// ******************************************************************************************************************************************************************************************************************************
// 408 and HEFT
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on 408 and Heft
						if (startExitFacilityId == "EW" && endExitFacilityId == "H") { // From Bee Line to Heft
							// Toll along mainline
								ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
										if ((tempMile<218.92)&&(tempMile>0)&&(tempFacID=="M")) {
											inlineToll = inlineToll + tempToll	
											CASH_inlineToll = CASH_inlineToll + CASH_tempToll
											//For Inline Toll RATE INDEXED
											inlineToll_RI = inlineToll_RI + tempToll_RI
											CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										}
								}
						// Toll on 408
							if (startExitMile<=9.68) { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
						// Toll on Heft, direction South
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
							
							// In-line toll plazas along HEFT going south
							for (var w=0;w<numTollPlazas.length;w++) { 
				                tempMile = inLineMilePT(w);
				                tempToll = inLineTempToll(w); // Transponder payments
				                CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
				                tempFacID = inLineTempID(w);

								if ((endExitMile<tempMile)&&(tempMile<47.586)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           HEFT = 47.856/mainline = 0
							//           Bee Line = 4.45/Mainline = 208.302 
								mileage = Math.abs(47.856 - endExitMile) + Math.abs(startExitMile) + (218.92)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							}
						if (startExitFacilityId == "H" && endExitFacilityId == "EW") { // From HEFT to 408
							// Mile and toll along mainline
								ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<218.92)&&(tempMile>0)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}

							// Toll on 408
							// Ending exit data
							if (endExitMile<=9.68) { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							
							// Toll on Heft, direction North
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
							
							// In-line toll plazas along HEFT going north
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<47.856)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI;
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           HEFT = 47.856/mainline = 0
							//           Bee Line = 4.45/Mainline = 208.302 
								mileage = Math.abs(47.856 - startExitMile) + Math.abs(endExitMile) + (218.92)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}			
// ******************************************************************************************************************************************************************************************************************************
// 408 and Sawgrass
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on 408 and Sawgrass
						if (startExitFacilityId == "SG" && endExitFacilityId == "EW") { // From Sawgrass to 408
							// Toll along mainline
								ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
								
								// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
								// South of the intersection with Bee Line Expressway
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile>24.401)&&(tempMile<218.92)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							// Toll on Sawgrass, direction North
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;

							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);

								if ((startExitMile<tempMile)&&(tempMile<20.76)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Toll on 408
							// Ending exit data
							if (endExitMile<=9.68) { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           Sawgrass = 20.76/mainline = 24.401
							//           Bee Line = 4.45/Mainline = 208.302 
								mileage = Math.abs(20.76 - startExitMile) + Math.abs(endExitMile) + (218.92-24.401)
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "EW" && endExitFacilityId == "SG") { // From 408 to Sawgrass
							// Toll along mainline
								ticketToll = calculateTicketToll("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll = calculateTicketToll_CASH("Three Lakes Plaza", "Lantana Plaza");
								//For RATE INDEXING
								ticketToll_RI = calculateTicketToll_RI("Three Lakes Plaza", "Lantana Plaza");
								CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Three Lakes Plaza", "Lantana Plaza");
								
								// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
								// South of the intersection with Bee Line Expressway
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile>24.401)&&(tempMile<218.92)&&(tempFacID=="M")) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							// Toll on Bee line
							if (startExitMile<=9.68) { // going west
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Toll on Sawgrass, direction South
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
								
							// In-line toll plazas along Sawgrass south of the intersection with Mainline
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<20.76)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302/Bee Line=4.45
							//           Sawgrass = 20.76/mainline = 24.401
							//           Bee Line = 4.45/Mainline = 208.302 
								mileage = Math.abs(20.76 - endExitMile) + Math.abs(startExitMile) + (218.92-24.401)
							// Calculate Toll
							totalToll= axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll= axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}	

// ******************************************************************************************************************************************************************************************************************************
// MSPUR and 408
// ******************************************************************************************************************************************************************************************************************************
						// User selects exits on Mainline Spur and East West Expressway
						if (startExitFacilityId == "MSPUR" && endExitFacilityId == "EW") {
							// Start at SPUR
							startToll = startExitNorthOn;
							CASH_startToll = CASH_startExitNorthOn;
							//For RATE INDEXING
							startToll_RI = startExitNorthOn_RI;
							CASH_startToll_RI = CASH_startExitNorthOn_RI;
								
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((startExitMile<tempMile)&&(tempMile<3.342)&&(startExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<218.92)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Toll on 408
							// Ending exit data
							if (endExitMile<=9.68) { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going west
								endToll = endExitWestOff;
								CASH_endToll = CASH_endExitWestOff;
								//For RATE INDEXING
								endToll_RI = endExitWestOff_RI;
								CASH_endToll_RI = CASH_endExitWestOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((endExitMile>tempMile)&&(tempMile<=9.68)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							//			 Mainline = 208.302 / Bee Line = 4.445
								mileage = Math.abs(3.342 - startExitMile) + Math.abs(endExitMile) + 218.92
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						if (startExitFacilityId == "EW" && endExitFacilityId == "MSPUR") {
							// Toll on 408
							if (startExitMile<=9.98) { // going West
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							} else { // going east
								startToll = startExitEastOn;
								CASH_startToll = CASH_startExitEastOn;
								//For RATE INDEXING
								startToll_RI = startExitEastOn_RI;
								CASH_startToll_RI = CASH_startExitEastOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=9.68)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
									}
								}
							}
							// Toll along mainline
							ticketToll = calculateTicketToll("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll = calculateTicketToll_CASH("Lantana Plaza", "Three Lakes Plaza");
							//For RATE INDEXING
							ticketToll_RI = calculateTicketToll_RI("Lantana Plaza", "Three Lakes Plaza");
							CASH_ticketToll_RI = calculateTicketToll_CASH_RI("Lantana Plaza", "Three Lakes Plaza");
							
							// In-line toll plazas along mainline north of the intersection with Sawgrass Expressway and
							// South of the intersection with Bee Line Expressway
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((tempMile>0)&&(tempMile<218.92)&&(tempFacID=="M")) {
									inlineToll = inlineToll + tempToll
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Ending at SPUR
							endToll = endExitSouthOff;
							CASH_endToll = CASH_endExitSouthOff;
							//For RATE INDEXING
							endToll_RI = endExitSouthOff_RI;
							CASH_endToll_RI = CASH_endExitSouthOff_RI;
								
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								if ((endExitMile<tempMile)&&(tempMile<3.342)&&(endExitFacilityId==tempFacID)) {
									inlineToll = inlineToll + tempToll	
									CASH_inlineToll = CASH_inlineToll + CASH_tempToll
									//For Inline Toll RATE INDEXED
									inlineToll_RI = inlineToll_RI + tempToll_RI
									CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
								}
							}
							// Mileage both facilities 
							// equation: SPUR = 3.342/mainline = 0
							mileage = Math.abs(3.342 - endExitMile) + Math.abs(startExitMile) + 218.92
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll) + (ticketToll * axleFactorTicket)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll) + (CASH_ticketToll * axleFactorTicket)
							
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)  + + ticketToll_RI
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI) + (CASH_ticketToll_RI * axleFactorTicket)

							// Display results when both exit belong to same facility
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}

// ******************************************************************************************************************************************************************************************************************************
// 408 To/From Western Beltway
// ******************************************************************************************************************************************************************************************************************************
						//************************* From 408 to Western Beltway
						if (startExitFacilityId == "EW" && endExitFacilityId == "WB") { 
							// Toll along mainline
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
								}
						
							// Toll on 408
							if (startExitMile<=22.49) { // going West
								startToll = startExitWestOn;
								CASH_startToll = CASH_startExitWestOn;
								//For RATE INDEXING
								startToll_RI = startExitWestOn_RI;
								CASH_startToll_RI = CASH_startExitWestOn_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
						                tempMile = inLineMilePT(w);
						                tempToll = inLineTempToll(w); // Transponder payments
						                CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments
						                tempFacID = inLineTempID(w);
									if ((tempMile<startExitMile)&&(tempMile<=22.49)&&(startExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							// Toll on Western Beltway, direction South
							if(endExitMile > 19.440){
								endToll = endExitNorthOff;
								CASH_endToll = CASH_endExitNorthOff;
								endToll_RI = endExitNorthOff_RI;
								CASH_endToll_RI = CASH_endExitNorthOff_RI;
								wbDir = "North";
							}
							else{
								endToll = endExitSouthOff;
								CASH_endToll = CASH_endExitSouthOff;
								endToll_RI = endExitSouthOff_RI;
								CASH_endToll_RI = CASH_endExitSouthOff_RI;
								wbDir = "South";
							}
								
							for (var w=0;w<numTollPlazas.length;w++) { 
						                tempMile = inLineMilePT(w);
						                tempToll = inLineTempToll(w); // Transponder payments
						                CASH_tempToll = inLineTempCashToll(w);// Cash payments
										tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
										tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments
										CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments
						                tempFacID = inLineTempID(w);
								
								if(wbDir=='South'){
									// In-line toll plazas along Western Beltway going south
									if ((endExitMile<tempMile)&&(tempMile!='27')&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
								else if(wbDir=='North'){
									if ((endExitMile>tempMile)&&(tempMile=='27')&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED Western Beltway
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							// Mileage both facilities 
							// equation: mainline=208.302;Bee Line=4.45; Western Beltway=22.4
							//           Miles from Western Beltway interchange to 408 interchange = 2.188

							mileage = Math.abs(22.4 - endExitMile) + Math.abs(startExitMile) + (2.188)
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)
							//Calculate New RATE INDEXED Amounts Western Beltway rules
							totalToll_RI = (axleFactor * (startToll_RI + inlineToll_RI)) + (endToll_RI + inlineToll_RI_WB)
							CASH_totalToll_RI = (axleFactor * (CASH_startToll_RI + CASH_inlineToll_RI)) + (CASH_endToll_RI + CASH_inlineToll_RI_WB)
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							var spOnly;
							spOnly = electronicOnly(formatCASHTotalToll_RI);//ELECTRONIC TOLLS ONLY CHECK

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
						}
						
						var fnd;
						var s_direction;
						fnd = false;
							if (startExitFacilityId == "WB" && startExitMile <= 19.440) { //start traveling north on Western Beltway (429)
								s_direction = "NORT";
								startToll = startExitNorthOn;
								CASH_startToll = CASH_startExitNorthOn;
								//For RATE INDEXING
								startToll_RI = startExitNorthOn_RI;
								CASH_startToll_RI = CASH_startExitNorthOn_RI;

							fnd = true;
							}
							else if (startExitFacilityId == "WB" && startExitMile > 19.440) { //start traveling south on Western Beltway (429)
								s_direction = "SOUT";
								startToll = startExitSouthOn;
								CASH_startToll = CASH_startExitSouthOn;
								//For RATE INDEXING
								startToll_RI = startExitSouthOn_RI;
								CASH_startToll_RI = CASH_startExitSouthOn_RI;

							fnd = true;
							}
						
				
						if (fnd){
							for (var w=0;w<numTollPlazas.length;w++) { 
								tempMile = inLineMilePT(w);
								tempToll = inLineTempToll(w); // Transponder payments
								CASH_tempToll = inLineTempCashToll(w);// Cash payments
								tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
								tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments
								CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments
								tempFacID = inLineTempID(w);
								
								//get the mainline toll for the Western Beltway
								if ((s_direction == "NORT")&&(startExitFacilityId==tempFacID)){
									 //going to 408 from the Western Beltway Northbound
									 if ((startExitMile<=tempMile) && (tempMile!='27')){
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
								
								// ******************************************************************************************
								// As of 6.20.2006 the calculator does not calculate traffic from the Western Beltway southbound
								// south of the Turnpike to other facilities because non-toll facilities are not used in the calculation of miles.
								// The only way this program is used is assuming the traveler is on toll roads only.
								// L Barber 6.20.2006
								// *******************************************************************************************
								else if ((s_direction == "SOUT")&&(startExitFacilityId==tempFacID)){
									if((startExitMile>tempMile) && (tempMile=='27')){
										inlineToll = inlineToll + tempToll
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
							
						// Toll on 408
							if (endExitMile<=22.49) { // going east
								endToll = endExitEastOff;
								CASH_endToll = CASH_endExitEastOff;
								//For RATE INDEXING
								endToll_RI = endExitEastOff_RI;
								CASH_endToll_RI = CASH_endExitEastOff_RI;
								
								for (var w=0;w<numTollPlazas.length;w++) { 
									tempMile = inLineMilePT(w);
									tempToll = inLineTempToll(w); // Transponder payments
									CASH_tempToll = inLineTempCashToll(w);// Cash payments
									tempToll_RI = inLineTempToll_RI(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI = inLineTempCashToll_RI(w);// RATE INDEXED Cash payments
									tempToll_RI_WB = inLineTempToll_RI_WB(w); // RATE INDEXED Transponder payments
									CASH_tempToll_RI_WB = inLineTempCashToll_RI_WB(w);// RATE INDEXED Cash payments
									tempFacID = inLineTempID(w);
									if ((tempMile<endExitMile)&&(tempMile<=22.49)&&(endExitFacilityId==tempFacID)) {
										inlineToll = inlineToll + tempToll	
										CASH_inlineToll = CASH_inlineToll + CASH_tempToll
										//For Inline Toll RATE INDEXED
										inlineToll_RI = inlineToll_RI + tempToll_RI
										CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
										//For Inline Toll RATE INDEXED
										inlineToll_RI_WB = inlineToll_RI_WB + tempToll_RI_WB
										CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll_RI_WB
									}
								}
							}
														
							if(fnd && endExitFacilityId == "EW"){
							
							// Mileage all facilities 
								mileage = Math.abs(endExitMile) + Math.abs(22.4 - startExitMile) + (2.188)
							
							// Calculate Toll
							totalToll = axleFactor * (startToll + endToll + inlineToll)
							CASH_totalToll = axleFactor * (CASH_startToll + CASH_endToll + CASH_inlineToll)
							//Calculate New RATE INDEXED Amounts
							totalToll_RI = axleFactor * (startToll_RI + endToll_RI + inlineToll_RI)
							CASH_totalToll_RI = axleFactor * (CASH_startToll_RI + CASH_endToll_RI + CASH_inlineToll_RI)

							//Calculate New RATE INDEXED Amounts Western Beltway rules
							totalToll_RI = (axleFactor * (endToll_RI + inlineToll_RI)) + (startToll_RI + inlineToll_RI_WB)
							CASH_totalToll_RI = (axleFactor * (CASH_endToll_RI + CASH_inlineToll_RI)) + (CASH_startToll_RI + CASH_inlineToll_RI_WB)
							
							formatMile.setNumber(Math.abs(mileage));
							formatMile.setCurrency(false);
							formatTotalToll.setNumber(totalToll);
							formatCASHTotalToll.setNumber(CASH_totalToll);
							
							//Added for Rate Indexing
							formatTotalToll_RI.setNumber(totalToll_RI);
							formatCASHTotalToll_RI.setNumber(CASH_totalToll_RI);

							if (totalToll_RI > 900) {
								//alert("Invalid movement. Please Try Again");
								clearRouteArrays();
								myTollAmounts[0]=0;
								myTollAmounts[1]=0;
								myTollAmounts[2]=0;
								return (myTollAmounts);
								//outputText += "You cannot get on or off in the exits you selected.  Please, try again"
							} else {
								myTollAmounts[0]=formatTotalToll_RI;
								myTollAmounts[1]=formatCASHTotalToll_RI;
								// Include milage in arry to send back to map page
								myTollAmounts[2]=formatMile;
								return (myTollAmounts);
							}
							//document.getElementById("messageDIV").innerHTML=outputText
							}//end start and end facility check
						}
	

}// end function

function getInlineToll_SunPass_South(){
	// Find In-line-Toll-Plazas Transponder payment
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))

		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
			inlineToll = inlineToll + tempToll
		}
	}
return inlineToll;
}

function getInlineToll_Cash_South(){
	// Find In-line-Toll-Plazas Cash payment
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
		}
	}
return CASH_inlineToll;
}

function getInlineToll_SunPass_North(){
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
			inlineToll = inlineToll + tempToll
		}
	}
return inlineToll;
}

function getInlineToll_Cash_North(){
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
		}
	}
return CASH_inlineToll;
}

function getInlineToll_SunPass_West(){
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
			inlineToll = inlineToll + tempToll
		}
	}
return inlineToll;
}

function getInlineToll_Cash_West(){
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
		}
	}
return CASH_inlineToll;
}

function getInlineToll_SunPass_East(){
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
			inlineToll = inlineToll + tempToll
		}
	}
return inlineToll;
}

function getInlineToll_Cash_East(){
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
		}
	}
return CASH_inlineToll;
}

//////////////////////////////////////////////////////////////////////////////
//Rate Indexing Set
//////////////////////////////////////////////////////////////////////////////

function getInlineToll_SunPass_South_RI(){
	var i = 0;
	myInlineTollPlazas = [];
	//myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2)  , startExitMile];
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI).toFixed(2) , startExitMile];
	} else {
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2) , startExitMile];
	}
	i=i+1;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "SKYWAY") && (tempPlazaName == "Sunshine Skyway North Plaza")) {
			inlineToll_RI = inlineToll_RI + tempToll
			myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
			i = i + 1;
		} else {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				if ((startExitFacilityId!="WB") && (startExitFacilityId!="SKYWAY") && (tempPlazaName != "Bird Road North Toll Plaza")) {
					inlineToll_RI = inlineToll_RI + tempToll
					myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2), tempMile];
					i = i + 1;
				}
			}
		}
	}
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI).toFixed(2) , endExitMile];
	} else {
		myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
	}
	myInlineTollPlazas.sort(sortSouthBound);
	return inlineToll_RI;
}

function getInlineToll_Cash_South_RI(){
	var i = 0;
	myInlineTollPlazasCASH = [];
	//myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI).toFixed(2) , startExitMile];
	} else {
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	}
	i=i+1;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "SKYWAY") && (tempPlazaName == "Sunshine Skyway North Plaza")) {
			CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
			myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
			i = i + 1;
		} else {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				if ((startExitFacilityId!="WB") && (startExitFacilityId!="SKYWAY") && (tempPlazaName != "Bird Road North Toll Plaza")) {
					CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
					myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" +  parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
					i = i + 1;
				}
			}
		}
	}
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI).toFixed(2) , endExitMile];
	} else {
		myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
	}
	//myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
	myInlineTollPlazasCASH.sort(sortSouthBound);
	return CASH_inlineToll_RI;
}

function getInlineToll_SunPass_North_RI(){
	var i = 0;
	myInlineTollPlazas = [];
	//myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2)  , startExitMile];
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI).toFixed(2) , startExitMile];
	} else {
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2) , startExitMile];
	}
	i=i+1;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "SKYWAY") && (tempPlazaName == "Sunshine Skyway South Plaza")) {
			inlineToll_RI = inlineToll_RI + tempToll
			myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
			i = i + 1;
		} else {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				if ((startExitFacilityId!="WB") && (startExitFacilityId!="SKYWAY") && (tempPlazaName != "Bird Road South Toll Plaza")) {
					if(tempPlazaName == "Bird Road North Toll Plaza"){tempToll=1.04; CASH_tempToll=1.30;}
					inlineToll_RI = inlineToll_RI + tempToll
					myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2), tempMile];
					i = i + 1;
				}
			}
		}
	}
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI).toFixed(2) , endExitMile];
	} else {
		myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
	}
	//myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
	myInlineTollPlazas.sort(sortNorthBound);
	return inlineToll_RI;
}

function getInlineToll_Cash_North_RI(){
	var i = 0;
	myInlineTollPlazasCASH = [];
	//myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI).toFixed(2) , startExitMile];
	} else {
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	}
	i=i+1;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "SKYWAY") && (tempPlazaName == "Sunshine Skyway South Plaza")) {
			CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
			myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
			i = i + 1;
		} else {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				if ((startExitFacilityId!="WB") && (startExitFacilityId!="SKYWAY") && (tempPlazaName != "Bird Road South Toll Plaza")) {
					if(tempPlazaName == "Bird Road North Toll Plaza"){CASH_tempToll=1.30;}
					CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
					myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
					i = i + 1;
				}
			}
		}
	}
	
	if (startExitFacilityId == "SG" && endExitFacilityId == "SG") {
		//Sawgrass tolls a flat rate at all exits
		myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI).toFixed(2) , endExitMile];
	} else {
		myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
	}
	//myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
	myInlineTollPlazasCASH.sort(sortNorthBound);
	return CASH_inlineToll_RI;
}

function getInlineToll_SunPass_West_RI(){
	var i = 0;
	myInlineTollPlazas = [];
	if(startToll_RI<0){
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(0 * axleFactor).toFixed(2)  , startExitMile];
	} else {
		myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2)  , startExitMile];
	}
	i=i+1;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "ALLIGATOR") && (tempPlazaName == "Alligator Alley East Plaza")) {
			if (startExitMile < 25) {
				inlineToll_RI = inlineToll_RI + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		} else {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				if (startExitFacilityId!="WB") {
					inlineToll_RI = inlineToll_RI + tempToll
					//Exit 14 on the Polk is tolled at the Central Toll Plaza and has a negative value to make the toll amount correct
					// HOWEVER - to make the figures correct for the Toll Route shown on the left, we have to modify the amounts
					if((startExitName=='S.R. 540/Winter Lake Rd.') && (tempPlazaName=='Central Toll Plaza')){
						tempToll = tempToll + startToll_RI
						if (tempToll < 0) { tempToll = tempToll * -1 }
						//myInlineTollPlazas[i-1] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(tempToll * axleFactor).toFixed(2)  , startExitMile];
						//myInlineTollPlazas[i] = [tempPlazaName + " - $0.00" , tempMile];
						
//						myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
//						i = i + 1;
					} else {
//						myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
//						i = i + 1;					
					}
					myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
					i = i + 1;

				}
			}
		}
	}
	myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
	// POLK Parkway Heading West direction is the same as Northbound on Veterans/Suncoast.  Mileage DECREASES
	myInlineTollPlazas.sort(sortSouthBound);
return inlineToll_RI;
}

function getInlineToll_Cash_West_RI(){
	var i = 0;
	myInlineTollPlazasCASH = [];
	if(startToll_RI<0){
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(0 * axleFactor).toFixed(2) , startExitMile];
	} else {
		myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	}
	i=i+1;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "ALLIGATOR") && (tempPlazaName == "Alligator Alley East Plaza")) {
			if (startExitMile < 25) {
				CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		} else {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				if (startExitFacilityId!="WB") {
					CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
					//Exit 14 on the Polk is tolled at the Central Toll Plaza and has a negative value to make the toll amount correct
					// HOWEVER - to make the figures correct for the Toll Route shown on the left, we have to modify the amount AND where it shows you pay
					if((startExitName=='S.R. 540/Winter Lake Rd.') && (tempPlazaName=='Central Toll Plaza')){
						CASH_tempToll = CASH_tempToll + CASH_startToll_RI
						if (CASH_tempToll < 0) { CASH_tempToll = CASH_tempToll* -1 }
//						myInlineTollPlazasCASH[i-1] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2)  , startExitMile];
//						myInlineTollPlazasCASH[i] = [tempPlazaName + " - $0.00" , tempMile];
//						i = i + 1;
//					} else {
//						myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
//						i = i + 1;					
					}
					myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
					i = i + 1;	
				}
			}
		}
	}
	myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
	// POLK Parkway Heading West direction is the same as Northbound on Veterans/Suncoast.  Mileage DECREASES
	myInlineTollPlazasCASH.sort(sortSouthBound);
return CASH_inlineToll_RI;
}

function getInlineToll_SunPass_East_RI(){
	var i = 0;
	myInlineTollPlazas = [];
	myInlineTollPlazas[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(startToll_RI * axleFactor).toFixed(2)  , startExitMile];
	i=i+1;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "ALLIGATOR") && (tempPlazaName == "Alligator Alley West Plaza")) {
			if (startExitMile > 75) {
				inlineToll_RI = inlineToll_RI + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1
			}
		} else {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				if (startExitFacilityId!="WB") {
					inlineToll_RI = inlineToll_RI + tempToll
					//Exit 14 on the Polk is tolled at the Central Toll Plaza and has a negative value to make the toll amount correct
					// HOWEVER - to make the figures correct for the Toll Route shown on the left, we have to modify the amounts
					if((endExitName=='S.R. 540/Winter Lake Rd.') && (tempPlazaName=='Central Toll Plaza')){
						tempToll = tempToll + startToll_RI
						myPolkParkwayExit14Toll = tempToll + endToll_RI
						myInlineTollPlazas[i] = [tempPlazaName + " - $0.00" , tempMile];
						i = i + 1;
					} else {
						myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
						i = i + 1;					
					}

				}
			}
		}
	}
	if (endExitName=='S.R. 540/Winter Lake Rd.') {
		//if (startMile < 12) {
			//myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((inlineToll_RI + endToll_RI) * axleFactor).toFixed(2) , endExitMile];
			myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((myPolkParkwayExit14Toll) * axleFactor).toFixed(2) , endExitMile];
		//} else {
		//	myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((inlineToll_RI - endToll_RI) * axleFactor).toFixed(2) , endExitMile];
		//}
	} else {
		if(endToll_RI<0){
			myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(0 * axleFactor).toFixed(2) , endExitMile];
		} else {
			myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
		}	
	}
	// POLK Parkway Heading East direction is the same as Northbound on Veterans/Suncoast.  Mileage INCREASES
	myInlineTollPlazas.sort(sortNorthBound);
return inlineToll_RI;
}

function getInlineToll_Cash_East_RI(){
	var i = 0;
	myInlineTollPlazasCASH = [];
	myInlineTollPlazasCASH[i] = ["<b>Start Point: " + startExitName + "</b> - $" + parseFloat(CASH_startToll_RI * axleFactor).toFixed(2) , startExitMile];
	i=i+1;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if ((startExitFacilityId==tempFacID) && (tempFacID == "ALLIGATOR") && (tempPlazaName == "Alligator Alley West Plaza")) {
			if (startExitMile > 75) {
				CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		} else {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				if (startExitFacilityId!="WB") {
					CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll
					//Exit 14 on the Polk is tolled at the Central Toll Plaza and has a negative value to make the toll amount correct
					// HOWEVER - to make the figures correct for the Toll Route shown on the left, we have to modify the amounts
					if((endExitName=='S.R. 540/Winter Lake Rd.') && (tempPlazaName=='Central Toll Plaza')){
						CASH_tempToll = CASH_tempToll + CASH_startToll_RI
						myPolkParkwayExit14Toll = CASH_tempToll + CASH_endToll_RI
						myInlineTollPlazasCASH[i] = [tempPlazaName + " - $0.00" , tempMile];
						i = i + 1;
					} else {
						myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
						i = i + 1;					
					}
				}
			}
		}
	}
	if (endExitName=='S.R. 540/Winter Lake Rd.') {
		//if (startMile < 12) {
			//myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_inlineToll_RI + CASH_endToll_RI) * axleFactor).toFixed(2) , endExitMile];
			myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((myPolkParkwayExit14Toll) * axleFactor).toFixed(2) , endExitMile];
		//} else {
		//	myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat((CASH_inlineToll_RI - CASH_endToll_RI) * axleFactor).toFixed(2) , endExitMile];
		//}
	} else {
		if(CASH_endToll_RI<0){
			myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(0 * axleFactor).toFixed(2) , endExitMile];
		} else {
			myInlineTollPlazasCASH[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(CASH_endToll_RI * axleFactor).toFixed(2) , endExitMile];
		}	
	}
	
	// POLK Parkway Heading East direction is the same as Northbound on Veterans/Suncoast.  Mileage INCREASES
	myInlineTollPlazasCASH.sort(sortNorthBound);
return CASH_inlineToll_RI;
}

//////////////////////////////////////////////////////////////////////////////
//END Rate Indexing Set
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//Western Seltway Set
//////////////////////////////////////////////////////////////////////////////

function getInlineToll_SunPass_South_RI_WB(){
	var i = myInlineTollPlazas.length;
	// Find In-line-Toll-Plazas

	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
	//for (var w=23;w<26;w++) { // finds in-line toll plazas for this Western Beltway facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						tempToll = tempToll;
						break;
					case 2: 
						tempToll = tempToll + .54;
						break;
					case 3: 
						tempToll = tempToll + 1.09;
						break;
					case 4: 
						tempToll = tempToll + 1.63;
						break;
					default: 
						tempToll = tempToll + 1.63;
						break;
				}
				*/
				inlineToll_RI_WB = inlineToll_RI_WB + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
	//myInlineTollPlazas[i] = ["<b>End Point: " + endExitName + "</b> - $" + parseFloat(endToll_RI * axleFactor).toFixed(2) , endExitMile];
return inlineToll_RI_WB;
}

function getInlineToll_Cash_South_RI_WB(){
	var i = myInlineTollPlazasCASH.length;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						CASH_tempToll = CASH_tempToll;
						break;
					case 2: 
						CASH_tempToll = CASH_tempToll + .50;
						break;
					case 3: 
						CASH_tempToll = CASH_tempToll + 1.00;
						break;
					case 4: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
					default: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
				}
				*/
				CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return CASH_inlineToll_RI_WB;
}

function getInlineToll_SunPass_North_RI_WB(){
	var i = myInlineTollPlazas.length;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						tempToll = tempToll;
						break;
					case 2: 
						tempToll = tempToll + .54;
						break;
					case 3: 
						tempToll = tempToll + 1.09;
						break;
					case 4: 
						tempToll = tempToll + 1.63;
						break;
					default: 
						tempToll = tempToll + 1.63;
						break;
				}
				*/
				inlineToll_RI_WB = inlineToll_RI_WB + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return inlineToll_RI_WB;
}

function getInlineToll_Cash_North_RI_WB(){
	var i = myInlineTollPlazasCASH.length;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						CASH_tempToll = CASH_tempToll;
						break;
					case 2: 
						CASH_tempToll = CASH_tempToll + .50;
						break;
					case 3: 
						CASH_tempToll = CASH_tempToll + 1.00;
						break;
					case 4: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
					default: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
				}
				*/
				CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return CASH_inlineToll_RI_WB;
}

function getInlineToll_SunPass_West_RI_WB(){
	var i = myInlineTollPlazas.length;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						tempToll = tempToll;
						break;
					case 2: 
						tempToll = tempToll + .54;
						break;
					case 3: 
						tempToll = tempToll + 1.09;
						break;
					case 4: 
						tempToll = tempToll + 1.63;
						break;
					default: 
						tempToll = tempToll + 1.63;
						break;
				}
				*/
				inlineToll_RI_WB = inlineToll_RI_WB + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return inlineToll_RI_WB;
}

function getInlineToll_Cash_West_RI_WB(){
	var i = myInlineTollPlazasCASH.length;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile>tempMile)&&(endExitMile<tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						CASH_tempToll = CASH_tempToll;
						break;
					case 2: 
						CASH_tempToll = CASH_tempToll + .50;
						break;
					case 3: 
						CASH_tempToll = CASH_tempToll + 1.00;
						break;
					case 4: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
					default: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
				}
				*/
				CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return CASH_inlineToll_RI_WB;
}

function getInlineToll_SunPass_East_RI_WB(){
	var i = myInlineTollPlazas.length;
	// Find In-line-Toll-Plazas
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
	// Transponder payments
		tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						tempToll = tempToll;
						break;
					case 2: 
						tempToll = tempToll + .54;
						break;
					case 3: 
						tempToll = tempToll + 1.09;
						break;
					case 4: 
						tempToll = tempToll + 1.63;
						break;
					default: 
						tempToll = tempToll + 1.63;
						break;
				}
				*/
				inlineToll_RI_WB = inlineToll_RI_WB + tempToll
				myInlineTollPlazas[i] = [tempPlazaName + " - $" + parseFloat(tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}

	}
return inlineToll_RI_WB;
}

function getInlineToll_Cash_East_RI_WB(){
	var i = myInlineTollPlazasCASH.length;
	for (var w=0;w<numTollPlazas.length;w++) { // finds in-line toll plazas for this facility between the selected exits
		tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
		// Cash payments
		CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
		tempPlazaName =  xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
		if (tempFacID=="WB") {
			if ((startExitMile<tempMile)&&(endExitMile>tempMile)&&(startExitFacilityId==tempFacID)) {
				/*
				switch (axleFactor) {
					case 1: 
						CASH_tempToll = CASH_tempToll;
						break;
					case 2: 
						CASH_tempToll = CASH_tempToll + .50;
						break;
					case 3: 
						CASH_tempToll = CASH_tempToll + 1.00;
						break;
					case 4: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
					default: 
						CASH_tempToll = CASH_tempToll + 1.50;
						break;
				}
				*/
				CASH_inlineToll_RI_WB = CASH_inlineToll_RI_WB + CASH_tempToll
				myInlineTollPlazasCASH[i] = [tempPlazaName + " - $" + parseFloat(CASH_tempToll * axleFactor).toFixed(2) , tempMile];
				i = i + 1;
			}
		}
	}
return CASH_inlineToll_RI_WB
}

//////////////////////////////////////////////////////////////////////////////
//END Western Beltway Set
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//  START SELMON CONNECTOR SET
//////////////////////////////////////////////////////////////////////////////
function getInlineToll_Selmon(){
	var i = 0;
	var newToll = 0;
	var newStartExitName = "";
	var newEndExitName = "";
	
	switch (startExitName) {
		case "Port to I-4 EB or WB (Trucks Only)": 
			newToll = 1.02;
			newStartExitName = "Port";
			if (endExitName == "I-4 WB to Selmon WB or Port") {
				newEndExitName = "I-4 EB";
			} else {
				newEndExitName = "I-4 WB";
			}
			break;
		case "I-4 WB to Selmon WB or Port": 
			newToll = 1.02;
			newStartExitName = "I-4 WB";
			if (endExitName == "Port to I-4 EB or WB (Trucks Only)") {
				newEndExitName = "Port";
			} else {
				newEndExitName = "Selmon WB";
			}
			break;
		case "I-4 EB to Selmon EB or Port": 
			newStartExitName = "I-4 EB";
			if (endExitName == "Port to I-4 EB or WB (Trucks Only)") {
				newEndExitName = "Port";
				newToll = 1.02;
			} else {
				newEndExitName = "Selmon EB";
				newToll = 0.51;
			}
			break;
		case "Selmon EB to I-4 EB": 
			newStartExitName = "Selmon EB";
			newEndExitName = "I-4 EB";
			newToll = 1.02;
			break;
		case "Selmon WB to I-4 WB": 
			newStartExitName = "Selmon WB";
			newEndExitName = "I-4 WB";
			newToll = 0.51;
			break;
		default: 
			newToll = 0.51;
			break;
	}
	
	myInlineTollPlazas = [];
	
	myInlineTollPlazas[i] = ["<b>Start Point: " + newStartExitName + "</b> - $0.00" , startExitMile];
	i=i+1;
	
	if ((newStartExitName == "Port") || (newEndExitName == "Port")) {
		myInlineTollPlazas[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newToll).toFixed(2) , tempMile];
	} else {
		myInlineTollPlazas[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newToll * axleFactor).toFixed(2) , tempMile];
	}
	//myInlineTollPlazas[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newToll * axleFactor).toFixed(2) , tempMile];
	i = i + 1;

	myInlineTollPlazas[i] = ["<b>End Point: " + newEndExitName + "</b> - $0.00" , endExitMile];
	
	inlineToll_RI = newToll;
	return inlineToll_RI;
}

function getInlineTollCASH_Selmon(){

	var i = 0;
	var newTollCash = 0;
	var newStartExitName = "";
	var newEndExitName = "";
	
	switch (startExitName) {
		case "Port to I-4 EB or WB (Trucks Only)": 
			newTollCash = 1.27;
			newStartExitName = "Port";
			if (endExitName == "I-4 WB to Selmon WB or Port") {
				newEndExitName = "I-4 EB";
			} else {
				newEndExitName = "I-4 WB";
			}
			break;
		case "I-4 WB to Selmon WB or Port": 
			newTollCash = 1.27;
			newStartExitName = "I-4 WB";
			if (endExitName == "Port to I-4 EB or WB (Trucks Only)") {
				newEndExitName = "Port";
			} else {
				newEndExitName = "Selmon WB";
			}
			break;
		case "I-4 EB to Selmon EB or Port": 
			newStartExitName = "I-4 EB";
			if (endExitName == "Port to I-4 EB or WB (Trucks Only)") {
				newEndExitName = "Port";
				newTollCash = 1.27;
			} else {
				newEndExitName = "Selmon EB";
				newTollCash = 0.76;
			}
			break;
		case "Selmon EB to I-4 EB": 
			newStartExitName = "Selmon EB";
			newEndExitName = "I-4 EB";
			newTollCash = 1.27;
			break;
		case "Selmon WB to I-4 WB": 
			newStartExitName = "Selmon WB";
			newEndExitName = "I-4 WB";
			newTollCash = 0.76;
			break;
		default: 
			newTollCash = 0.76;
			break;
	}
	
	myInlineTollPlazasCASH = [];
	myInlineTollPlazasCASH[i] = ["<b>Start Point: " + newStartExitName + "</b> - $0.00" , startExitMile];
	i=i+1;
	
	if ((newStartExitName == "Port") || (newEndExitName == "Port")) {
		myInlineTollPlazasCASH[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newTollCash).toFixed(2) , tempMile];
	} else {
		myInlineTollPlazasCASH[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newTollCash * axleFactor).toFixed(2) , tempMile];
	}
	//myInlineTollPlazasCASH[i] = ["Selmon Toll Plaza" + " - $" + parseFloat(newTollCash * axleFactor).toFixed(2) , tempMile];
	i = i + 1;

	myInlineTollPlazasCASH[i] = ["<b>End Point: " + newEndExitName + "</b> - $0.00" , endExitMile];
	
	CASH_inlineToll_RI = newTollCash;
	return CASH_inlineToll_RI;
}

///////////////////////////////////////////////////////////////////////////////
//  END SELMON CONNECTOR SET
///////////////////////////////////////////////////////////////////////////////

function inLineMilePT(w){
    tempMile = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("MILE_POINT"))
    return tempMile;
}
function inLineTempToll(w){
    // Transponder payments
	tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL"))
	return tempToll;
}
function inLineTempToll_RI(w){
    // RATE INDEXED Transponder payments
	// Skip Western Beltway
	if (w<30 || w>32) {
		tempToll_RI = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
	}else{
		tempToll_RI = 0;
	}
	return tempToll_RI;
}
function inLineTempToll_RI_WB(w){
    // RATE INDEXED Transponder payments WesternBeltway
	//myFac = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
	if (w>29 && w<33) {
		tempToll_RI_WB = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("SUNPASS_TOLL_RI"))
		switch (axleFactor) {
			case 1: 
				tempToll_RI_WB = tempToll_RI_WB;
				break;
			case 2: 
				tempToll_RI_WB = tempToll_RI_WB + .54;
				break;
			case 3: 
				tempToll_RI_WB = tempToll_RI_WB + 1.09;
				break;
			case 4: 
				tempToll_RI_WB = tempToll_RI_WB + 1.63;
				break;
			default: 
				tempToll_RI_WB = tempToll_RI_WB + 1.63;
				break;
			}
	} else {
		tempToll_RI_WB = 0;
	}
	return tempToll_RI_WB;
}
function inLineTempCashToll(w){
    // Cash payments
    CASH_tempToll = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL"))
    return CASH_tempToll;
}
function inLineTempCashToll_RI(w){
    // RATE INDEXED Cash payments
	//Skip Western Beltway
	//myFac = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
	if (w<30 || w>32) {
		CASH_tempToll_RI = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
	} else {
		CASH_tempToll_RI = 0;
	}
	return CASH_tempToll_RI;
}
function inLineTempCashToll_RI_WB(w){
    // RATE INDEXED Cash payments
	//myFac = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
	if (w>29 && w<33) {
		CASH_tempToll_RI_WB = parseFloat(xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("CASH_TOLL_RI"))
		switch (axleFactor) {
			case 1: 
				CASH_tempToll_RI_WB = CASH_tempToll_RI_WB;
				break;
			case 2: 
				CASH_tempToll_RI_WB = CASH_tempToll_RI_WB + .50;
				break;
			case 3: 
				CASH_tempToll_RI_WB = CASH_tempToll_RI_WB + 1.00;
				break;
			case 4: 
				CASH_tempToll_RI_WB = CASH_tempToll_RI_WB + 1.50;
				break;
			default: 
				CASH_tempToll_RI_WB = CASH_tempToll_RI_WB + 1.50;
				break;
			}
		} else {
			CASH_tempToll_RI_WB = 0;
	}
	return CASH_tempToll_RI_WB;
}
function inLineTempID(w){
    tempFacID = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("FACID")
    return tempFacID;
}
function inLineTempPlaza(w){
    tempPlazaName = xmlDoc.getElementsByTagName("IN_LINE_TOLL_PLAZA")[w].getAttribute("TP_NAME")
    return tempPlazaName;
}
function beeLineTrans_SP(BeeLineMainlineExit){
	transToll = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_OFF"))
	return transToll;
}
function beeLineTrans_CA(BeeLineMainlineExit){
	CASH_transToll = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_OFF"))
	return CASH_transToll;
}
function beeLineTrans_SP_RI(BeeLineMainlineExit){
	transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("SB_OFF_RI"))
	return transToll_RI;
}
function beeLineTrans_CA_RI(BeeLineMainlineExit){
	CASH_transToll_RI = parseFloat(xmlDoc.getElementsByTagName("EXIT")[BeeLineMainlineExit].getAttribute("CASH_SB_OFF_RI"))
	return CASH_transToll_RI;
}

function beeLine(startExitFacilityId,inlineToll,CASH_inlineToll,cnt){
var e_direction;

//get the mainline toll for the ending facility
						
//****************************************************************
// add the toll for entry onto the Bee Line from the North.
if(startExitFacilityId=='WB'){
	inlineToll = inlineToll + parseFloat(.50)
	CASH_inlineToll = CASH_inlineToll + parseFloat(.75)
}
//****************************************************************

if(endExitMile >= 4.665){ //end traveling east on Bee Line
	e_direction = "EAST";
					
	endToll= endExitEastOff;
	CASH_endToll = CASH_endExitEastOff;
							
}
else if(endExitMile < 4.665){ //end traveling west on Bee Line
	e_direction = "WEST";
							
	endToll= endExitWestOff;
	CASH_endToll = CASH_endExitWestOff;
							
}

for (var w=0;w<numTollPlazas.length;w++) { 
	tempMile = inLineMilePT(w);
	tempToll = inLineTempToll(w); // Transponder payments
	CASH_tempToll = inLineTempCashToll(w);// Cash payments
	tempFacID = inLineTempID(w);
	if(tempFacID=='B'){
		if ((e_direction == "WEST")&& (endExitMile<tempMile)){
			inlineToll = inlineToll + tempToll
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll					
		}
		else if ((e_direction == "EAST") && (endExitMile>tempMile)){
			inlineToll = inlineToll + tempToll
			CASH_inlineToll = CASH_inlineToll + CASH_tempToll
		}
	}
}
if (cnt == 0){
return inlineToll;
}
else if(cnt == 1){
return CASH_inlineToll;
}

}//end beeLine function

function beeLine_RI(startExitFacilityId,inlineToll,CASH_inlineToll,cnt){
var e_direction;

//get the mainline toll for the ending facility
						
//****************************************************************
// add the toll for entry onto the Bee Line from the North.
if(startExitFacilityId=='WB'){
	inlineToll = inlineToll + parseFloat(.50)
	CASH_inlineToll = CASH_inlineToll + parseFloat(.75)
}
//****************************************************************

if(endExitMile >= 4.665){ //end traveling east on Bee Line
	e_direction = "EAST";
					
	endToll_RI = endExitEastOff_RI;
	CASH_endToll_RI = CASH_endExitEastOff_RI;
							
}
else if(endExitMile < 4.665){ //end traveling west on Bee Line
	e_direction = "WEST";
							
	endToll_RI = endExitWestOff_RI;
	CASH_endToll_RI = CASH_endExitWestOff_RI;
							
}

for (var w=0;w<numTollPlazas.length;w++) { 
	tempMile = inLineMilePT(w);
	tempToll_RI = inLineTempToll_RI(w); // Transponder payments
	CASH_tempToll_RI = inLineTempCashToll_RI(w);// Cash payments
	tempFacID = inLineTempID(w);
	if(tempFacID=='B'){
		if ((e_direction == "WEST")&& (endExitMile<tempMile)){
			inlineToll_RI = inlineToll_RI + tempToll_RI
			CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
		}
		else if ((e_direction == "EAST") && (endExitMile>tempMile)){
			inlineToll_RI = inlineToll_RI + tempToll_RI
			CASH_inlineToll_RI = CASH_inlineToll_RI + CASH_tempToll_RI
		}
	}
}
if (cnt == 0){
return inlineToll_RI;
}
else if(cnt == 1){
return CASH_inlineToll_RI;
}

}//end beeLine_RI function

function updateAxleData(bx) {
	CASH_inlineToll=0
	CASH_tempToll=0
	inlineToll=0
	tempToll=0
	axle = ""
	axle = "" + bx;
	switch (axle) {
		case "2":
					axleFactor=1;
					axleFactorTicket=2;
					bridgeAxleFactor=0;
					break;
		case "3":
					axleFactor=2;
					axleFactorTicket=3;
					bridgeAxleFactor=1;
					break;
		case "4":
					axleFactor=3;
					axleFactorTicket=4;
					bridgeAxleFactor=2;
					break;
		case "5":
					axleFactor=4;
					axleFactorTicket=5;
					bridgeAxleFactor=3;
					break;
		case "6":
					axleFactor=5;
					axleFactorTicket=6;
					bridgeAxleFactor=4;
					break;
		case "7":
					axleFactor=6;
					axleFactorTicket=7;
					bridgeAxleFactor=5;
					break;
		case "8":
					axleFactor=7;
					axleFactorTicket=8;
					bridgeAxleFactor=6;
					break;
	}
}
		
		
function verify() {
	// 0 Object is not initialized
	// 1 Loading object is loading data
	// 2 Loaded object has loaded data
	// 3 Data from object can be worked with
	// 4 Object completely initialized
	if (xmlDoc.readyState!=4) {
		return false;
	}
}
		

		
function populatesStartingExit() { // when selection is made on ending exits combo box
	theIndex2=document.form1.endingExits.selectedIndex;
	getEndingExitData();
}
		
function resetAll() {
	theIndex=0;
	theIndex2=0;
	document.getElementById("messageDIV").style.visibility = "hidden";
	document.getElementById("subMsgDIV").style.visibility = "hidden";
	isReset1=true;
	isReset2=true;
	document.getElementById("messageDIV").innerHTML=""
	document.getElementById("subMsgDIV").innerHTML=""
	resetVehicleImage();
}

function calculateTicketToll(eFrom, eTo) {
	var tToll=0;
	var eFromIndex;

	switch (eFrom) {
		case "Lantana Plaza":
				eFromIndex = 0;
				break;
		case "Lake Worth (Lake Worth Rd.)":
				eFromIndex = 1;
				break;
		case "S.R. 80":
				eFromIndex = 2;
				break;
		case "Jog Rd.":
				eFromIndex = 3;
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				eFromIndex = 4;
				break;
		case "S.R. 710":
				eFromIndex = 5;
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				eFromIndex = 6;
				break;
		case "Jupiter (Indiantown Rd.)":
				eFromIndex = 7;
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				eFromIndex = 8;
				break;
		case "Becker Rd.":
				eFromIndex = 9;
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				eFromIndex = 10;
				break;
		case "Fort Pierce (S.R. 70)":
				eFromIndex = 11;
				break;
		case "Yeehaw Junction (S.R. 60)":
				eFromIndex = 12;
				break;
		case "Three Lakes Plaza":
				eFromIndex = 13;	
				break;				
	}
	switch (eTo) {
		case "Lantana Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_88"))
				break;
		case "Lake Worth (Lake Worth Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_93"))
				break;
		case "S.R. 80":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_97"))
				break;
		case "Jog Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_98"))
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_99"))
				break;
		case "S.R. 710":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_107"))
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_109"))
				break;
		case "Jupiter (Indiantown Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_116"))
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_133"))
				break;
		case "Becker Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_138"))
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_142"))
				break;
		case "Fort Pierce (S.R. 70)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_152"))
				break;
		case "Yeehaw Junction (S.R. 60)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_193"))
				break;
		case "Three Lakes Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_236"))	
				break;				
	}
	return tToll;
}

function calculateTicketToll_RI(eFrom, eTo) {
	var tToll=0;
	var eFromIndex;

	switch (eFrom) {
		case "Lantana Plaza":
				eFromIndex = 0;
				break;
		case "Lake Worth (Lake Worth Rd.)":
				eFromIndex = 1;
				break;
		case "S.R. 80":
				eFromIndex = 2;
				break;
		case "Jog Rd.":
				eFromIndex = 3;
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				eFromIndex = 4;
				break;
		case "S.R. 710":
				eFromIndex = 5;
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				eFromIndex = 6;
				break;
		case "Jupiter (Indiantown Rd.)":
				eFromIndex = 7;
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				eFromIndex = 8;
				break;
		case "Becker Rd.":
				eFromIndex = 9;
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				eFromIndex = 10;
				break;
		case "Fort Pierce (S.R. 70)":
				eFromIndex = 11;
				break;
		case "Yeehaw Junction (S.R. 60)":
				eFromIndex = 12;
				break;
		case "Three Lakes Plaza":
				eFromIndex = 13;	
				break;				
	}
	switch (eTo) {
		case "Lantana Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_88_RI"))
				break;
		case "Lake Worth (Lake Worth Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_93_RI"))
				break;
		case "S.R. 80":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_97_RI"))
				break;
		case "Jog Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_98_RI"))
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_99_RI"))
				break;
		case "S.R. 710":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_107_RI"))
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_109_RI"))
				break;
		case "Jupiter (Indiantown Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_116_RI"))
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_133_RI"))
				break;
		case "Becker Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_138_RI"))
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_142_RI"))
				break;
		case "Fort Pierce (S.R. 70)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_152_RI"))
				break;
		case "Yeehaw Junction (S.R. 60)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_193_RI"))
				break;
		case "Three Lakes Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("E_236_RI"))	
				break;				
	}
	tToll = calcFullTicketToll_SP_RI(tToll);
	return tToll;
}

function calcFullTicketToll_SP_RI(tToll){
	var new_tToll=0;
	var num = new Number(parseFloat(tToll));
	if (axleFactorTicket == 2) {
		new_tToll = parseFloat(tToll * axleFactorTicket).toFixed(2) 
	} else {
		//Javascript CANNOT round .275 correctly SO, for now, we will hardcode it to .28 so the calculations will work
		if(tToll == 1.275) { tToll = 1.28; }
		//Check to see if its 2 decimal places or 3
		//If 2
//		var c = num.toPrecision(3);
		var c = myRound(tToll);
	//	//alert(c);
//		new_tToll = parseFloat(Math.round((tToll*axleFactorTicket)*100)/100).toFixed(2)
		new_tToll = parseFloat(Math.round((c*axleFactorTicket)*100)/100).toFixed(2)
		//Else
		//new_tToll = parseFloat(Math.round((tToll*axleFactorTicket)*1000)/1000).toFixed(2)
		//End If
		//Math.round((1.28*3)*100)/100

			//Start = 86 - Boynton Beach
			//End = 116 � Jupiter         1.325
			//Calculator shows
			//2 axles = $2.65 CORRECT
			//3 axles = $3.97 WRONG, should be $3.99
			//4 axles = $5.30 WRONG, should be $5.32    
	}
	return new_tToll;
}

function myRound(number){
	var decimalplaces = 2
	var multiply1 = Math.pow(10,(decimalplaces + 4));
	var divide1 = Math.pow(10, decimalplaces);
	return Math.round( Math.round(number * multiply1)/10000 )/divide1 ;
    //return Math.round(number);
}


function calculateTicketToll_CASH(eFrom, eTo) {
	var tToll=0;
	var eFromIndex;
	switch (eFrom) {
		case "Lantana Plaza":
				eFromIndex = 0;
				break;
		case "Lake Worth (Lake Worth Rd.)":
				eFromIndex = 1;
				break;
		case "S.R. 80":
				eFromIndex = 2;
				break;
		case "Jog Rd.":
				eFromIndex = 3;
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				eFromIndex = 4;
				break;
		case "S.R. 710":
				eFromIndex = 5;
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				eFromIndex = 6;
				break;
		case "Jupiter (Indiantown Rd.)":
				eFromIndex = 7;
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				eFromIndex = 8;
				break;
		case "Becker Rd.":
				eFromIndex = 9;
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				eFromIndex = 10;
				break;
		case "Fort Pierce (S.R. 70)":
				eFromIndex = 11;
				break;
		case "Yeehaw Junction (S.R. 60)":
				eFromIndex = 12;
				break;
		case "Three Lakes Plaza":
				eFromIndex = 13;	
				break;				
	}
	switch (eTo) {
		case "Lantana Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_88"))
				break;
		case "Lake Worth (Lake Worth Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_93"))
				break;
		case "S.R. 80":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_97"))
				break;
		case "Jog Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_98"))
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_99"))
				break;
		case "S.R. 710":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_107"))
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_109"))
				break;
		case "Jupiter (Indiantown Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_116"))
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_133"))
				break;
		case "Becker Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_138"))
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_142"))
				break;
		case "Fort Pierce (S.R. 70)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_152"))
				break;
		case "Yeehaw Junction (S.R. 60)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_193"))
				break;
		case "Three Lakes Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_236"))	
				break;				
	}
	return tToll;
}

function calculateTicketToll_CASH_RI(eFrom, eTo) {
	var tToll=0;
	var eFromIndex;
	switch (eFrom) {
		case "Lantana Plaza":
				eFromIndex = 0;
				break;
		case "Lake Worth (Lake Worth Rd.)":
				eFromIndex = 1;
				break;
		case "S.R. 80":
				eFromIndex = 2;
				break;
		case "Jog Rd.":
				eFromIndex = 3;
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				eFromIndex = 4;
				break;
		case "S.R. 710":
				eFromIndex = 5;
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				eFromIndex = 6;
				break;
		case "Jupiter (Indiantown Rd.)":
				eFromIndex = 7;
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				eFromIndex = 8;
				break;
		case "Becker Rd.":
				eFromIndex = 9;
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				eFromIndex = 10;
				break;
		case "Fort Pierce (S.R. 70)":
				eFromIndex = 11;
				break;
		case "Yeehaw Junction (S.R. 60)":
				eFromIndex = 12;
				break;
		case "Three Lakes Plaza":
				eFromIndex = 13;	
				break;				
	}
	switch (eTo) {
		case "Lantana Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_88_RI"))
				break;
		case "Lake Worth (Lake Worth Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_93_RI"))
				break;
		case "S.R. 80":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_97_RI"))
				break;
		case "Jog Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_98_RI"))
				break;
		case "West Palm Beach (Okeechobee Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_99_RI"))
				break;
		case "S.R. 710":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_107_RI"))
				break;
		case "Palm Beach Gardens (PGA Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_109_RI"))
				break;
		case "Jupiter (Indiantown Rd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_116_RI"))
				break;
		case "Stuart (Martin Downs Blvd./S.R. 714)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_133_RI"))
				break;
		case "Becker Rd.":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_138_RI"))
				break;
		case "Port St. Lucie (Port St. Lucie Blvd.)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_142_RI"))
				break;
		case "Fort Pierce (S.R. 70)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_152_RI"))
				break;
		case "Yeehaw Junction (S.R. 60)":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_193_RI"))
				break;
		case "Three Lakes Plaza":
				tToll=parseFloat(xmlDoc.getElementsByTagName("TS_EXIT")[eFromIndex].getAttribute("CASH_E_236_RI"))	
				break;				
	}
	
	//Call a function that takes the adjusted SunPass toll and calculates/rounds properly depending on the number of axles

	return tToll;
}

function electronicOnly(formatCASHTotalToll){
	var spOnly;
	var plza;
	//var formatCASHTotalToll = new NumberFormat();
	if(endExitName == 'S.R. 710' || startExitName == "S.R. 710"){
		plza = "S.R. 710";
		//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at S.R. 710</font></b>"
		spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at S.R. 710</font></b></td>"
	}
	else if(endExitName == 'Consulate Dr.' || startExitName == 'Consulate Dr.'){
		//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at Consulate Dr.</font></b>"
		spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at Consulate</font></b></td>"
	}
	else if(endExitName == 'Becker Rd.' || startExitName == 'Becker Rd.'){
		//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at Becker Rd.</font></b>"
		spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at Becker Rd.</font></b></td>"
	}
	else if(endExitName == 'Jog Rd.' || startExitName == 'Jog Rd.'){
		//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at Jog Rd.</font></b>"
		spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at Jog Rd.</font></b></td>"
	}
	else if(startExitName == 'NW 106th St.'){
		if (mileage > 0) { // direction is South
			spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}else{
			//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at NW 106th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 106th St.</font></b></td>"
		}
	}
	else if(endExitName == 'NW 106th St.'){	
		if (mileage > 0) { // direction is South
			//spOnly = "<b><font color='blue'>Prepaid Electronic Tolls Only at NW 106th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 106th St.</font></b></td>"
		}else{
			spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
			//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}
	}
	else if(endExitName == 'Kissimmee Park Rd.' || startExitName == 'Kissimmee Park Rd.'){
		spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at Kissimmee Pk Rd.</font></b></td>"
		//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at Kissimmee Pk Rd.</font></b>"
	}
	else if(endExitName == 'NW 74th St.'){
		if (mileage > 0) { // direction is South
			spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
			//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}else{
			//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b></td>"
		}		
	}
	else if(startExitName == 'NW 74th St.'){
		if (mileage > 0) { // direction is South
			//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b></td>"
		}else{
			spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
			//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}
	}
	//BEGIN New Pace Road Edits M.Esser 2-15-2012
	else if(endExitName == 'Pace Rd....'){ //<= This will NEVER be true.  Testing something...
		if (mileage > 0) { // direction is South
			spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
			//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}else{
			//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b></td>"
		}		
	}
	else if(startExitName == 'Pace Rd....'){
		if (mileage > 0) { // direction is South
			//spOnly ="<b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b>"
			spOnly ="<td colspan=2><b><font color='blue'>Prepaid Electronic Tolls Only at NW 74th St.</font></b></td>"
		}else{
			spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
			//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
		}
	}
	//END New Pace Road Edits M.Esser 2-15-2012
	else {
		spOnly = "<td><font size=2><b>Cash:&nbsp;&nbsp;&nbsp;</b></font></td><td><font size=2><b>" + formatCASHTotalToll.toFormatted() + "</b></font></td>"
		//spOnly = "Toll with Cash is " + formatCASHTotalToll.toFormatted()
	}
	return spOnly;
}
		
function getBridgeToll(bridge) {
	var outputBridgeToll="";
	var totalBridgeToll=0;
	var CASH_totalBridgeToll=0;
			
	var thisTotal = new NumberFormat();
	var thisTollA = new NumberFormat();
	var thisTollB = new NumberFormat();
	
	var CASH_thisTotal = new NumberFormat();
	var CASH_thisTollA = new NumberFormat();
	var CASH_thisTollB = new NumberFormat();
		isReset1 = false;	
	// Verifies selection of starting and ending exits

	if (isReset1==true) {
		//alert("Select Bridge Name");
	} else {
		for ( var p=0;p<numBridges.length;p++) {
//alert (numBridges.length);
			//if (document.form1.startingExits.options[document.form1.startingExits.selectedIndex].text== numBridges.item(p).text) {
			if (bridge == numBridges.item(p).text) {

				// Payment is done with transponder
					bridgeTollNorth=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("NB"))
					bridgeTollSouth=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("SB"))
					bridgeTollEast=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("EB"))
					bridgeTollWest=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("WB"))
////alert(bridgeTollNorth + '  ' + bridgeTollSouth);
				// Payment is done with cash
					CASH_bridgeTollNorth=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("CASH_NB"))
					CASH_bridgeTollSouth=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("CASH_SB"))
					CASH_bridgeTollEast=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("CASH_EB"))
					CASH_bridgeTollWest=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("CASH_WB"))
				extraAxleToll=parseFloat(xmlDoc.getElementsByTagName("BRIDGE")[p].getAttribute("ADD_AXLE"))
				if ((bridgeTollNorth==999)||(bridgeTollSouth==999)) {
					if (bridgeTollEast>0) {
						bridgeTollEast = bridgeTollEast + (bridgeAxleFactor*extraAxleToll)
						CASH_bridgeTollEast = CASH_bridgeTollEast + (bridgeAxleFactor*extraAxleToll)
					}
					if (bridgeTollWest>0) {
						bridgeTollWest = bridgeTollWest + (bridgeAxleFactor*extraAxleToll)
						CASH_bridgeTollWest = CASH_bridgeTollWest + (bridgeAxleFactor*extraAxleToll)
					}
					totalBridgeToll = bridgeTollEast + bridgeTollWest
					CASH_totalBridgeToll = CASH_bridgeTollEast + CASH_bridgeTollWest
					thisTotal.setNumber(totalBridgeToll)
					thisTollA.setNumber(bridgeTollEast)
					thisTollB.setNumber(bridgeTollWest)
					CASH_thisTotal.setNumber(CASH_totalBridgeToll)
					CASH_thisTollA.setNumber(CASH_bridgeTollEast)
					CASH_thisTollB.setNumber(CASH_bridgeTollWest)
					//outputBridgeToll += "For a " + theCurrent + " axle vehicle, Toll along " + numBridges.item(p).text + " going East-West using SunPass is " + thisTollA.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollA.toFormatted() + ".  Going West-East, toll using SunPass is " + thisTollB.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollB.toFormatted() + ".";
					outputBridgeToll += "For a " + theCurrent + " axle vehicle, going East-West: <BR>Toll using SunPass is " + thisTollA.toFormatted() + "<BR>Toll with cash is " + CASH_thisTollA.toFormatted() + ". <BR>Going West-East: <BR>Toll using SunPass is " + thisTollB.toFormatted() + "<BR>Toll with cash is " + CASH_thisTollB.toFormatted() + ".";
				} else {
					if (bridgeTollNorth>0) {
						bridgeTollNorth = bridgeTollNorth + (bridgeAxleFactor*extraAxleToll)
						CASH_bridgeTollNorth = CASH_bridgeTollNorth + (bridgeAxleFactor*extraAxleToll)
					}
					if (bridgeTollSouth>0) {
						bridgeTollSouth = bridgeTollSouth + (bridgeAxleFactor*extraAxleToll)
						CASH_bridgeTollSouth = CASH_bridgeTollSouth + (bridgeAxleFactor*extraAxleToll)
					}
					totalBridgeToll = bridgeTollNorth + bridgeTollSouth
					CASH_totalBridgeToll = CASH_bridgeTollNorth + CASH_bridgeTollSouth
					thisTotal.setNumber(totalBridgeToll)
					thisTollA.setNumber(bridgeTollNorth)
					thisTollB.setNumber(bridgeTollSouth)
					CASH_thisTotal.setNumber(CASH_totalBridgeToll)
					CASH_thisTollA.setNumber(CASH_bridgeTollNorth)
					CASH_thisTollB.setNumber(CASH_bridgeTollSouth)
					//outputBridgeToll += "For a " + axle + " axle vehicle, Toll along " + numBridges.item(p).text + " going North-South using SunPass is " + thisTollA.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollA.toFormatted() + ".  Going South-North, toll using SunPass is " + thisTollB.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollB.toFormatted() + ".";
					outputBridgeToll += "For a " + axle + " axle vehicle, going North-South: <BR>Toll using SunPass is " + thisTollA.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollA.toFormatted() + ".  <BR> Going South-North: <BR> Toll using SunPass is " + thisTollB.toFormatted() + "<BR> Toll with cash is " + CASH_thisTollB.toFormatted() + ".";
					}
			}
		}
		//document.getElementById("toExitMessage").innerHTML=outputBridgeToll
		//document.getElementById("toExitMessage").style.visibility = "visible";
		//document.getElementById("printButton").style.visibility = "visible";
	}
}
		
function setBridgesList() {
	// populates startingExits combo box with bridges data
	document.form1.startingExits.length = 0;
	for (var i=0; i< numBridges.length; i++) { // Re-populates combo box
		document.form1.startingExits.options[i] = new Option(bridgesList[i],i);	 
	}
	//Makes first option selected by default
	//document.form1.startingExits.options[0].selected=true
}
		
function setExitsComboBoxes() {
	isBridge=false;
	calcMode=9;
	theIndex=0;
	document.getElementById('label1').innerHTML='Select Starting Exit:';
	document.form1.exitsToll.src = "./images/exits_on.gif"
	document.form1.bridgesToll.src = "./images/bridges_off.gif"
	resetAll();
	processSequence(theNextStep);
}
function setBridgesComboBoxes() {
	theIndex=0;
	document.getElementById('label1').innerHTML='Select Bridge Name:';
	isBridge=true;
	calcMode=10;
	document.form1.exitsToll.src = "./images/exits_off.gif"
	document.form1.bridgesToll.src = "./images/bridges_on.gif"
	setBridgesList();
	processSequence(theNextStep);
}
		
function getToll(tollPayment) {
	isTransponder=true
	switch (secondSelection) {
		case "Mid-Bay Bridge":
		  getBridgeToll(secondSelection);
		  break;
		case "Garcon Point Bridge":
		  getBridgeToll(secondSelection);
		  break;
		case "I-275 to St. Pete Beach":
		  getBridgeToll(secondSelection);
		  break;
		case "St. Pete Beach to I-275":
		  getBridgeToll(secondSelection);
		  break;
		case "I-275 to Fort Desoto":
		  getBridgeToll(secondSelection);
		  break;
		case "Fort Desoto to I-275":
		  getBridgeToll(secondSelection);
		  break;
		case "Fort Desoto to St. Pete Beach":
		  getBridgeToll(secondSelection);
		  break;
		case "St. Pete Beach to Fort Desoto":
		  getBridgeToll(secondSelection);
		  break;
		case "St. Pete Beach to 682W":
		  getBridgeToll(secondSelection);
		  break;
		case "682W to St. Pete Beach":
		  getBridgeToll(secondSelection);
		  break;
		case "St. Pete Beach to 682E":
		  getBridgeToll(secondSelection);
		  break;
		case "682E to St. Pete Beach":
		  getBridgeToll(secondSelection);
		  break;
		case "St. Pete Beach to Tierra Verde":
		  getBridgeToll(secondSelection);
		  break;
		case "Tierra Verde to St. Pete Beach":
		  getBridgeToll(secondSelection);
		  break;
		case "682E to I-275":
		  getBridgeToll(secondSelection);
		  break;
		case "I-275 to 682E":
		  getBridgeToll(secondSelection);
		  break;
		case "Tierra Verde to I-275":
		  getBridgeToll(secondSelection);
		  break;
		case "I-275 to Tierra Verde":
		  getBridgeToll(secondSelection);
		  break;
		case "Tierra Verde to Fort Desoto":
		  getBridgeToll(secondSelection);
		  break;
		case "Fort Desoto to Tierra Verde":
		  getBridgeToll(secondSelection);
		  break;
		case "682W to Fort Desoto":
		  getBridgeToll(secondSelection);
		  break;
		case "Fort Desoto to 682W":
		  getBridgeToll(secondSelection);
		  break;
		case "682E to Fort Desoto":
		  getBridgeToll(secondSelection);
		  break;
		case "Fort Desoto to 682E":
		  getBridgeToll(secondSelection);
		  break;
		case "682E to 682W":
		  getBridgeToll(secondSelection);
		  break;
		case "682W to 682E":
		  getBridgeToll(secondSelection);
		  break;
		case "Tierra Verde to 682W":
		  getBridgeToll(secondSelection);
		  break;
		case "Tierra Verde to 682E":
		  getBridgeToll(secondSelection);
		  break;
		case "682E to Tierra Verde":
		  getBridgeToll(secondSelection);
		  break;
		case "682W to Tierra Verde":
		  getBridgeToll(secondSelection);
		  break;
		case "Sunshine Skyway Bridge":
		  getBridgeToll(secondSelection);
		  break;

	 default:
	 calculateToll();
	}		

}

function InstrThing(str,substr,start){
	var oStr = new String(str);
	return oStr.indexOf("Prepaid Electronic Tolls Only",0);
}

function clearRouteArrays(){
	myInlineTollPlazas.length = 0;
	myInlineTollPlazasCASH.length = 0;
}

function sortNorthBound(a,b){
    // this sorts the array using the second element Ascending 
	// Example:  Used for Suncoast: Anclote milepost of 21.836 UP to Oak Hammock milepost = 51.835
	return (a[1] - b[1]);
}

function sortSouthBound(a,b){
    // this sorts the array using the second element in Descending
	// Example:  Used for Suncoast Oak Hammock milepost = 51.835 DOWN to Anclote milepost of 21.836
	return (b[1] - a[1]);
}

